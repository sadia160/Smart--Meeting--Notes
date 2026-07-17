import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

function toClientUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email }
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'That email is already registered' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      user: toClientUser(user),
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      user: toClientUser(user),
      token: generateToken(user._id),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  res.json({ user: toClientUser(req.user) })
}
