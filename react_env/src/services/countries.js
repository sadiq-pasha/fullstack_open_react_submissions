import axios from "axios";
const API_KEY = process.env.REACT_APP_API_KEY

const getCountries = () => {
    return axios
        .get('https://restcountries.com/v3/all?fields=name')
        .then(response => {
                return response.data.map(country => country.name.common)
            })
    }

const getData = (countryName) => {
    console.log('axios request', countryName)
    return axios
        .get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => {
            return response.data[0]
        })
} 

const getWeather = (latitude, longitude) => {
    return axios
        .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=2&appid=${API_KEY}`)
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