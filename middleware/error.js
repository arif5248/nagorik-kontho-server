const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  // Wrong MongoDB Object ID
  if (err.name === 'CastError') {
    err.message = `Resource not found. Invalid: ${err.path}`
    err.statusCode = 400
  }

  // Duplicate MongoDB key error
  if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered`
    err.statusCode = 400
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    err.message = 'JSON Web Token is invalid. Try again.'
    err.statusCode = 400
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    err.message = 'JSON Web Token is expired. Try again.'
    err.statusCode = 400
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}

module.exports = errorMiddleware
