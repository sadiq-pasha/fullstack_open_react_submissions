import axios from "axios";
const API_KEY = process.env.REACT_APP_API_KEY

let base_url = 'http://localhost:3001/api/countries'

const getCountries = () => {
    return axios
        .get(base_url)
        .then(response => {
                return response.data
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
    getWeather
}

export default countriesServices