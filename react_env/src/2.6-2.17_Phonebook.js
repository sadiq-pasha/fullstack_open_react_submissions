import { useState, useEffect } from 'react'
import phoneBookService from './services/numbers'

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
            <p>WARNING! reset could crash the server.<br/>
            JSON-server has a bug where it reloads the db.json after a batch of requests.<br/>
            If a POST request is made during the reload it throws a 404 error and crashes the server.<br/>
            This can be avoided by not using the --watch flag when starting the server (that has problems of its own).</p>
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

const AddSuccessNotification = (props) => {
    if (props.name === null) {
        return null
    } else {
        return (
            <div className='addNotification'>
                Added {props.name} to the phonebook
            </div>
        )
    }
}
const DeleteErrorNotification = (props) => {
    if (props.name === null) {
        return null
    } else {
        return (
            <div className='deleteErrorNotification'>
                {props.name} has already been deleted
            </div>
        )
    }
}


const PhoneBook = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filterName, setFilterName] = useState('')
    const [phonebookChangeNotification, setPhonebookChangeNotification] = useState(null)
    const [deleteErrorNotification, setDeleteErrorNotification] = useState(null)

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
                        .catch(() => {
                            setDeleteErrorNotification(newName)
                            setTimeout(() => {
                                setDeleteErrorNotification(null)
                            }, 3000);
                            phoneBookService
                                .getPhonebookEntries()
                                .then((response) => setPersons(response))
                        })
                }
            } else if (newName && newNumber) {
                const newPerson = {
                    name: newName,
                    number: newNumber
                }
                phoneBookService.createPhonebookEntries(newPerson)
                    .then(response => {
                        setPersons(persons.concat(response))
                        setPhonebookChangeNotification(response.name)
                        setTimeout(() => {
                            setPhonebookChangeNotification(null)
                        }, 3000);
                        setNewName("")
                        setNewNumber("")
                    })
                }
            } else if (buttonFunction === "reset") {
                phoneBookService.resetDefault(persons)
                    .then((response) => {
                        setPersons(response)
                    })
            }
        }
        
    const handleInputChange = (event, inputField) => {
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
                .deletePhonebookEntries(deleteEntry[0].id)
                .catch(() => {
                    setDeleteErrorNotification(deleteEntry[0].name)
                    setTimeout(() => {
                        setDeleteErrorNotification(null)
                    }, 5000);
                })
                .finally(() => phoneBookService
                                    .getPhonebookEntries()
                                    .then((response) => setPersons(response)))
            }
        }
        
        return (
            <div>
        <h2>PHONEBOOK</h2>
        <Filter filterName={filterName} handleInputChange={handleInputChange}/>
        <Form newName={newName} newNumber={newNumber} handleInputChange={handleInputChange} handleNewEntry={handleNewEntry}/>
        <AddSuccessNotification name={phonebookChangeNotification}/>
        <DeleteErrorNotification name={deleteErrorNotification}/>
        <h3>Numbers</h3>
        <Display persons={persons} filterName={filterName} handleDelete={handleDelete}/>
    </div>
  )
}

export default PhoneBook