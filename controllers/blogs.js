const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const formatBlog = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user
    }
}


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { _id: 1, username: 1, name: 1 })
    response.json(blogs.map(blog => formatBlog(blog)))
})

blogsRouter.post('/', async (request, response) => {
    const token = request.token

    const decodedToken = jwt.decode(token, process.env.SECRET)

    if (!token || !decodedToken || !decodedToken.id) {
        return response.status(401).json({
            error: 'no or invalid token'
        })
    }

    if (!request.body.title || !request.body.url) {
        return response.status(400).end()
    }
    let user = await User.findById(decodedToken.id)

    const blog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: User.format(user).id
    }
    const newBlog = new Blog(blog)

    const result = await newBlog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const token = request.token

    const decodedToken = jwt.decode(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({
            error: 'no or invalid token'
        })
    }
    const id = request.params.id
    const user = await User
        .findById(decodedToken.id)
        .populate('blogs', {_id: 1})

    if (user.blogs.find(b => String(b._id) === id)) {
        console.log('joo')
        await Blog.findByIdAndRemove(request.params.id)
        user.blogs = user.blogs.filter(blog => String(blog._id) !== request.params.id)
        await user.save()
    }
    console.log(user)
    response.status(204).end()
})

module.exports = blogsRouter