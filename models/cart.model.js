const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    meal: [
        {
            mealId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Meal'
            },
            mealName: {
                type: String,
                required: true
            },
            mealCategory: {
                type: String,
                required: true
            },
            mealQuantity:{
                type:Number,
                required : true
            }
        },
    ],

    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart