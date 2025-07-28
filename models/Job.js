const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    budget: {
      min: Number,
      max: Number,
      type: {
        type: String,
        enum: ["hourly", "fixed"],
        default: "hourly",
      },
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    preferredDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["open", "assigned", "in_progress", "completed", "cancelled"],
      default: "open",
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applications: [
      {
        worker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        proposal: String,
        proposedRate: Number,
        estimatedDuration: String,
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    completedAt: Date,
    images: [String],
  },
  {
    timestamps: true,
  },
)

// Index for location-based searches
jobSchema.index({ "location.coordinates": "2dsphere" })

module.exports = mongoose.model("Job", jobSchema)
