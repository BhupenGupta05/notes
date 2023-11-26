const mongoose = require('mongoose');

//Since we are validating the content here, there is no need to check for it in the POST request
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
  user: {    
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User'  
  }
})

//FORMAT THE OBJECTS RETURNED BY THE DATABASE

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

