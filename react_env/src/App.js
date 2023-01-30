import { useState, useEffect } from 'react'

import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)

    useEffect (() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    },[])

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() > 0.5,
        }
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    const handleReset = () => {
        setNewNote('')
        setNotes([])
        setShowAll(true)
    }

    const toggleImportance = (id) => {
        console.log(id)
        const note = notes.find(n => n.id === id)
        const changedNote = {...note, important: !note.important}
        
        noteService
            .update(id, changedNote)
            .then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                alert(`the note ${note.content} was already deleted from the server`)
                setNotes(notes.filter(n => n.id !== id))
            })
    }
    
    const notesToShow = showAll ? notes : notes.filter(note => note.important)
    
    return (
        <div>
            <h2>NOTES</h2>
            <ul>
                {notesToShow.map((note, index) => 
                    <Note 
                        key={note.id} 
                        note={note} 
                        toggleImportance={() => toggleImportance(note.id)}/>
                    )
                }
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type='submit'>submit</button>
            </form>
            <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
            <button onClick={handleReset}>reset</button>
        </div>
    )
}

export default App