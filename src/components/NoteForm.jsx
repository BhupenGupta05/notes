const NoteForm = ({createNote}) => {
  const [newNote,setNewNote] = useState('')

  const addNote = (e) => {
    e.preventDefault()
    console.log(e.target);

    createNote({
      content: newNote,
      important: Math.random() < 0.5,
    })
      setNewNote('')
  }

  return (
    <div>
        <h2>Create a new note</h2>

        <form onSubmit={addNote} className="mx-2">
            <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} className="bg-slate-200 px-6 py-1 rounded-sm outline-none"/>
            <button type="submit" className="mx-2 bg-blue-500 rounded-sm px-4 py-1 hover:bg-blue-600">Save</button>
      </form>
    </div>
  )
}

export default NoteForm