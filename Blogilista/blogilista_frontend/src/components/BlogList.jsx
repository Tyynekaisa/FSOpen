// import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div className='blogList'>
      <h2>Tervetuloa käyttämään blogilistaa</h2>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
