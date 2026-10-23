import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'
import { ErrorNotification } from './Notification'
import { TextField, Button, Typography } from '@mui/material'

const LoginForm = ({ login }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })
      console.log('user1: ', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      login(user)
      setUserName('')
      setPassword('')
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
      <Typography
        variant='h5'
        component='div'
      >
        Kirjaudu sisään
      </Typography>
      {/* <Notification message={notificationMessage} /> */}
      <ErrorNotification message={errorMessage} />

      <form onSubmit={login}>
        <div>
          <TextField
            label='Käyttäjätunnus'
            type='text'
            value={userName}
            onChange={handleUserNameChange}
            style={{ marginTop: 10 }}
            size='small'
          />
        </div>
        <div>
          <TextField
            label='Salasana'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            style={{ marginTop: 10 }}
            size='small'
          />
        </div>

        <Button
          type='submit'
          variant='contained'
          onClick={handleLogin}
          style={{ marginTop: 10 }}
        >
          Kirjaudu
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
