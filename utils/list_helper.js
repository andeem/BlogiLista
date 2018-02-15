const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum += blog.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best, blogs[0])

const mostBlogs = (blogs) => {
    let authors = blogs.reduce((authors, blog) => {
        if (!(authors.find((x) => x.author === blog.author))) {
            authors.push({
                author: blog.author,
                blogs: 0
            })
        }
        authors = authors.map((author) => author.author === blog.author ? {...author, blogs: author.blogs + 1} : author)
        return authors
    }, [])

    return authors.reduce((best, author) => best.blogs < author.blogs ? author : best, authors[0])
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}