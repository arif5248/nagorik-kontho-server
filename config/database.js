const mongoose = require('mongoose')

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

const connectDatabase = async () => {
  try {
    if (cached.conn) {
      return cached.conn
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing')
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
    }

    cached.conn = await cached.promise

    console.log('MongoDB Connected Successfully')

    return cached.conn
  } catch (error) {
    console.log('MongoDB Connection Error:', error.message)
    throw error
  }
}

module.exports = connectDatabase
