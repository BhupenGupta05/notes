import { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import Note from './models/note.js'

const app = express()
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('dist'))
app.use(requestLogger)

// let data = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]


app.post('/api/data', (request, response) => {
  const body = request.body

  // if (!body.content) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // date: new Date(),
    // id: generateId(),
  })

  // data = [...data,note]

  // response.json(note)

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//FETCHING DATA FROM THE DATABASE
app.get('/api/data', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })

})


// app.get('/api/data/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = data.find(note => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }

// })

app.get('/api/data/:id', (request,response) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) //ID THAT DOESN'T MATCH THE MONGO IDENTIFIER FORMAT
    })
})

// app.delete('/api/data/:id', (request, response) => {
//   const id = Number(request.params.id)
//   data = data.filter(note => note.id !== id)

//   response.status(204).end()
// })

app.delete('/api/data/:id', (request,response,next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/data/:id', (request, response, next) => {
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

app.use(unknownEndpoint)

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})