const mongoose = require('mongoose')

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB Connected Successfully')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectDatabase
