const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "blogi",
        author: "blogaaja",
        url: "blogi.com",
        likes: 10
    },
    {
        title: "blogi2",
        author: "blogaaja",
        url: "blogi.com",
        likes: 0
    }
]

const format = (blog) => {
    return {
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes
    }
}

const nonExistingId = async () => {
    const blog = new Blog()
    blog.save
    blog.remove

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find()

    return blogs.map(format)
}

const createUser = async () => {
    const password = 'salasana'
    const passwordHash = await bcrypt.hash(password, 12)
    const user = new User({
        username: 'testi',
        name: 'testi_kayttaja',
        adult: true,
        passwordHash
    })
    await user.save()
    return {
        username: user.username,
        password: password
    }
}
module.exports = {
    initialBlogs, format, nonExistingId, blogsInDb, createUser
}