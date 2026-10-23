import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorNotification } from './Notification'
import { TextField, Button, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const navigate = useNavigate()
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const addBlog = (event) => {
    event.preventDefault()
    try {
      if (!newTitle || !newAuthor || !newUrl) {
        setErrorMessage('Kaikki kentät tulee täyttää')
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
        return
      }
      createBlog({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      navigate('/')
    } catch {
      setErrorMessage('Blogin lisääminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }
  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <Typography
        variant='h5'
        component='div'
      >
        Luo uusi blogi
      </Typography>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='Otsikko'
            type='text'
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            style={{ marginTop: 10 }}
            size='small'
          />
        </div>
        <div>
          <TextField
            label='Kirjoittaja'
            type='text'
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            style={{ marginTop: 10 }}
            size='small'
          />
        </div>
        <div>
          <TextField
            label='Url'
            type='url'
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder='Blogin url muodossa https://esimerkki.com'
            style={{ marginTop: 10 }}
            size='small'
          />
        </div>
        <Button
          type='submit'
          variant='contained'
          style={{ marginTop: 10 }}
        >
          Tallenna
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
