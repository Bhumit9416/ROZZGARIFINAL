const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Service = require("../models/Service")
const Job = require("../models/Job")

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rozzgari")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Service.deleteMany({})
    await Job.deleteMany({})
    console.log("Cleared existing data")

    // Create services
    const services = [
      {
        name: "Electrical Work",
        description: "Professional electrical installation and repair services",
        category: "electrical",
        averageRate: { min: 500, max: 1200 },
      },
      {
        name: "Plumbing Services",
        description: "Expert plumbing installation, repair, and maintenance",
        category: "plumbing",
        averageRate: { min: 400, max: 1000 },
      },
      {
        name: "House Cleaning",
        description: "Professional house cleaning and maintenance services",
        category: "cleaning",
        averageRate: { min: 300, max: 800 },
      },
      {
        name: "Construction Work",
        description: "General construction and building services",
        category: "construction",
        averageRate: { min: 600, max: 1500 },
      },
      {
        name: "AC Repair",
        description: "Air conditioning installation and repair services",
        category: "repair",
        averageRate: { min: 800, max: 2000 },
      },
      {
        name: "Painting Services",
        description: "Professional painting and decoration services",
        category: "maintenance",
        averageRate: { min: 400, max: 1200 },
      },
    ]

    const createdServices = await Service.insertMany(services)
    console.log("Created services")

    // Create sample users
    const users = [
      // Workers
      {
        name: "Ahmed Hassan",
        email: "ahmed@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "+92-300-1234567",
        userType: "worker",
        services: [createdServices[0]._id], // Electrical
        skills: ["Wiring", "Circuit Installation", "Electrical Repair"],
        experience: 8,
        hourlyRate: 800,
        bio: "Experienced electrician with 8 years in residential and commercial electrical work.",
        location: {
          city: "Karachi",
          address: "Block 15, Gulshan-e-Iqbal",
        },
        rating: { average: 4.9, count: 127 },
        isVerified: true,
      },
      {
        name: "Fatima Ali",
        email: "fatima@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "+92-301-2345678",
        userType: "worker",
        services: [createdServices[2]._id], // Cleaning
        skills: ["House Cleaning", "Deep Cleaning", "Office Cleaning"],
        experience: 5,
        hourlyRate: 500,
        bio: "Professional house cleaner providing reliable and thorough cleaning services.",
        location: {
          city: "Lahore",
          address: "Model Town",
        },
        rating: { average: 4.8, count: 89 },
        isVerified: true,
      },
      {
        name: "Muhammad Khan",
        email: "muhammad@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "+92-302-3456789",
        userType: "worker",
        services: [createdServices[1]._id], // Plumbing
        skills: ["Pipe Installation", "Leak Repair", "Bathroom Fitting"],
        experience: 10,
        hourlyRate: 700,
        bio: "Expert plumber with a decade of experience in all types of plumbing work.",
        location: {
          city: "Islamabad",
          address: "F-10 Markaz",
        },
        rating: { average: 4.7, count: 156 },
        isVerified: true,
      },
      // Customers
      {
        name: "Sarah Ahmed",
        email: "sarah@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "+92-303-4567890",
        userType: "customer",
        location: {
          city: "Karachi",
          address: "DHA Phase 5",
        },
      },
      {
        name: "Ali Raza",
        email: "ali@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "+92-304-5678901",
        userType: "customer",
        location: {
          city: "Lahore",
          address: "Johar Town",
        },
      },
    ]

    const createdUsers = await User.insertMany(users)
    console.log("Created users")

    // Create sample jobs
    const jobs = [
      {
        title: "Electrical Wiring for New House",
        description: "Need complete electrical wiring for a 3-bedroom house. All materials will be provided.",
        customer: createdUsers.find((u) => u.email === "sarah@example.com")._id,
        service: createdServices[0]._id,
        location: {
          address: "House No. 123, DHA Phase 5",
          city: "Karachi",
        },
        budget: { min: 15000, max: 25000, type: "fixed" },
        urgency: "medium",
        status: "open",
      },
      {
        title: "Weekly House Cleaning",
        description: "Looking for a reliable person for weekly house cleaning. 2-bedroom apartment.",
        customer: createdUsers.find((u) => u.email === "ali@example.com")._id,
        service: createdServices[2]._id,
        location: {
          address: "Block C, Johar Town",
          city: "Lahore",
        },
        budget: { min: 2000, max: 3000, type: "fixed" },
        urgency: "low",
        status: "open",
      },
    ]

    await Job.insertMany(jobs)
    console.log("Created jobs")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
