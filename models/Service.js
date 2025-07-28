const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["electrical", "plumbing", "cleaning", "construction", "repair", "maintenance", "other"],
    },
    icon: {
      type: String,
      default: "",
    },
    averageRate: {
      min: Number,
      max: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Service", serviceSchema)
