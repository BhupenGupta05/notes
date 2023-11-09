//CREATE A WEB SERVER USING NODE
// import http from 'http';

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

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(data))
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)




//CREATE A WEB SERVER USING EXPRESS
import express, { request } from 'express';
import cors from 'cors'

const app = express()
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
}));
app.use(express.static('dist'))

let data = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

// app.get('/', (request,response) => {
//   response.send('<h1>Hello World</h1>')
// })

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: 'dist' });
});

app.get('/api/data', (request,response) => {
  response.json(data)
})

//FETCH OPERATION
app.get('/api/data/:id', (request,response) => {
  const id = Number(request.params.id)
  const note = data.find(item => {
    // console.log(item.id, typeof item.id,id,typeof id, item.id === id)
    return item.id === id
  })

  //If the note id doesnt exist
  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

//DELETE OPERATION
app.delete('/api/data/:id', (request,response) => {
  const id = Number(request.params.id)
  data = data.filter(item => item.id !== id)
  response.status(204).end()
})


//GETTING UNIQUE ID
const generateId = () => {
  const maxId = data.length > 0
  ? Math.max(...data.map(n => n.id))
  : 0

  console.log(maxId);
  return maxId + 1
}

//ADD OPERATION
app.use(express.json())

app.post('/api/data',(request,response) => {

  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  // data = data.concat(note)
  data = [...data,note]
  console.log(note);
  response.json(note)
})

// app.put('/api/data/:id',(request,response) => {
//   const id = Number(request.params.id);
//   const noteToUpdate = data.find((item) => item.id === id)

//   if(!noteToUpdate) {
//     return response.status(404).json({ 
//       error: 'Note not found' 
//     });
//   }

//   noteToUpdate.important = !noteToUpdate.important
//   response.json(noteToUpdate);
// })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

