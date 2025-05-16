import getWeather from "../services/weather"
import { useState, useEffect } from 'react'

const WeatherDetails = ({ country, apikey }) => {
    const [weatherNow, setWeatherNow] = useState(null)

    useEffect(() => {
        const lat = country.capitalInfo.latlng[0]
        const long = country.capitalInfo.latlng[1]
    
        getWeather(lat, long, apikey).then(data => {
            setWeatherNow(data)
        })
    }, [country, apikey])

    if (!weatherNow) {
        return null
    }

    console.log('Sää nyt: ', weatherNow.weather)
    const icon = `https://openweathermap.org/img/wn/${weatherNow.weather[0].icon}@2x.png`
    

    return (
        <div>
            <p></p>
            <h2>Weather in {country.capital}</h2>
            <p>Temperature {weatherNow.main.temp} °C</p>
            <img src={icon} style={{border: '1px solid grey', background: 'lightblue'}}/>
            <p>Wind {weatherNow.wind.speed} m/s</p>
        </div>
    )   
}

export default WeatherDetails