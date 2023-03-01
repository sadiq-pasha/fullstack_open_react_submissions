const Note = ({ note, toggleImportance, deleteNote }) => {
  const label = note.important ? 'make not important' : 'make important'
  const dynamicClassName = note.important ? 'note-important' : 'note-not-important'
  return (
    <tr>
      <td className={dynamicClassName}>{note.content}</td>
      <td><button onClick={toggleImportance}>{label}</button></td>
      <td><button onClick={deleteNote}>delete</button></td>
    </tr>
  )
}

export default Note