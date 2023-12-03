import { useEffect, useState } from "react"
import Note from "./components/Note"
import axios from 'axios'
import noteService from './services/notes'
import Notification from "./components/Notification"
import loginService from './services/login'

const App = () => {
  // const initialItems = [
  //   {
  //     "id": 1,
  //     "content": "HTML is easy",
  //     "important": true
  //   },
  //   {
  //     "id": 2,
  //     "content": "Browser can execute only JavaScript",
  //     "important": false
  //   },
  //   {
  //     "id": 3,
  //     "content": "GET and POST are the most important methods of HTTP protocol",
  //     "important": true
  //   }
  // ]

  const[notes,setNotes] = useState([])
  const[newNote,setNewNote] = useState('')
  const[showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const[user, setUser] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({username, password})
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setErrorMessage('Wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }
  }

  useEffect(() => {
    noteService
    .getAll()
    .then(initialItems => {
      setNotes(initialItems)
    })
  },[])

  // useEffect(() => {
  //   console.log('effect')
  //   axios
  //   .get('http://localhost:3001/data')
  //   .then(response => {
  //     console.log('fulfilled')
  //     setNotes(response.data)
  //   })
  // },[])

 

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const handleInputChange = (e) => {
    console.log(e.target.value);
    setNewNote(e.target.value)
  }

  const addNote = (e) => {
    e.preventDefault()
    console.log(e.target);

    const noteObj = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService
    .create(noteObj)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })

    // axios
    //   .post('http://localhost:3001/data', noteObj)
    //   .then(response => {
    //     setNotes(notes.concat(response.data))
    //     setNewNote('')
    //     console.log(response.data)
    //   })


    // setNotes([...notes,{id: notes.length + 1, content: newNote, important: Math.random() > .5}])
    // setNewNote('')
  }

  const toggleImportanceOf = id => {
    // console.log(`importance of ${id} needs to be toggled`)
    // const url = `http://localhost:3001/data/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch((error) => {
        setErrorMessage(`Note '${note.content}' was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        // setNotes(notes.filter(n => n.id !== id))
      })

    // axios.put(url,changedNote)
    // .then(response => {
    //   setNotes(notes.map(n => n.id !== id ? n : response.data))
    // })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
          Username : 
          <input type="text" name="Username" value={username} onChange={({target}) => setUsername(target.value)} className="bg-slate-200 px-6 py-1 rounded-sm outline-none my-1" />
        </div>

        <div>
          Password : 
          <input type="text" name="Password" value={password} onChange={({target}) => setPassword(target.value)} className="bg-slate-200 px-6 py-1 rounded-sm outline-none my-1" />
        </div>
        <button type="submit" className="mx-2 bg-pink-400 rounded-sm px-4 py-1 hover:bg-pink-300">Login</button>
      </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote} className="mx-2">
        <input type="text" value={newNote} onChange={handleInputChange} className="bg-slate-200 px-6 py-1 rounded-sm outline-none"/>
        <button type="submit" className="mx-2 bg-blue-500 rounded-sm px-4 py-1 hover:bg-blue-600">Save</button>
      </form>
  )

  return (
    <div>
      <h1 className="text-4xl font-semibold my-2 mx-4 mb-4">Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        {noteForm()}
      </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)} className="bg-blue-400 px-4 py-1 mx-2 rounded-sm">Show {showAll ? 'important' : 'all'}</button>
      </div>

      <ul className="mx-2">
        {notesToShow.map(note => 
        <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      
    </div>
  )
}


export default App


