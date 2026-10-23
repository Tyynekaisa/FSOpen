import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'
import { ErrorNotification } from './Notification'

const LoginForm = ({ login }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  // const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    console.log('handleLogin')
    console.log('käyttäjätunnus: ', userName)
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })
      console.log('user1: ', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      login(user)
      //setNotificationMessage(`Tervetuloa ${user.name}!`)
      setUserName('')
      setPassword('')
      // setTimeout(() => {
      //   setNotificationMessage(null)
      // }, 3000)
    } catch {
      setErrorMessage('Väärä käyttäjätunnus tai salasana')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleUserNameChange = ({ target }) => setUserName(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      {/* <Notification message={notificationMessage} /> */}
      <ErrorNotification message={errorMessage} />

      <form onSubmit={login}>
        <label>
          Käyttäjätunnus
          <input
            type='text'
            value={userName}
            onChange={handleUserNameChange}
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
        <button
          type='submit'
          onClick={handleLogin}
        >
          Kirjaudu
        </button>
      </form>
    </div>
  )
}

export default LoginForm
