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

const SingleCountryDisplay = (props) => {
    return (
        <div>
            {props.country.name.official}
        </div>
    )
}

const Display = ({countriesAll, filterInput, onClick}) => {
    if(countriesAll) {
        const filteredCountries = countriesAll
                                .filter(eachCountry => eachCountry.name.common.toLowerCase().includes(filterInput.toLowerCase()))
        if (filteredCountries.length === 1) {
            <SingleCountryDisplay country={filteredCountries[0]}/>
        } else if ((filteredCountries.length > 1) && (filteredCountries.length < 11)) {
            return (
                <div>
                    <table>
                        <tbody>
                            {filteredCountries
                                    .map(eachCountry => eachCountry.name.common)
                                    .sort()
                                    .map(eachCountry => <CountryListDisplay key={eachCountry} country={eachCountry} onClick={onClick}/>
                                )}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <div>
                    <p>
                        Too many entries. Please narrow the search field.<br />
                        Meanwhile here are facts about a randomly selected country
                    </p>
                    <SingleCountryDisplay country={filteredCountries[Math.floor(Math.random() * filteredCountries.length)]}/>
                </div>
            )
        }
    } else {
        return (
            <>
                <p>
                    API failure.<br />
                    Check console for more specific information.
                </p>
            </>
        )
    }
}

const Filter = ({filterInput, onChange}) => {
    return (
        <div>
            <input type="text" value={filterInput} onChange={onChange}/>
        </div>
    )
}

const Countries = () => {
    const [countriesAll, setCountriesAll] = useState([])
    const [filterInput, setFilterInput] = useState('')

    useEffect(() => {
        countriesServices
                    .getCountries()
                    .then((response) => {
                        setCountriesAll(response)
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
    if (countriesAll.length === 0) {
        return null
    } else {
        console.log(countriesAll.length)
        return (
            <div>
                <Filter filterInput={filterInput} onChange={filterInputHandler}/>
                <Display countriesAll={countriesAll} filterInput={filterInput} onClick={showClickHandler}/>
            </div>
        )
    }
}

export default Countries