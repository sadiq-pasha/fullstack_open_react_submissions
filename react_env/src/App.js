import { useState, useEffect } from 'react'

import Note from './components/Note'
import noteService from './services/notes'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  } else if (message.category === 'errorNotification') {
    return (
      <div className='error'>
        {message.text}
      </div>
    )
  } else if (message.category === 'successNotification') {
    return (
      <div className='addNotification'>
        {message.text}
      </div>
    )
  }

}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Comp Sci, U of H</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect (() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  },[])

  const addNote = (event) => {
    event.preventDefault()
    if (newNote.length < 5) {
      setNotification(
        {
          text: 'Note should be at least 5 characters long',
          category: 'errorNotification'
        }
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } else {
      const noteObject = {
        content: newNote,
        important: Math.random() > 0.5,
      }
      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
          setNotification(
            {
              text: 'Note successfully added',
              category: 'successNotification'
            }
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const handleReset = () => {
    noteService.reset()
      .then(response => {
        setNotification(
          {
            text: `${response.deleteCount} note(s) were deleted`,
            category: 'successNotification'
          }
        )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNewNote('')
        setNotes([])
        setShowAll(true)
      })
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch((error) => {
        if (window.confirm('this note does not exist on the server. \n delete the note?')) {
          setNotification(
            {
              text: `note has been removed \n (${error.message})`,
              category: 'errorNotification'
            }
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setNotes(notes.filter(n => n.id !== id))
        }
      })
  }

  const deleteNotes = (id) => {
    noteService.deleteByID(id)
      .then(responseCode => {
        if (responseCode === 200) {
          setNotes(notes.filter(n => n.id !== id))
          setNotification(
            {
              text: 'Note successfully deleted',
              category: 'successNotification'
            }
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        }
      })
      .catch((error) => {
        setNotification(
          {
            text: `this note does not exist on the server \n (${error.message})`,
            category: 'errorNotification'
          }
        )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  return (
    <div>
      <h2>NOTES</h2>
      <table>
        <tbody>
          {notesToShow.map((note) =>
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportance(note.id)}
              deleteNote={() => deleteNotes(note.id)}
            />
          )}
        </tbody>
      </table>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>submit</button>
      </form>
      <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
      <button onClick={handleReset}>reset</button>
      <Notification message={notification}/>
      <Footer/>
    </div>
  )
}

export default App