require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')

const { connectToMongoDb } = require('./connection.js')

//routes
const mealRoutes = require('./routes/meal.routes.js')
const userRoutes = require('./routes/user.routes.js')
const addToCartRoutes = require('./routes/cart.routes.js')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

connectToMongoDb()
    .then(() => { console.log('mongodb connection successful'); })
    .catch((err) => { console.log('Error in connection to mongoDB ' + err); })


app.use('/api/v1', mealRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/cart', addToCartRoutes)

const port = process.env.PORT || 8001

app.listen(port, () => {
    console.log(`Server started on a port ${port}`);
})