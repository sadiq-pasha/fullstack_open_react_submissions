import axios from "axios";

let base_url = 'http://192.168.1.60:3000/countries'

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