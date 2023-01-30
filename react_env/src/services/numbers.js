import axios from "axios";

const baseUrl = 'http://localhost:3001/persons'

const getPhonebookEntries = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
            return response.data
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
export default {
    getPhonebookEntries,
    createPhonebookEntries,
    deletePhonebookEntries,
    updatePhonebookEntries
}