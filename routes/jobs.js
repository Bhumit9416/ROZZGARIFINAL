const express = require("express")
const { body, validationResult } = require("express-validator")
const Job = require("../models/Job")
const User = require("../models/User")
const { auth, customerAuth, workerAuth } = require("../middleware/auth")

const router = express.Router()

// Create a new job (customers only)
router.post(
  "/",
  auth,
  customerAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 20 }),
    body("service").isMongoId(),
    body("location.address").trim().isLength({ min: 5 }),
    body("location.city").trim().isLength({ min: 2 }),
    body("budget.min").isNumeric(),
    body("budget.max").isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const jobData = {
        ...req.body,
        customer: req.user._id,
      }

      const job = new Job(jobData)
      await job.save()

      const populatedJob = await Job.findById(job._id).populate("customer", "name profilePicture").populate("service")

      res.status(201).json({
        message: "Job posted successfully",
        job: populatedJob,
      })
    } catch (error) {
      console.error("Create job error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const { service, city, status = "open", urgency, minBudget, maxBudget, page = 1, limit = 10 } = req.query

    const filter = { status }

    if (service) filter.service = service
    if (city) filter["location.city"] = new RegExp(city, "i")
    if (urgency) filter.urgency = urgency
    if (minBudget) filter["budget.min"] = { $gte: Number.parseFloat(minBudget) }
    if (maxBudget) filter["budget.max"] = { $lte: Number.parseFloat(maxBudget) }

    const jobs = await Job.find(filter)
      .populate("customer", "name profilePicture location")
      .populate("service")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(filter)

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("customer", "name profilePicture phone location")
      .populate("service")
      .populate("assignedWorker", "name profilePicture rating")
      .populate("applications.worker", "name profilePicture rating")

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json(job)
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Apply for a job (workers only)
router.post(
  "/:id/apply",
  auth,
  workerAuth,
  [
    body("proposal").trim().isLength({ min: 20 }),
    body("proposedRate").isNumeric(),
    body("estimatedDuration").trim().isLength({ min: 2 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const job = await Job.findById(req.params.id)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      if (job.status !== "open") {
        return res.status(400).json({ message: "Job is no longer accepting applications" })
      }

      // Check if worker already applied
      const existingApplication = job.applications.find((app) => app.worker.toString() === req.user._id.toString())

      if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this job" })
      }

      const application = {
        worker: req.user._id,
        proposal: req.body.proposal,
        proposedRate: req.body.proposedRate,
        estimatedDuration: req.body.estimatedDuration,
      }

      job.applications.push(application)
      await job.save()

      const updatedJob = await Job.findById(job._id).populate("applications.worker", "name profilePicture rating")

      res.json({
        message: "Application submitted successfully",
        job: updatedJob,
      })
    } catch (error) {
      console.error("Apply for job error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Accept application (customers only)
router.patch("/:id/accept/:applicationId", auth, customerAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    if (job.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const application = job.applications.id(req.params.applicationId)
    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Update job status and assign worker
    job.status = "assigned"
    job.assignedWorker = application.worker
    application.status = "accepted"

    // Reject other applications
    job.applications.forEach((app) => {
      if (app._id.toString() !== req.params.applicationId) {
        app.status = "rejected"
      }
    })

    await job.save()

    const updatedJob = await Job.findById(job._id)
      .populate("assignedWorker", "name profilePicture")
      .populate("applications.worker", "name profilePicture")

    res.json({
      message: "Application accepted successfully",
      job: updatedJob,
    })
  } catch (error) {
    console.error("Accept application error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update job status
router.patch(
  "/:id/status",
  auth,
  [body("status").isIn(["in_progress", "completed", "cancelled"])],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const job = await Job.findById(req.params.id)
      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      // Check authorization
      const isCustomer = job.customer.toString() === req.user._id.toString()
      const isAssignedWorker = job.assignedWorker && job.assignedWorker.toString() === req.user._id.toString()

      if (!isCustomer && !isAssignedWorker) {
        return res.status(403).json({ message: "Not authorized" })
      }

      job.status = req.body.status
      if (req.body.status === "completed") {
        job.completedAt = new Date()
      }

      await job.save()

      res.json({ message: "Job status updated successfully", job })
    } catch (error) {
      console.error("Update job status error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's jobs
router.get("/user/my-jobs", auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const filter = {}
    if (req.user.userType === "customer") {
      filter.customer = req.user._id
    } else {
      filter.assignedWorker = req.user._id
    }

    if (status) filter.status = status

    const jobs = await Job.find(filter)
      .populate("customer", "name profilePicture")
      .populate("service")
      .populate("assignedWorker", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(filter)

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get user jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
