import axios from "axios";

let base_url = 'http://localhost:3001/countries'

const getCountries = () => {
    console.log('fetchingdata')
    return axios
        .get(base_url)
        .then(response => {
            return response.data
        })
}

const countriesServices =  {
    getCountries
}

export default countriesServices