const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')

if (process.env.NODE_ENV !== 'production') {
  config = require('./utils/config')
}



app.use('/api/blogs', blogsRouter)

app.use(cors())
app.use(bodyParser.json())


const mongoUrl = config.mongoUrl
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise


const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close();
})

module.exports = {
  app,
  server
}