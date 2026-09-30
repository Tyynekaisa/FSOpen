import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <h2>Luo uusi blogi</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            Otsikko
            <input
              type='text'
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
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
            />
          </label>
        </div>
        <button type='submit'>Tallenna</button>
      </form>
    </div>
  )
}

export default BlogForm
