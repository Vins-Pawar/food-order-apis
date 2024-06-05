const express = require('express')

const { checkForAuthentication, restrictTo } = require('../middlewares/auth.js')
const { handleAddToCart, removeFromCart } = require('../controllers/cart.controller.js')
const router = express.Router()

router.get('/addtocart', checkForAuthentication, restrictTo(['NORMAL']), handleAddToCart)
router.get('/removeFromCart', checkForAuthentication, restrictTo(['NORMAL']), removeFromCart)

module.exports = router 