import { useState, useEffect } from 'react'
import phoneBookService from './services/numbers'

const defaultPhonebook = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

const Display = ({persons, filterName, handleDelete}) => {
    let filteredPersonsList = persons.filter((person) => {
        return person.name.toLowerCase().includes(filterName.toLowerCase())
    });
    if (!persons) {
        return (
            <div>
                The phonebook is empty
            </div>
        )
    } else {
        return (
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                    </tr>
                        {filteredPersonsList.map(person => {
                                return (
                                    <tr key={person.name}>
                                        <td>{person.name}</td>
                                        <td>{person.number}</td>
                                        <td><button id={person.id} onClick={(event) => handleDelete(event)}>delete</button></td>
                                    </tr>
                                )
                            })}
                </tbody>
            </table>
        )
    }
}

const Form = (props) => {
    return (      
    <form>
        <div>
            Name*: <input value={props.newName} onChange={(event) => props.handleInputChange(event, "name")}/>
        </div>
        <div>
            Number*: <input type="number" value={props.newNumber} onChange={(event) => props.handleInputChange(event, "number")}/>
        </div>
        <div>
            <button type="submit" onClick={(event) => props.handleNewEntry(event, "add")}>add</button>
        </div>
        <div>
            <button type="submit" onClick={(event) => props.handleNewEntry(event, "reset")}>reset</button>
        </div>
    </form>

    )
}

const Filter = (props) => {
    return (
        <div>
            filter by name: <input value={props.filterName} onChange={(event) => props.handleInputChange(event, "filter")}/>
        </div>
    )
}

const PhoneBook = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')

    useEffect(() => {
        phoneBookService
            .getPhonebookEntries()
            .then((initialEntries) => {
                setPersons(initialEntries)
            })
    },[])

    const handleNewEntry = (event, buttonFunction) => {
        event.preventDefault()
        if (buttonFunction === "add") {
            if (newName === "") {
                alert(`Name cannot be blank`)
            } else if (newNumber === "") {
                alert(`Number cannot be blank`)
            } else if (persons.map(person => person.name).includes(newName)) {
                if (window.confirm(`${newName} already exists in the phonebook. replace their number?`)) {
                    const entry = persons.find(p => p.name === newName)
                    const updatedEntry = {...entry, number: newNumber}
                    phoneBookService
                        .updatePhonebookEntries(updatedEntry.id, updatedEntry)
                        .then(response => setPersons(persons.map(p => p.id !== updatedEntry.id ? p : response)))
                }
            } else if (newName && newNumber) {
                const newPerson = {
                    name: newName,
                    number: newNumber
                }
                phoneBookService.createPhonebookEntries(newPerson)
                    .then(response => {
                        setPersons(persons.concat(response))
                    })
            setNewName("")
            setNewNumber("")
            }
        }
    }

    const handleInputChange = (event, inputField) => {
    // console.log(inputField)
        if (inputField === "name") {
            setNewName(event.target.value)
        } else if (inputField === "number") {
            setNewNumber(event.target.value)
        } else if (inputField === "filter") {
            setFilterName(event.target.value)
        }
    }

    const handleDelete = (event) => {
        const deleteEntry = persons.filter(p => p.id === parseInt(event.target.id))
        if (window.confirm(`${deleteEntry[0].name} will be deleted. Are you sure?`)) {
            phoneBookService
                .deletePhonebookEntries(event.target.id)
                .then(setPersons(persons.filter(p => p.id !== parseInt(event.target.id))))
        }
    }

  return (
    <div>
        <h2>PHONEBOOK</h2>
        <Filter filterName={filterName} handleInputChange={handleInputChange}/>
        <Form newName={newName} newNumber={newNumber} handleInputChange={handleInputChange} handleNewEntry={handleNewEntry}/>
        <h3>Numbers</h3>
        <Display persons={persons} filterName={filterName} handleDelete={handleDelete}/>
    </div>
  )
}

export default PhoneBook