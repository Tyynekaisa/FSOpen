const bcrypt = require('bcrypt')
const User = require('../models/user')
const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('users_api.test', () => {
  describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ userName: 'root', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh userName', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: 'ajuhola',
        name: 'Kaisa Juhola',
        password: 'salasana',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const userNames = usersAtEnd.map((u) => u.userName)
      assert(userNames.includes(newUser.userName))
    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Expected `userName` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: 'aj',
        name: 'Kaisa Juhola',
        password: 'salasana',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('is shorter than the minimum allowed length'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if userName is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: '',
        name: 'Kaisa Juhola',
        password: 'salasana',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: userName: Path `userName` is required.'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: 'ajuhola',
        name: 'Kaisa Juhola',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Password is required and must be at least 3 characters long'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        userName: 'ajuhola',
        name: 'Kaisa Juhola',
        password: '',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Password is required and must be at least 3 characters long'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
