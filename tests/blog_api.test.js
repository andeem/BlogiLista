const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { format, initialBlogs, nonExistingId, blogsInDb, createUser } = require('./test_helper')


beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is blogs in db', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are right amount of blogs', async () => {
        const blogsInDatabase = await blogsInDb()
        const response = await api
            .get('/api/blogs')

        expect(response.body.length).toBe(blogsInDatabase.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api
            .get('/api/blogs')

        const titles = response.body.map(x => x.title)
        expect(titles).toContain('blogi')
    })
})

describe('when adding new blog while logged in', () => {
    
    let token = ''

    beforeAll(async () => {
        await User.remove()

        const credentials = await createUser()
        const response = await api
            .post('/api/login')
            .send(credentials)
        token = response.body.token

    })

    test('blog can be added', async () => {
        const blog = {
            title: 'blogi3',
            author: 'blogaaja2',
            url: 'www.blog.org',
            likes: '0'
        }
        const blogsInDatabase = await blogsInDb()

        await api
            .post('/api/blogs')
            .set({'Authorization': `bearer ${token}`})
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .get('/api/blogs')

        const titles = response.body.map(x => x.title)

        expect(response.body.length).toBe(blogsInDatabase.length + 1)
        expect(titles).toContain('blogi3')
    })

    test('blog with no likes gets zero likes', async () => {
        const blog = {
            title: 'blogi',
            author: 'blogaaja',
            url: 'www.b.fi'
        }

        const response = await api
            .post('/api/blogs')
            .send(blog)
            .set({'Authorization': `bearer ${token}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)

    })

    test('invalid blog return status 400', async () => {
        const blog = {
            author: 'Minä'
        }

        const response = await api
            .post('/api/blogs')
            .set({'Authorization': `bearer ${token}`})
            .send(blog)
            .expect(400)

    })
})

test('blogs can be remowed with valid id', async () => {

    const blogsInDatabase = await blogsInDb()
    const blog = blogsInDatabase[0]
    await api
        .delete(`/api/blogs/${blog.id}`)
        .expect(204)

    const blogsAfterRemove = await blogsInDb()

    expect(blogsAfterRemove.length).toBe(blogsInDatabase.length - 1)

})
afterAll(() => {
    server.close()
})