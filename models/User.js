const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["worker", "customer"],
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    location: {
      city: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    // Worker-specific fields
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    skills: [String],
    experience: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    portfolio: [
      {
        title: String,
        description: String,
        image: String,
        completedAt: Date,
      },
    ],
    // Rating system
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    // Account status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update rating method
userSchema.methods.updateRating = function (newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating
  this.rating.count += 1
  this.rating.average = totalRating / this.rating.count
}

module.exports = mongoose.model("User", userSchema)
