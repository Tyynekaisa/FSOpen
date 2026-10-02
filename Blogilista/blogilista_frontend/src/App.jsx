import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification, ErrorNotification } from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogList from './components/Bloglist'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUserName('')
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

  const addBlog = (blogObject) => {
    try {
      if (!blogObject.title || !blogObject.author || !blogObject.url) {
        setErrorMessage('Kaikki kentät tulee täyttää')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        return
      }
      blogFormRef.current.toggleVisibility()
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setNotificationMessage(`Uusi blogi ${blogObject.title} lisätty!`)
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

  const handleLikeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      })
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
      setNotificationMessage(`Tykkäsit blogista ${blog.title}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    } catch {
      setErrorMessage('Blogin tykkääminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleDeleteBlog = async (blog) => {
    const confirmDelete = window.confirm(
      `Haluatko varmasti poistaa blogin "${blog.title}"?`,
    )
    if (!confirmDelete) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      setNotificationMessage(`Blogi "${blog.title}" poistettu!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    } catch {
      setErrorMessage('Blogin poistaminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const loginForm = () => (
    <Togglable
      buttonLabel='Kirjaudu sisään'
      cancelLabel='Peruuta'
    >
      <LoginForm
        userName={userName}
        password={password}
        handleUsernameChange={({ target }) => setUserName(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable
      buttonLabel='Luo uusi blogi'
      cancelLabel='Peruuta'
      ref={blogFormRef}
    >
      <BlogForm createBlog={addBlog} />
    </Togglable>
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
          {blogForm()}
          <BlogList
            blogs={blogs}
            user={user}
            onLike={handleLikeBlog}
            onDelete={handleDeleteBlog}
          />
        </div>
      )}
    </div>
  )
}

export default App
