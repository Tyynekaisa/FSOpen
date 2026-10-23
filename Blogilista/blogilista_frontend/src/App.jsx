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
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

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

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar
        position='static'
        sx={{ mb: 2 }}
      >
        <Toolbar>
          <Typography
            variant='h5'
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              textTransform: 'uppercase',
              flexGrow: 1,
            }}
          >
            Blogilista
          </Typography>
          <Button
            color='inherit'
            component={Link}
            to='/'
            nativeButton={false}
            sx={style}
          >
            Etusivu
          </Button>
          {user && (
            <Button
              color='inherit'
              component={Link}
              to='/create'
              nativeButton={false}
              sx={style}
            >
              Uusi blogi
            </Button>
          )}
          {user && (
            <Button
              color='inherit'
              component={Link}
              onClick={handleLogout}
              nativeButton={false}
              sx={style}
            >
              Kirjaudu ulos
            </Button>
          )}
          {!user && (
            <Button
              color='inherit'
              component={Link}
              to='/login'
              nativeButton={false}
              sx={style}
            >
              Kirjaudu sisään
            </Button>
          )}
        </Toolbar>
      </AppBar>

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
    </Container>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
