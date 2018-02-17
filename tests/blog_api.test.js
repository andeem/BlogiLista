const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

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

beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are 2 blogs', async () => {
    const response = await api
        .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
    const response = await api
        .get('/api/blogs')

    const titles = response.body.map(x => x.title)
    expect(titles).toContain('blogi')
})

afterAll(() => {
    server.close()
})