import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import { Notification, ErrorNotification } from './components/Notification'
import Blog from './components/Blog'

const AppContent = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const loggedUser = JSON.parse(loggedUserJSON)
        setUser(loggedUser)
        blogService.setToken(loggedUser.token)
      } catch {
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  }, [])

  const handleLogin = async (loggedUser) => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
    blogService.setToken(loggedUser.token)
    setUser(loggedUser)
    navigate('/')
    setNotificationMessage(`Tervetuloa ${loggedUser.name}!`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 2000)
  }

  // const handleLogout = async (event) => {
  const handleLogout = async () => {
    //event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setNotificationMessage('Olet kirjautunut ulos')
    navigate('/')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)

      setBlogs((currentBlogs) =>
        currentBlogs.filter((item) => item.id !== blog.id),
      )

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

  const likeBlog = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })

    setBlogs((currentBlogs) =>
      currentBlogs.map((item) =>
        item.id === updatedBlog.id ? updatedBlog : item,
      ),
    )
  }

  const addBlog = (blogObject) => {
    try {
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setNotificationMessage(`Uusi blogi ${blogObject.title} lisätty!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 2000)
    } catch {
      setErrorMessage('Blogin lisääminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const padding = {
    padding: 5,
  }

  return (
    <>
      <div>
        <Link
          style={padding}
          to='/'
        >
          BLOGILISTA
        </Link>

        {user && (
          <Link
            style={padding}
            to='/create'
          >
            UUSI BLOGI
          </Link>
        )}

        {user && (
          <div>
            <button
              type='submit'
              style={padding}
              className='logoutButton'
              onClick={handleLogout}
            >
              Kirjaudu ulos
            </button>
          </div>
        )}
        {!user && (
          <Link
            style={padding}
            to='/login'
          >
            KIRJAUDU SISÄÄN
          </Link>
        )}
      </div>

      <Notification message={notificationMessage} />
      <ErrorNotification message={errorMessage} />

      <Routes>
        <Route
          path='/'
          element={<BlogList blogs={blogs} />}
        />
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blog}
              user={user}
              deleteBlog={deleteBlog}
              likeBlog={likeBlog}
            />
          }
        />
        <Route
          path='/create'
          element={<BlogForm createBlog={addBlog} />}
        />
        {!user && (
          <Route
            path='/login'
            element={<LoginForm login={handleLogin} />}
          />
        )}
        {user && (
          <Route
            path='/login'
            element={
              <Navigate
                to='/'
                replace
              />
            }
          />
        )}
      </Routes>
    </>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
