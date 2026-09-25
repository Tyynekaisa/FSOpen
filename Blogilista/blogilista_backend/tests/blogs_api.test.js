const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token
let user

describe('blogs_api.test', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create a test user and get the token
    const userObject = {
      userName: 'testuser',
      name: 'Teppo Testaaja',
      password: 'testpassword',
    }
    await api.post('/api/users').send(userObject).expect(201)

    user = await User.findOne({ userName: userObject.userName })

    const loginResponse = await api
      .post('/api/login')
      .send({
        userName: userObject.userName,
        password: userObject.password,
      })
      .expect(200)

    token = loginResponse.body.token

    let blogObject = new Blog({ ...helper.initialBlogs[0], user: user._id })
    await blogObject.save()
    blogObject = new Blog({ ...helper.initialBlogs[1], user: user._id })
    await blogObject.save()
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.blogs.length, helper.initialBlogs.length)
  })

  test('a specific blog can be viewed with id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(resultBlog.body.id, blogToView.id)
    assert.strictEqual(resultBlog.body.title, blogToView.title)
    assert.strictEqual(resultBlog.body.author, blogToView.author)
    assert.strictEqual(resultBlog.body.url, blogToView.url)
    assert.strictEqual(resultBlog.body.likes, blogToView.likes)
    assert.strictEqual(resultBlog.body.user, blogToView.user.toString())
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Uusi Testiblogi',
      author: 'Taina Testaaja',
      url: 'https://fi.wikipedia.org/wiki/Yksikk%C3%B6testaaminen',
      likes: 12,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    assert(titles.includes('Uusi Testiblogi'))

    const authors = blogsAtEnd.map((n) => n.author)
    assert(authors.includes('Taina Testaaja'))

    const urls = blogsAtEnd.map((n) => n.url)
    assert(urls.includes('https://fi.wikipedia.org/wiki/Yksikk%C3%B6testaaminen'))
  })

  test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'Uusi Testiblogi',
      author: 'Taina Testaaja',
      url: 'https://fi.wikipedia.org/wiki/Yksikk%C3%B6testaaminen',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const savedBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Taina Testaaja',
      url: 'https://fi.wikipedia.org/wiki/Yksikk%C3%B6testaaminen',
      likes: 12,
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Uusi Testiblogi',
      author: 'Taina Testaaja',
      likes: 12,
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog cannot be added without a valid token', async () => {
    const newBlog = {
      title: 'Oskarin blogi',
      author: 'Oskari Olematon',
      url: 'https://en.wikipedia.org/wiki/Access_token',
      likes: 0,
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert(result.body.error.includes('Token missing or invalid'))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog can be deleted when the user is the owner', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map((n) => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('a blog cannot be deleted when the user is not the owner', async () => {
    // Create a new user who is not the owner of the blog
    const wrongUser = {
      userName: 'wronguser',
      name: 'Kaapo Kiusaaja',
      password: 'anotherpassword',
    }
    await api.post('/api/users').send(wrongUser).expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send({
        userName: wrongUser.userName,
        password: wrongUser.password,
      })
      .expect(200)
    const wrongUserToken = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${wrongUserToken}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert(result.body.error.includes('User not authorized to delete this blog'))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
    assert.deepStrictEqual(updatedBlogInDb, updatedBlog)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
