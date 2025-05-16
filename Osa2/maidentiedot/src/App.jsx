import { useState, useEffect } from 'react'
import FilterForm from './components/filterform'
import countryService from './services/countries'
import { Countries, CountryDetails } from './components/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    console.log('effect')
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])
  console.log('rendered', countries.length, 'countries')
  

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(c => 
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const showCountry = (name) => {
    console.log('show klikattu', name)
    countryService
      .getOne(name)
      .then(response => {
        setSelectedCountry(response)
      })
  }
  
  return (
  <div>
    <FilterForm
      filter={filter}
      handleFilterChange={handleFilterChange}
    />
    {selectedCountry 
      ? <CountryDetails country={selectedCountry} />
      : <Countries countries={filteredCountries} showCountry={showCountry} />
    }

  </div>
  
  )

}

export default App