import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  return axios.get(`${baseUrl}/all`).then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

const deleteItem = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

const getOne = (name) => {
  return axios.get(`${baseUrl}/name/${name}`).then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  deleteItem: deleteItem,
  getOne: getOne,
}