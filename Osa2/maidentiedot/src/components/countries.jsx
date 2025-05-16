const CountryList = ({ country, showCountry }) => {
  return (
    <>
    {country.name.common} <button onClick={() => showCountry(country.name.common)}>Show</button><br />
    </>
  )
}

const CountryDetails = ({country}) => {
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
      <img src={country.flags.png} alt={country.flags.alt}></img>
    </div>
  )
}

const Countries = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length === 1) {
    return (
      <div>
        <CountryDetails country={countries[0]} />
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