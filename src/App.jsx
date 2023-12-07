import { useEffect, useState } from "react"
import Note from "./components/Note"
import axios from 'axios'
import noteService from './services/notes'
import Notification from "./components/Notification"
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import Togglable from "./components/Togglable"
import NoteForm from './components/NoteForm'

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

  const [notes,setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user)) 
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
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      noteService.setToken(user.token)    
    }  
  }, [])

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

  const addNote = (noteObj) => {
    noteService
    .create(noteObj)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
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

  const handleLogout = () => {
    // Remove the token from local storage
    window.localStorage.removeItem('loggedNoteappUser')
    // Clear the user state
    setUser(null)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
        <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote}/>
    </Togglable>
  )

  return (
    <div>
      <h1 className="text-4xl font-semibold my-2 mx-4 mb-4">Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p> 
        <button type="submit" className="px-4 py-1 bg-slate-400" onClick={handleLogout} >logout</button>
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


