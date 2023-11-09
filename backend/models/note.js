import { config } from 'dotenv'
config()
import mongoose from 'mongoose'

mongoose.set('strictQuery', false)
// CONNECTION TO DATABASE
// DO NOT SAVE YOUR PASSWORD TO GITHUB!

const url = process.env.MONGODB_URL

console.log('connecting to', url)

mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


//Since we are validating the content here, there is no need to check for it in the POST request
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

//FORMAT THE OBJECTS RETURNED BY THE DATABASE

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

export default Note