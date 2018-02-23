const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    adult: Boolean,
    blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
})


userSchema.statics.format = (user) => {
    return {
        username: user.username,
        name: user.name,
        adult: user.adult,
        id: user._id,
        blogs: user.blogs
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User