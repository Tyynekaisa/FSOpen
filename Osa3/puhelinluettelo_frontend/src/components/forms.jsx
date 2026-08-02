const PhoneBookForm = ({
    addPerson,
    newName,
    newNumber,
    handleNameChange,
    handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        Name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        Number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

const FilterForm = ({ filter, handleFilterChange }) => {
  return (
    <form>
        Filter shown with: <input value={filter} onChange={handleFilterChange}/>
      </form>
  )
}

export { PhoneBookForm, FilterForm }