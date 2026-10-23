import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notification, ErrorNotification } from './Notification'
import { Card, CardContent, Button, Typography, Link } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { pink } from '@mui/material/colors'

const Blog = ({ blog, user, deleteBlog, likeBlog }) => {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

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

      <Card
        sx={{ minWidth: 275 }}
        className='blog'
        variant='outlined'
      >
        <CardContent>
          <Typography sx={{ color: 'text.secondary', fontSize: 16 }}>
            {blog.author}:
          </Typography>
          <Typography
            gutterBottom
            variant='h5'
            component='div'
          >
            {blog.title}
          </Typography>

          <div>
            <Link
              href={blog.url}
              underline='none'
            >
              {blog.url}
            </Link>
            {blogUser && (
              <Typography style={{ marginTop: 20 }}>
                Lisännyt: {blogUser.name}
              </Typography>
            )}
            <Typography>
              Tykkäyksiä: {blog.likes}
              {user && (
                <Button
                  onClick={handleLikeBlog}
                  style={{ marginLeft: 10 }}
                  size='small'
                  startIcon={<FavoriteIcon sx={{ color: pink[500] }} />}
                >
                  Tykkää
                </Button>
              )}
            </Typography>
            {isOwner && (
              <Button
                id='deleteButton'
                onClick={handleDeleteBlog}
                variant='outlined'
                color='error'
                size='small'
                style={{ marginTop: 10 }}
              >
                Poista blogi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
