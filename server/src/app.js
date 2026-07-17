import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/authRoutes.js'
import meetingRoutes from './routes/meetingRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

// Accepts CLIENT_ORIGIN from .env, but also auto-allows any http://localhost:<port>
// and any *.vercel.app domain, so it keeps working across local dev and deployment.
const allowedOrigin = process.env.CLIENT_ORIGIN
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true) // curl/postman/no-origin requests
      if (allowedOrigin && origin === allowedOrigin) return callback(null, true)
      if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true)
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/meetings', meetingRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
