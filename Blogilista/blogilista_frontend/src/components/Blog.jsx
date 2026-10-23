import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notification, ErrorNotification } from './Notification'

const Blog = ({ blog, user, deleteBlog, likeBlog }) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogStyle = {
    padding: '5px',
    border: '1px solid black',
    margin: '5px',
  }
  if (!blog) {
    return null
  }

  const blogUser = blog.user
  const blogUserId =
    typeof blogUser === 'object' ? (blogUser?.id ?? blogUser?._id) : blogUser
  const currentUserId = user?.id ?? user?._id

  const isOwner =
    Boolean(user) &&
    ((blogUserId &&
      currentUserId &&
      String(blogUserId) === String(currentUserId)) ||
      (typeof blogUser === 'object' &&
        blogUser?.userName &&
        blogUser.userName === user?.userName))

  const handleLikeBlog = () => {
    try {
      likeBlog(blog)
      setNotificationMessage(`Tykkäsit blogista ${blog.title}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 2000)
    } catch {
      setErrorMessage('Blogin tykkääminen epäonnistui')
      setTimeout(() => setErrorMessage(null), 2000)
    }
  }

  // const handleDeleteBlog = () => {
  //   const title = blog.title
  //   const confirmDelete = window.confirm(
  //     `Haluatko varmasti poistaa blogin "${title}"?`,
  //   )
  //   if (!confirmDelete) {
  //     return
  //   }
  //   try {
  //     deleteBlog(blog)
  //     navigate('/')
  //   } catch {
  //     setErrorMessage('Blogin poistaminen epäonnistui')
  //     setTimeout(() => {
  //       setErrorMessage(null)
  //     }, 2000)
  //   }
  // }

  const handleDeleteBlog = async () => {
    const confirmDelete = window.confirm(
      `Haluatko varmasti poistaa blogin "${blog.title}"?`,
    )

    if (!confirmDelete) {
      return
    }

    try {
      await deleteBlog(blog)
      navigate('/')
    } catch {
      setErrorMessage('Blogin poistaminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      <ErrorNotification message={errorMessage} />

      <div
        className='blog'
        style={blogStyle}
      >
        <h3 style={{ display: 'inline', paddingRight: '10px' }}>
          {blog.author}: {blog.title}
        </h3>

        <div>
          <p>
            <a href={blog.url}>{blog.url}</a>
          </p>
          <p>
            Tykkäyksiä: {blog.likes}{' '}
            {user && <button onClick={handleLikeBlog}>Tykkää</button>}
          </p>
          {blogUser && <p>Lisännyt: {blogUser.name}</p>}
          {isOwner && (
            <button
              id='deleteButton'
              onClick={handleDeleteBlog}
            >
              Poista blogi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
