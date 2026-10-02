import Togglable from './Togglable'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const blogStyle = {
    padding: '5px',
    border: '1px solid black',
    margin: '5px',
  }

  console.log('logged user:', user)
  console.log('blog user:', blog.user)

  return (
    <div
      className='blog'
      style={blogStyle}
    >
      <h4 style={{ display: 'inline', paddingRight: '10px' }}>{blog.title}</h4>
      <Togglable
        buttonLabel='Näytä tiedot'
        cancelLabel='Piilota tiedot'
      >
        <div>
          <a href={blog.url}>{blog.url}</a>
          <br />
          Tykkäyksiä: {blog.likes} <button onClick={onLike}>Tykkää</button>
          <br />
          {blog.author}
          <br />
          {user && blog.user && user.userName === blog.user.userName && (
            <button
              id='deleteButton'
              onClick={onDelete}
            >
              Poista blogi
            </button>
          )}
        </div>
      </Togglable>
    </div>
  )
}

export default Blog
