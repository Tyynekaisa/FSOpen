const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { userName, password } = request.body

  const user = await User.findOne({ userName })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid userName or password',
    })
  }

  const userForToken = {
    username: user.userName,
    id: user._id,
  }

  // token expires in one hour (3600 seconds)
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 3600 })

  response.status(200).send({ token, username: user.userName, name: user.name })
})

module.exports = loginRouter
