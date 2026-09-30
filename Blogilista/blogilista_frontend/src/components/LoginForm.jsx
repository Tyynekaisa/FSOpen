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
        <div>
          Käyttäjätunnus
          <input
            value={userName}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Salasana
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type='submit'>Kirjaudu</button>
      </form>
    </div>
  )
}

export default LoginForm
