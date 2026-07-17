// Used only for local development (npm run dev).
// On Vercel, api/index.js is used instead (serverless — no app.listen needed).
import dotenv from 'dotenv'
dotenv.config()

import { connectDB } from './src/config/db.js'
import app from './src/app.js'

await connectDB()

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use. Another server is probably already running.`)
    console.error(`Close that terminal/process first, then run "npm run dev" again.\n`)
    process.exit(1)
  }
  throw err
})
