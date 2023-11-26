const config = require('./utils/config.js');
const logger = require('./utils/logger.js');
require('express-async-errors')
const { requestLogger,unknownEndpoint,errorHandler } = require('./utils/middleware.js')
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const notesRouter = require('./controllers/notes.js')
const usersRouter = require('./controllers/users')


logger.info('connecting to ',config.MONGODB_URL)
mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.use('/api/data', notesRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app