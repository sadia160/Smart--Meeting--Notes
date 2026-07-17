// Vercel serverless entry point. Vercel automatically turns any file
// inside /api into a serverless function — no app.listen() needed here.
import { connectDB } from '../src/config/db.js'
import app from '../src/app.js'

let isConnected = false

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB()
    isConnected = true
  }
  return app(req, res)
}
