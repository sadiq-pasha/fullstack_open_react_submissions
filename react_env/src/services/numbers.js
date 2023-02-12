import axios from "axios";

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

const baseUrl = '/api/persons'

const getPhonebookEntries = () => {
    const request = axios.get(baseUrl)
    return request.then(response => { 
        console.log('GET ALL')  
        return response.data
    })
}

const resetDefault = (persons) => {
    const phonebookIDs = persons.map(p => p.id)
    const deletePersons = Promise
                    .all(phonebookIDs.map(personID => {
                        return deletePhonebookEntries(personID)
                    }))
                    .then(() => createPhonebookEntries(defaultPhonebook[0]))
                    .then(() => createPhonebookEntries(defaultPhonebook[1]))
                    .then(() => createPhonebookEntries(defaultPhonebook[2]))
                    .then(() => createPhonebookEntries(defaultPhonebook[3]))
    return deletePersons.then(() => {
        return defaultPhonebook
    })
}

const createPhonebookEntries = (newPersonObject) => {
    const request = axios.post(baseUrl, newPersonObject)
    return request.then((response) => {
            return response.data
        })
}

const deletePhonebookEntries = (entryId) => {
    const request = axios.delete(`${baseUrl}/${entryId}`)
    return request.then(response => response.data)
}

const updatePhonebookEntries = (entryId, updatedPersonObject) => {
    const request = axios.put(`${baseUrl}/${entryId}`, updatedPersonObject)
    return request.then(response => response.data)
}

const phoneBookService =  {
    getPhonebookEntries,
    resetDefault,
    createPhonebookEntries,
    deletePhonebookEntries,
    updatePhonebookEntries
}

export default phoneBookService