const express = require('express');
const Note = require('../models/note.js');

const notesRouter = express.Router();

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)

})

//FETCH OPERATION

notesRouter.get('/:id', (request,response,next) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//ADD OPERATION

notesRouter.post('/', (request, response,next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save().then(savedNote => {
    response.status(201).json(savedNote)
  })
    .catch(error => next(error))
})

//DELETE OPERATION

notesRouter.delete('/:id', (request,response,next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// UPDATE OPERATION

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new:true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter;