const express = require("express")
const { body, validationResult } = require("express-validator")
const Review = require("../models/Review")
const Job = require("../models/Job")
const User = require("../models/User")
const mongoose = require("mongoose") // Import mongoose
const { auth } = require("../middleware/auth")

const router = express.Router()

// Create a review
router.post(
  "/",
  auth,
  [
    body("job").isMongoId(),
    body("reviewee").isMongoId(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").trim().isLength({ min: 10, max: 500 }),
    body("aspects.quality").optional().isInt({ min: 1, max: 5 }),
    body("aspects.punctuality").optional().isInt({ min: 1, max: 5 }),
    body("aspects.communication").optional().isInt({ min: 1, max: 5 }),
    body("aspects.professionalism").optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { job: jobId, reviewee, rating, comment, aspects } = req.body

      // Verify job exists and is completed
      const job = await Job.findById(jobId)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.status !== "completed") {
        return res.status(400).json({ message: "Can only review completed jobs" })
      }

      // Verify user is part of this job
      const isCustomer = job.customer.toString() === req.user._id.toString()
      const isWorker = job.assignedWorker && job.assignedWorker.toString() === req.user._id.toString()

      if (!isCustomer && !isWorker) {
        return res.status(403).json({ message: "Not authorized to review this job" })
      }

      // Check if review already exists
      const existingReview = await Review.findOne({
        job: jobId,
        reviewer: req.user._id,
      })

      if (existingReview) {
        return res.status(400).json({ message: "You have already reviewed this job" })
      }

      // Create review
      const review = new Review({
        job: jobId,
        reviewer: req.user._id,
        reviewee,
        rating,
        comment,
        aspects,
      })

      await review.save()

      // Update reviewee's rating
      const revieweeUser = await User.findById(reviewee)
      if (revieweeUser) {
        revieweeUser.updateRating(rating)
        await revieweeUser.save()
      }

      const populatedReview = await Review.findById(review._id)
        .populate("reviewer", "name profilePicture")
        .populate("reviewee", "name profilePicture")
        .populate("job", "title")

      res.status(201).json({
        message: "Review created successfully",
        review: populatedReview,
      })
    } catch (error) {
      console.error("Create review error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get reviews for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name profilePicture")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments({ reviewee: req.params.userId })

    // Calculate average ratings
    const avgRatings = await Review.aggregate([
      { $match: { reviewee: mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          avgQuality: { $avg: "$aspects.quality" },
          avgPunctuality: { $avg: "$aspects.punctuality" },
          avgCommunication: { $avg: "$aspects.communication" },
          avgProfessionalism: { $avg: "$aspects.professionalism" },
        },
      },
    ])

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      averages: avgRatings[0] || {},
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
