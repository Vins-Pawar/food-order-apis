const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role :{
        type: String,
        required: true,
        default : 'NORMAL'
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    //check if password is modified or not if modified encrypt it
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User