import axios from 'axios'

const getWeather = (lat, lon, apikey) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`).then(response => response.data)
}

export default getWeather