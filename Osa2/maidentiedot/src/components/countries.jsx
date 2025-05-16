import WeatherDetails from './weather'

const CountryList = ({ country, showCountry }) => {
  return (
    <>
    {country.name.common} <button onClick={() => showCountry(country.name.common)}>Show</button><br />
    </>
  )
}

const CountryDetails = ({ country, apikey }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}<br/>
      Area: {country.area} km<sup>2</sup></p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
        <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} style={{border: '1px solid grey'}}></img>
      <WeatherDetails country={country} apikey={apikey} />
    </div>
  )
}

const Countries = ({ countries, showCountry, apikey }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length === 1) {
    return (
      <div>
        <CountryDetails country={countries[0]} apikey={apikey} />
      </div>
    )
  } else {
    return (
      <div>
          {countries.map(country =>
            <CountryList key={country.name.common} country={country} showCountry={showCountry} />
          )}
      </div>
    )
  }
}

export {Countries, CountryDetails}