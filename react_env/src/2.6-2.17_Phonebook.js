import { useState, useEffect } from 'react'
import phoneBookService from './services/numbers'
import validationTester from './services/inputValidator'

const Display = ({ persons, filterName, handleDelete }) => {
  let filteredPersonsList = persons.filter((person) => {
    return person.name.toLowerCase().includes(filterName.toLowerCase())
  })

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
              <td>{person.phoneNumber}</td>
              <td><button id={person.id} onClick={(event) => handleDelete(event)}>delete</button></td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const Form = (props) => {
  const validUserInput = validationTester(props.newName, String(props.newNumber))
  return (
    <form>
      <div>
            Name*: <input value={props.newName} onChange={(event) => props.handleInputChange(event, 'name')}/>
      </div>
      <div>
            Number*: <input value={props.newNumber} onChange={(event) => props.handleInputChange(event, 'number')}/>
      </div>
      {validUserInput ?
        <div>
                Valid input!<br/>
          <button type="submit" onClick={(event) => props.handleNewEntry(event, 'add')}>add</button>
        </div>
        :
        <div>
                Name must be between 8 and 50 characters <br/>
                Number must be of length 8 or more, cannot have more than one &apos-&apos character <br/>
                If area code is provided it must be 2 or 3 characters long <br/>
          <button type="submit" disabled>add</button>
        </div>
      }
      <div>
        <button type="submit" onClick={(event) => props.handleNewEntry(event, 'reset')}>reset</button>
      </div>
    </form>

  )
}

const Filter = (props) => {
  return (
    <div>
            filter by name: <input value={props.filterName} onChange={(event) => props.handleInputChange(event, 'filter')}/>
    </div>
  )
}

const UserNotification = ({ notification }) => {
  if (notification === null) {
    return null
  } else if (notification.category === 'successNotification') {
    return (
      <div className='addNotification'>
        {notification.name} was successfully added to the phonebook.
      </div>
    )
  } else if (notification.category === 'updateNotification') {
    return (
      <div className='addNotification'>
        {notification.name} was successfully updated in the phonebook.
      </div>
    )
  } else if (notification.category === 'errorNotification') {
    return (
      <div className='error'>
        {notification.name} was not found in the database. Refreshing phonebook.
      </div>
    )
  } else if (notification.category === 'deleteNotification') {
    return (
      <div className='error'>
        {notification.name} was successfully deleted from the phonebook.
      </div>
    )
  }
}

const PhoneBook = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phoneBookService
      .getPhonebookEntries()
      .then((initialEntries) => {
        setPersons(initialEntries)
      })
  },[])

  const handleNewEntry = (event, buttonFunction) => {
    event.preventDefault()
    if (buttonFunction === 'add') {
      if (validationTester(newName, newNumber)) {
        if (persons.map(person => person.name).includes(newName)) {
          if (window.confirm(`${newName} already exists in the phonebook. replace their number?`)) {
            const entry = persons.find(p => p.name === newName)
            const updatedEntry = { ...entry, phoneNumber: newNumber }
            phoneBookService
              .updatePhonebookEntries(updatedEntry.id, updatedEntry)
              .then(response => {
                setPersons(persons.map(p => p.id !== updatedEntry.id ? p : response))
                setNotification({
                  name: newName,
                  category: 'updateNotification'
                })
                setTimeout(() => {
                  setNotification(null)
                }, 3000)
                setNewName('')
                setNewNumber('')
              })
              .catch((error) => {
                console.log(error.response.data.error)
                setNotification({
                  name: newName,
                  category: 'errorNotification'
                })
                setTimeout(() => {
                  setNotification(null)
                }, 3000)
                phoneBookService
                  .getPhonebookEntries()
                  .then((response) => setPersons(response))
              })
          }
        } else {
          const newPerson = {
            name: newName,
            phoneNumber: newNumber
          }
          phoneBookService.createPhonebookEntries(newPerson)
            .then(response => {
              setPersons(persons.concat(response))
              setNotification({
                name: newName,
                category: 'successNotification'
              })
              setTimeout(() => {
                setNotification(null)
              }, 3000)
              setNewName('')
              setNewNumber('')
            })
            .catch((error) => {
              console.log(error.response.data.error)
              setNotification({
                name: newName,
                category: 'errorNotification'
              })
              setTimeout(() => {
                setNotification(null)
              }, 3000)
            })
        }
      }
    } else if (buttonFunction === 'reset') {
      phoneBookService.resetDefault(persons)
        .then(() => phoneBookService.getPhonebookEntries())
        .then((response) => setPersons(response))
    }
  }

  const handleInputChange = (event, inputField) => {
    if (inputField === 'name') {
      setNewName(event.target.value)
    } else if (inputField === 'number') {
      setNewNumber(event.target.value)
    } else if (inputField === 'filter') {
      setFilterName(event.target.value)
    }
  }

  const handleDelete = (event) => {
    const deleteEntry = persons.filter(p => p.id === event.target.id)
    if (window.confirm(`${deleteEntry[0].name} will be deleted. Are you sure?`)) {
      phoneBookService
        .deletePhonebookEntries(deleteEntry[0].id)
        .then((responseCode) => {
          if (responseCode === 204) {
            setPersons(persons.filter(person => person.id !== deleteEntry[0].id))
            setNotification({
              name: deleteEntry[0].name,
              category: 'deleteNotification'
            })
            setTimeout(() => {
              setNotification(null)
            }, 3000)
          }
        })
        .catch(() => {
          setNotification({
            name: deleteEntry[0].name,
            category: 'errorNotification'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
          phoneBookService
            .getPhonebookEntries()
            .then((response) => setPersons(response))
        })
    }
  }

  if (persons) {
    return (
      <div>
        <h2>PHONEBOOK</h2>
        <Filter filterName={filterName} handleInputChange={handleInputChange}/>
        <Form newName={newName} newNumber={newNumber} handleInputChange={handleInputChange} handleNewEntry={handleNewEntry}/>
        <UserNotification notification={notification}/>
        <h3>Phonebook</h3>
        <Display persons={persons} filterName={filterName} handleDelete={handleDelete}/>
      </div>
    )
  } else {
    return (
      <div>
        <h2>PHONEBOOK</h2>
                Unable to connect to the Phonebook database.
      </div>
    )
  }

}

export default PhoneBook