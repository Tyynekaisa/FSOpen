import { useState, useEffect } from 'react'
import personService from './services/persons'
import { PhoneBookForm, FilterForm } from './components/forms'
import Persons from './components/persons'
import { Notification, ErrorNotification } from './components/notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotification] = useState(null)
  const [errorMessage, setError] = useState(null)

  useEffect(() => {
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
            setNotification(`Number of ${existingPerson.name} changed`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          })
          .catch(error => {
            console.log(error)
            setError(`Information of ${existingPerson.name} was already removed from server`)
            setTimeout(() => {
              setError(null)
            }, 5000)
            personService
              .getAll()
              .then(updatedPersons => setPersons(updatedPersons))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setNotification(`Added ${newName}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error => {
          console.log(error.response)
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
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
          setPersons(persons.filter((person) => person.id !== id))
          setNotification(
              `Deleted ${deletedPerson.name}`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.log(error)
          setError(`Information of ${deletedPerson.name} was already removed from server`)
            setTimeout(() => {
              setError(null)
            }, 5000)
            personService
              .getAll()
              .then(updatedPersons => setPersons(updatedPersons))
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
      <Notification message={notificationMessage} />
      <ErrorNotification message={errorMessage} />

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