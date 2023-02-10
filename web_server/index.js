const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        date: '2019-05-30T17:30:31.098Z',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only JavaScript',
        date: '2019-05-30T18:39:34.091Z',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        date: '2019-05-30T19:20:14.298Z',
        important: true
    }
]

function generateID() {
    const maxID = notes.length > 0 ? Math.max(...notes.map(note => note.id)): 0
    return maxID + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World! this is now using nodemon<h1/>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })
    if (note) {
        response.json(note)
    }
    else {
        response.statusMessage = 'Resource does not exist'
        response.status(404).end()
    }
})

app.post('/api/notes', (request, response) => {
    if (!request.body.content) {
        return response.status(404).json({
            error: 'content missing'
        })
    }
    const note = {
        content: request.body.content,
        important: request.body.important || false,
        date: new Date(),
        id: generateID(),
    }
    notes = notes.concat(note)
    response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
