const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const api = supertest(app)
const Note = require('../models/note.js')

const initialNotes = [  
  {    
    content: 'HTML is easy',    
    important: false,  
  },  
  {    
    content: 'Browser can execute only JavaScript',    
    important: true,  
  },
]

//The database is cleared out at the beginning, and after that, we save the two notes stored in the initialNotes array to the database. By doing this, we ensure that the database is in the same state before every test is run.

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/data')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are two notes', async () => {
  const response = await api.get('/api/data')

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/data')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain( 'Browser can execute only JavaScript')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
  .post('/api/data')
  .send(newNote)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/data')

  const contents = response.body.map(r => r.content)

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain('async/await simplifies making async calls')
})

afterAll(async () => {
  await mongoose.connection.close()
})