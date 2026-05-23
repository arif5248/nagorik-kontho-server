const dotenv = require('dotenv')

// Config
dotenv.config({ path: './config/config.env' })

const app = require('./app')
const connectDatabase = require('./config/database')

// Connect Database
connectDatabase()

// Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
