const Note = ({ note,toggleImportance }) => {
  const label = note.important ? 'make not important': 'make important'

  return (
    <li className="my-2">{note.content}
      <button onClick={toggleImportance} className="w-auto px-2 py-1 bg-slate-400 mx-2 rounded-sm">{label}</button>
    </li>
  )
}

export default Note