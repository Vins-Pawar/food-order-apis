const User = require('../models/user.model')
const { setUser, getUser } = require('../services/auth')
const bcrypt = require('bcrypt');

async function handleUserSignin(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ Error: 'email and password required' })
    }

    const user = await User.findOne({ email })
    // console.log(user);

    if (!user) {
        return res.status(400).json({ Error: 'Email is not register please sign up' })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json({ Eror: "Invalid User Credentails" })
    }
    const token = setUser(user)
    res.cookie('userId', token, { httpOnly: true, secure: true, sameSite: 'Strict', expiresIn: '1hr' })

    return res.status(200).json({ Message: 'login successful' })
}

async function handleUserSignup(req, res) {
    const { email, password, confirmPassword } = req.body

    if ([email, password, confirmPassword].some((field) => (!field) || field.trim() === "")) {
        return res.status(400).json({ Error: 'All Fields are required' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ Message: 'Email is already registered Please Login In' })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ Error: 'Password not matching' })
    }

    const user = await User.create({
        email,
        password
    })
    // console.log(user);
    // delete user.password;
    // const token = setUser(user)
    return res.status(200).json({ user: user })
}

module.exports = { handleUserSignin, handleUserSignup }