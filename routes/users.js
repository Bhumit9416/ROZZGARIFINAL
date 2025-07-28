const express = require("express")
const multer = require("multer")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const Review = require("../models/Review")
const { auth, workerAuth } = require("../middleware/auth")

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"), false)
    }
  },
})

// Get all workers with filters
router.get("/workers", async (req, res) => {
  try {
    const {
      service,
      city,
      minRating,
      maxRate,
      availability,
      page = 1,
      limit = 10,
      sortBy = "rating.average",
    } = req.query

    const filter = { userType: "worker", isActive: true }

    if (service) filter.services = service
    if (city) filter["location.city"] = new RegExp(city, "i")
    if (minRating) filter["rating.average"] = { $gte: Number.parseFloat(minRating) }
    if (maxRate) filter.hourlyRate = { $lte: Number.parseFloat(maxRate) }
    if (availability) filter.availability = availability

    const sortOptions = {}
    sortOptions[sortBy] = -1

    const workers = await User.find(filter)
      .populate("services")
      .select("-password")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(filter)

    res.json({
      workers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get workers error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get worker profile
router.get("/worker/:id", async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      userType: "worker",
    })
      .populate("services")
      .select("-password")

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    // Get recent reviews
    const reviews = await Review.find({ reviewee: worker._id })
      .populate("reviewer", "name profilePicture")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({ worker, reviews })
  } catch (error) {
    console.error("Get worker error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  auth,
  upload.single("profilePicture"),
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("phone").optional().isMobilePhone(),
    body("bio").optional().isLength({ max: 500 }),
    body("hourlyRate").optional().isNumeric(),
    body("experience").optional().isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const updates = req.body

      // Handle file upload (you would integrate with Cloudinary here)
      if (req.file) {
        // For now, we'll just store a placeholder
        updates.profilePicture = `/uploads/${Date.now()}-${req.file.originalname}`
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select(
        "-password",
      )

      res.json({ message: "Profile updated successfully", user })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Add portfolio item (workers only)
router.post(
  "/portfolio",
  auth,
  workerAuth,
  upload.single("image"),
  [body("title").trim().isLength({ min: 2 }), body("description").trim().isLength({ min: 10 })],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, description } = req.body
      const portfolioItem = {
        title,
        description,
        image: req.file ? `/uploads/${Date.now()}-${req.file.originalname}` : "",
        completedAt: new Date(),
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { portfolio: portfolioItem } },
        { new: true },
      ).select("-password")

      res.json({ message: "Portfolio item added successfully", user })
    } catch (error) {
      console.error("Add portfolio error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update availability (workers only)
router.patch(
  "/availability",
  auth,
  workerAuth,
  [body("availability").isIn(["available", "busy", "offline"])],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { availability: req.body.availability },
        { new: true },
      ).select("-password")

      res.json({ message: "Availability updated successfully", user })
    } catch (error) {
      console.error("Update availability error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
