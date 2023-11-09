import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'
import express from 'express'
const app = express()
import cors from 'cors'
import mongoose from 'mongoose'
import notesRouter from './controllers/notes.js'


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
app.use(middleware.requestLogger)

app.use('/api/data', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app