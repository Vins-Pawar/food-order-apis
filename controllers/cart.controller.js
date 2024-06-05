const Cart = require('../models/cart.model.js');
const Meal = require('../models/meal.model.js');

async function handleAddToCart(req, res) {
    try {
        const user = req.user;
        const quantity = parseInt(req.query?.quantity) || 0;
        const mealId = req.query?.mealId;

        const meal = await Meal.findOne({ idMeal: mealId });
        if (!meal) {
            return res.status(400).json({ Message: 'No Meal Found' });
        }

        let existingCart = await Cart.findOne({ userId: user._id });

        if (!existingCart) {
            existingCart = new Cart({ userId: user._id, meal: [] });
        }

        let existingMealIndex = existingCart.meal.findIndex(item => item.mealId.toString() === meal._id.toString());

        if (existingMealIndex !== -1) {
            existingCart.meal[existingMealIndex].mealQuantity += quantity;
        } else {
            existingCart.meal.push({
                mealId: meal._id,
                mealName: meal.strMeal,
                mealCategory: meal.strCategory,
                mealQuantity: quantity
            });
        }

        existingCart.totalPrice += meal.price * quantity;

        await existingCart.save();

        return res.status(200).json({ cart: existingCart });
    } catch (error) {
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
}

async function removeFromCart(req, res) {
    try {
        const user = req.user;
        const quantity = parseInt(req.query?.quantity) || 0;
        const mealId = req.query?.mealId;

        // Find the meal based on mealId
        const meal = await Meal.findOne({ idMeal: mealId });
        if (!meal) {
            return res.status(400).json({ Message: 'No Meal Found' });
        }

        // Find the user's cart
        let existingCart = await Cart.findOne({ userId: user._id });
        if (!existingCart) {
            return res.status(400).json({ Message: 'Cart not found' });
        }

        // Find the index of the meal in the cart
        const existingMealIndex = existingCart.meal.findIndex(item => item.mealId.toString() === meal._id.toString());

        // If meal exists in the cart
        if (existingMealIndex !== -1) {
            // If the quantity to remove is greater than or equal to the existing quantity in the cart, remove the meal from the cart
            if (quantity >= existingCart.meal[existingMealIndex].mealQuantity) {
                existingCart.meal.splice(existingMealIndex, 1);
            } else {
                // Otherwise, decrement the meal quantity
                existingCart.meal[existingMealIndex].mealQuantity -= quantity;
            }
            // Update the total price of the cart
            existingCart.totalPrice -= meal.price * quantity;
            // Save the changes to the cart
            await existingCart.save();
        }

        return res.status(200).json({ cart: existingCart });
    } catch (error) {
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
}


module.exports = { handleAddToCart, removeFromCart };
