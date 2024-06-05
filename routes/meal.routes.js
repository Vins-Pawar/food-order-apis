const express = require('express')
const { Meal } = require('../models/meal.model')

const { createMeal, getAllMeals, searchMealWithName, searchMealWithId } = require('../controllers/meal.controller')
const { restrictTo, checkForAuthentication } = require('../middlewares/auth')

const route = express.Router()

route.get('/', getAllMeals)
route.post('/', checkForAuthentication, restrictTo(['ADMIN']), createMeal)
route.get('/searchMealWithName', searchMealWithName)
route.get('./searchMealWithId', searchMealWithId)

module.exports = route