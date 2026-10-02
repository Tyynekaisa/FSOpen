import Blog from './Blog'

const BlogList = ({ blogs, user, onLike, onDelete }) => {
  blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={() => onLike(blog)}
          onDelete={() => onDelete(blog)}
        />
      ))}
    </div>
  )
}

export default BlogList
