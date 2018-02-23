const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const saltRounds = 12
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        if (body.password.length() < 4) {
            return response.status(400).json({
                error: 'too short password'
            })
        }

        if (User.find({name: body.username})) {
            return response.status(400).json({
                error: 'username already taken'
            })
        }
        const user = new User({
            username: body.username,
            name: body.name,
            adult: body.adult === undefined ? true : body.adult,
            passwordHash
        })

        const savedUser = await user.save()
        response.json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({
            error: 'Something went wrong'
        })
    }
})

userRouter.get('/', async (request, response) => {
    try {
        const users = await User
            .find({})
            .populate('blogs')

        response.json(users)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({
            error: 'SOmething went wrong'
        })
    }
})

module.exports = userRouter