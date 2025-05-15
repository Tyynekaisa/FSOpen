import { useState, useEffect } from 'react'
import personService from './services/persons'
import { PhoneBookForm, FilterForm } from './components/forms'
import Persons from './components/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (confirm(`${newName} is already added to phonebook. Do you want to replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, personObject)
            .then(returnedPerson => {
            console.log('Palvelin palautti:', returnedPerson)
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
          })
      }
    } else {
      personService
        .create(personObject)
          .then(returnedPerson => {
            console.log('Palvelin palautti:', returnedPerson)
            setPersons(persons.concat(returnedPerson))
          })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const deletedPerson = persons.find(person => person.id === id)
    console.log('Poistetaan henkilö:', deletedPerson.name)
    if (confirm(`Are you sure you want to delete ${deletedPerson.name}?`)) {
      personService
        .deleteItem(id)
        .then(() => {
          console.log('Poistettiin:', deletedPerson.name)
          setPersons(persons.filter((person) => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>

      <h2>Search numbers</h2>
      <FilterForm
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h2>Add a new</h2>
      <PhoneBookForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )

}

export default App