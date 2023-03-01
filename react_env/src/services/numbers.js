import axios from 'axios'

const defaultPhonebook = [
  {
    name: 'Arto Hellas',
    phoneNumber: '040-123456',
  },
  {
    name: 'Ada Lovelace',
    phoneNumber: '39-445323',
  },
  {
    name: 'Dan Abramov',
    phoneNumber: '12-434345',
  },
  {
    name: 'Mary Poppendieck',
    phoneNumber: '39-233122',
  }
]

const baseUrl = '/api/persons'

const getPhonebookEntries = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
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
  return deletePersons
}

const createPhonebookEntries = (newPersonObject) => {
  const request = axios.post(baseUrl, newPersonObject)
  return request.then((response) => {
    return response.data
  })
}

const deletePhonebookEntries = (entryId) => {
  const request = axios.delete(`${baseUrl}/${entryId}`)
  return request.then(response => response.status)
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