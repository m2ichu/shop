import User from '../models/User.model.js'
import jwt from 'jsonwebtoken'

export const isAdmin = async (req, res, next) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}