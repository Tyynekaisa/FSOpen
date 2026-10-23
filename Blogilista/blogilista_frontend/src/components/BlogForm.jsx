import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Notification, ErrorNotification } from './Notification'

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
      <h2>Luo uusi blogi</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Otsikko
            <input
              type='text'
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              placeholder='Blogin otsikko'
            />
          </label>
        </div>
        <div>
          <label>
            Kirjoittaja
            <input
              type='text'
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
              placeholder='Kirjoittajan nimi'
            />
          </label>
        </div>
        <div>
          <label>
            Url
            <input
              type='url'
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder='Blogin url muodossa https://esimerkki.com'
            />
          </label>
        </div>
        <button type='submit'>Tallenna</button>
      </form>
    </div>
  )
}

export default BlogForm
