const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Bloggaaminen on kivaa!',
    author: 'Kaisa',
    url: 'www.google.com',
    likes: 54,
    id: '6a7778156ea13507eb92fa53',
  },
  {
    title: 'Miten oppia JavaScriptia helpoiten?',
    author: 'Leena',
    url: 'https://www.w3schools.com/js/default.asp',
    likes: 99,
    id: '6a785cd7db2c87dced7fe86b',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
