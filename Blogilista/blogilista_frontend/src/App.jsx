import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [newBlog, setNewBlog] = useState('')
  // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [userName, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.blogs))
  }, [])

  console.log(blogs)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ userName, password })
      setUser(user)
      setuserName("")
      setPassword("")
    } catch {
      setErrorMessage("wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.error(errorMessage) // poista
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          userName
          <input
            type='text'
            value={userName}
            onChange={({ target }) => setuserName(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type='submit'>login</button>
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

  return (
    <div>
      <h1>Tervetuloa käyttämään blogilistaa</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>Olet kirjautunut sisään nimellä {user.name}!</p>
          {blogList()}
        </div>
      )}
    </div>
  )
}

export default App
