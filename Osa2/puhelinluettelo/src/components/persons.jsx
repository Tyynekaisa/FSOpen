const Person = ({ person, deletePerson }) => {
  return (
    <p>
    {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>Delete</button>
    </p>
  )
}

const Persons = ({persons, deletePerson}) => {
  return (
    <div>
        {persons.map(person =>
          <Person key={person.name} person={person} deletePerson={deletePerson} />
        )}
      </div>
  )
}

export default Persons