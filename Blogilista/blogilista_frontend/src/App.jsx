import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification, ErrorNotification } from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [userName, setuserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }
      if (!newTitle || !newAuthor || !newUrl) {
        setErrorMessage('Kaikki kentät tulee täyttää')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        return
      }

      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setNotificationMessage(`Uusi blogi ${newTitle} lisätty!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    } catch {
      setErrorMessage('Blogin lisääminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setuserName('')
      setPassword('')
      setNotificationMessage(`Tervetuloa ${user.name}!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    } catch {
      setErrorMessage('Väärä käyttäjätunnus tai salasana')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogAppUser', JSON.stringify(user))
    setUser(null)
    setNotificationMessage('Olet kirjautunut ulos')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  // const handleBlogChange = (event) => {
  //   setNewTitle(event.target.value)
  //   setNewAuthor(event.target.value)
  //   setNewUrl(event.target.value)
  // }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Käyttäjätunnus
          <input
            type='text'
            value={userName}
            onChange={({ target }) => setuserName(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Salasana
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type='submit'>Kirjaudu sisään</button>
    </form>
  )

  const blogList = () => (
    <div>
      <h2>Blogit</h2>
      <p></p>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>Luo uusi blogi</h2>
      <div>
        <label>
          Otsikko
          <input
            type='text'
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Kirjoittaja
          <input
            type='text'
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Url
          <input
            type='url'
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </label>
      </div>
      <button type='submit'>Tallenna</button>
    </form>
  )
  return (
    <div>
      <h1>Tervetuloa käyttämään blogilistaa</h1>
      <Notification message={notificationMessage} />
      <ErrorNotification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <form onSubmit={handleLogout}>
            <p>
              Olet kirjautunut sisään nimellä {user.name}!{' '}
              <button type='submit'>Kirjaudu ulos</button>
            </p>
          </form>
          {blogList()}
          {blogForm()}
        </div>
      )}
    </div>
  )
}

export default App
