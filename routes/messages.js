const express = require("express")
const { body, validationResult } = require("express-validator")
const Message = require("../models/Message")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Send a message
router.post(
  "/",
  auth,
  [body("receiver").isMongoId(), body("content").trim().isLength({ min: 1 }), body("job").optional().isMongoId()],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const message = new Message({
        sender: req.user._id,
        receiver: req.body.receiver,
        content: req.body.content,
        job: req.body.job,
      })

      await message.save()

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name profilePicture")
        .populate("receiver", "name profilePicture")

      res.status(201).json({
        message: "Message sent successfully",
        data: populatedMessage,
      })
    } catch (error) {
      console.error("Send message error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get conversation between two users
router.get("/conversation/:userId", auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const otherUserId = req.params.userId

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name profilePicture")
      .populate("receiver", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() },
    )

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(
        (await Message.countDocuments({
          $or: [
            { sender: req.user._id, receiver: otherUserId },
            { sender: otherUserId, receiver: req.user._id },
          ],
        })) / limit,
      ),
      currentPage: page,
    })
  } catch (error) {
    console.error("Get conversation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all conversations for a user
router.get("/conversations", auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", req.user._id] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$receiver", req.user._id] }, { $eq: ["$isRead", false] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "otherUser",
        },
      },
      {
        $unwind: "$otherUser",
      },
      {
        $project: {
          otherUser: {
            _id: 1,
            name: 1,
            profilePicture: 1,
            userType: 1,
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ])

    res.json(conversations)
  } catch (error) {
    console.error("Get conversations error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
