const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

const workerAuth = (req, res, next) => {
  if (req.user.userType !== "worker") {
    return res.status(403).json({ message: "Access denied. Workers only." })
  }
  next()
}

const customerAuth = (req, res, next) => {
  if (req.user.userType !== "customer") {
    return res.status(403).json({ message: "Access denied. Customers only." })
  }
  next()
}

module.exports = { auth, workerAuth, customerAuth }
