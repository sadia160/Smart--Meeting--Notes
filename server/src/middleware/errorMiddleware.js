export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found - ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || 'Server error'

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 400
    message = 'That email is already registered'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
