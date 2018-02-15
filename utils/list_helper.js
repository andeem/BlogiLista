const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum += blog.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best, blogs[0])

const mostBlogs = (blogs) => {
    return mostX(blogs, 'blogs', (blog) => (author) => author.author === blog.author ? {...author, blogs: author.blogs + 1} : author)
}

const mostLikes = (blogs) => {
    return mostX(blogs, 'likes', (blog) => (author) => author.author === blog.author ? {...author, likes: author.likes + blog.likes} : author)
}

const mostX =(blogs, x, func) => {
    let authors = blogs.reduce((authors, blog) => {
        if (!(authors.find((x) => x.author === blog.author))) {
            authors.push({
                author: blog.author,
                [x]: 0
            })
        }
        authors = authors.map(func(blog))
        return authors
    }, [])

    return authors.reduce((best, author) => best[x] < author[x] ? author : best, authors[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}