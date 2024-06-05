const express = require('express')
const User = require('../models/user.model')
const bcrypt = require('bcrypt');

const { handleUserSignin, handleUserSignup } = require('../controllers/user.controller')

const router = express.Router();

router.post('/signup', handleUserSignup)

router.post('/signin', handleUserSignin)

module.exports = router