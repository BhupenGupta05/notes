const NoteForm = ({onSubmit, handleChange, value}) => {
  return (
    <div>
        <h2>Create a new note</h2>

        <form onSubmit={onSubmit} className="mx-2">
            <input type="text" value={value} onChange={handleChange} className="bg-slate-200 px-6 py-1 rounded-sm outline-none"/>
            <button type="submit" className="mx-2 bg-blue-500 rounded-sm px-4 py-1 hover:bg-blue-600">Save</button>
      </form>
    </div>
  )
}

export default NoteForm