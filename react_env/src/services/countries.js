import axios from 'axios'
const BASE_URL = '/api/countries'

const getCountries = () => {
  return axios
    .get('https://restcountries.com/v3/all?fields=name')
    .then(response => {
      return response.data.map(country => country.name.common)
    })
}

const getData = (countryName) => {
  return axios
    .get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then(response => {
      return response.data[0]
    })
}

const getWeather = (latitude, longitude) => {
  return axios
    .get(`${BASE_URL}/${latitude}&${longitude}`)
    .then((response) => {
      return(response.data)
    })
}

const countriesServices =  {
  getCountries,
  getData,
  getWeather
}

export default countriesServices