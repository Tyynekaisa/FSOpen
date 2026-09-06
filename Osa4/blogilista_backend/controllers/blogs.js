const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const helper = require('../utils/list_helper')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { userName: 1, name: 1 })
  // Extra: Calculate statistics using helper functions
  const mostBlogs = helper.mostBlogs(blogs)
  const favoriteBlog = helper.favoriteBlog(blogs)
  const mostLikes = helper.mostLikes(blogs)
  response.json({ blogs, mostBlogs, favoriteBlog, mostLikes })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'User not authorized to delete this blog' })
  } else {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const blogtoUpdate = await Blog.findById(request.params.id)
  Object.assign(blogtoUpdate, blog)
  const updatedBlog = await blogtoUpdate.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter
