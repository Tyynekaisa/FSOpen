const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  userName,
  password,
}) => {
  return (
    <div>
      <h2>Kirjaudu sisään</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Käyttäjätunnus
          <input
            type='text'
            value={userName}
            onChange={handleUsernameChange}
          />
        </label>
        <label>
          Salasana
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <button type='submit'>Kirjaudu</button>
      </form>
    </div>
  )
}

export default LoginForm
