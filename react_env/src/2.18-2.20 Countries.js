import countriesServices from './services/countries'

import { useState, useEffect } from 'react'

const CountryListDisplay = ({country, onClick}) => {
    return (
        <tr>
            <td>{country}</td>
            <td><button name={country} onClick={onClick}>show</button></td>
        </tr>
    )
}

const WeatherDisplay = ({ latitude, longitude }) => {
    
    const [weather, setWeather] = useState({'imgurl':null, 'description':null, 'temperature':null})

    useEffect(() => {
        setWeather(null)
        countriesServices
            .getWeather(latitude, longitude)
            .then((response) => {
                const weatherImageUrl =`http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png` 
                const skyConditions = response.list[0].weather[0].description
                const temperature = response.list[0].main.temp
                const newWeatherObject = {'imgurl':weatherImageUrl, 'description':skyConditions, 'temperature':temperature}
                setWeather(newWeatherObject)
            })
    },[latitude,longitude])
    if (weather) {
        return (
            <td>
                <img src={weather.imgurl} alt={weather.description} /><br/>
                {Math.trunc((weather.temperature - 273) * 100) / 100}&deg;C and {weather.description}
            </td>
        )
    } else {
        return (
            <td>
                Fetching weather info
            </td>
        )
    }
}

const SingleCountryDisplay = ({ country }) => {
    return (
        <div className='single-country-display'>
            <p className='country-title'>
                <b>{country.name.common.toUpperCase()}</b>
            </p>
            <img className='flag-image'
                src={country.flags.svg} 
                alt={country.flags.alt} 
                title={country.name.common}
                />
            <table className='fact-table'>
                <tbody>
                    <tr>
                        <td>Official name</td>
                        <td>{country.name.official}</td>
                    </tr>
                    <tr>
                        <td>Capital city</td>
                        <td>{country.capital}</td>
                    </tr>
                    <tr>
                        <td>Current Weather</td>
                        <WeatherDisplay latitude={country.capitalInfo.latlng[0]} longitude={country.capitalInfo.latlng[1]}/>
                    </tr>
                    <tr>
                        <td>Currency</td>
                        <td>
                            <ul>
                                {Object.values(country.currencies).map(currency => currency.name).map(currency => {
                                    return <li key={currency}>{currency}</li>
                                    }
                                    )}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Population</td>
                        <td>{country.population}</td>
                    </tr>
                    <tr>
                        <td>Languages</td>
                        <td>
                            <ul>
                                {Object.values(country.languages).map(language => {
                                    return <li key={language}>{language}</li>
                                }
                                )}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Landlocked?</td>
                        <td>{country.landlocked ? 'Yes' : 'No'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const Display = ({countries, onClick, randomCountry}) => {
    if (countries.length === 1) {
        return (
            <div>
                <p>Found 1 match: {countries[0].name.common}</p>
                <SingleCountryDisplay country={countries[0]}/>
            </div>
        )
    } else if (countries.length === 0) {
        return (
            <div>
                <p>
                    No matches found!
                </p>
                <SingleCountryDisplay country={randomCountry}/>
            </div>
        )
    } else if ((countries.length > 1) && (countries.length < 11)) {
        return (
            <div>
                <table className='filtered-table'>
                    <tbody>
                        {countries
                                .map(eachCountry => eachCountry.name.common)
                                .sort()
                                .map(eachCountry => <CountryListDisplay key={eachCountry} country={eachCountry} onClick={onClick}/>
                                )}
                    </tbody>
                </table>
                <SingleCountryDisplay country={randomCountry}/>
            </div>
        )
    } else {
        return (
            <div>
                <p>
                    Too many entries. Please narrow the search field.<br />
                    Meanwhile here are facts about a randomly selected country
                </p>
                <SingleCountryDisplay country={randomCountry}/>
            </div>
        )
    }
}

const Filter = ({filterInput, onChange, onClick}) => {
    return (
        <div className='filter'>
            <p>Search: <input type="text" value={filterInput} onChange={onChange}/></p>
            <p>Randomize: <button onClick={onClick}>Choose random</button></p>
        </div>
    )
}

const Countries = () => {
    const [countriesAll, setCountriesAll] = useState([])
    const [filterInput, setFilterInput] = useState('')
    const [randomCountry, setRandomCountry] = useState(null)

    useEffect(() => {
        countriesServices
            .getCountries()
            .then((response) => {
                setCountriesAll(response)
                setRandomCountry(response[Math.floor(Math.random() * response.length)])
            })
            .catch((error) => {
                console.log(error)
            })
    },[])
    
    const filterInputHandler = (event) => {
        setFilterInput(event.target.value)
    } 
    
    const showClickHandler = (event) => {
        setFilterInput(event.target.name)
    } 
    
    const randomClick = () => {
        setFilterInput('')
        setRandomCountry(countriesAll[Math.floor(Math.random() * countriesAll.length)])
    }
    
    if (countriesAll.length === 0) {
        return (
            <>
                <p>
                    API failure.<br />
                    Check console for more specific information.
                </p>
            </>
        )
    } else {
        const filteredCountries = countriesAll
                                .filter(
                                    eachCountry => eachCountry.name.common.toLowerCase().includes(filterInput.toLowerCase())
                                )
        return (
            <div className='top-div'>
                <h2>COUNTRY FACT SHEET</h2>
                <Filter filterInput={filterInput} onChange={filterInputHandler} onClick={randomClick}/>
                <Display
                    countries={filteredCountries} 
                    onClick={showClickHandler} 
                    randomCountry={randomCountry}
                />
            </div>
        )
    }
}

export default Countries