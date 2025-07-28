const express = require("express")
const Service = require("../models/Service")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 })
    res.json(services)
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get services by category
router.get("/category/:category", async (req, res) => {
  try {
    const services = await Service.find({
      category: req.params.category,
      isActive: true,
    }).sort({ name: 1 })

    res.json(services)
  } catch (error) {
    console.error("Get services by category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
