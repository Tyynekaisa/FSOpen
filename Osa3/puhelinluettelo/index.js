// Full Stack Open 2026
// Osa 3, tehtävät 3.1. - 3.8.
// Puhelinluettelon backend
// Kaisa Juhola

const express = require('express')
const morgan = require('morgan')
const app = express()

// Tehtävä 3.1. Puhelinluettelon backend step1
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.use(express.json())


// Tehtävät 3.7-3.8. Puhelinluettelon backend steps7-8
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Tehtävä 3.1. Puhelinluettelon backend step1 jatkuu
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Tehtävä 3.2. Puhelinluettelon backend step2
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <h1>Phonebook Info</h1>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`)
})

// Tehtävä 3.3. Puhelinluettelon backend step3
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// Tehtävä 3.4. Puhelinluettelon backend step4
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// Tehtävä 3.5. Puhelinluettelon backend steps 5&6
const generateRandomId = () => {
    const randomId =  Math.floor(Math.random() * 1000000).toString()
    console.log(randomId)
    return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)