const Meal = require('../models/meal.model.js')
// const { options } = require('../routes/meal.routes')

async function createMeal(req, res) {

    try {
        const { idMeal, strMeal, strCategory, strArea, strInstructions, strMealThumb, strIngredients, price } = req.body

        if ([idMeal, strMeal, strCategory, strArea, strInstructions, strMealThumb, strIngredients, price].some((field) => (!field) || field.trim() === "")) {

            return res.status(400).json({ Error: "All Fileds are required..." })
        }
        const ingredients = strIngredients.split(" ")
        // console.log(ingredients);

        const existingMeal = await Meal.findOne({ idMeal })
        if (existingMeal) {
            return res.status(400).json({ Message: 'Meal is already present' })
        }
        const meal = await Meal.create({
            idMeal,
            strMeal,
            strCategory,
            strArea,
            strInstructions,
            strMealThumb,
            strIngredients: ingredients,
            price
        })
        return res.status(200).json(meal)
    } catch (error) {
        return res.status(500).json({ Error: 'Internal Server Error' })
    }
}

async function getAllMeals(req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    try {
        const startIndex = (page - 1) * limit;
        const allMeals = await Meal.find({}).skip(startIndex).limit(limit);

        if (allMeals.length === 0)
            return res.status(200).json("No Data Found")

        return res.status(200).json({ meals: allMeals })

    } catch (error) {
        console.log(`internal server error ${error}`);
        return res.status(500).json({ Error: 'internal server error' })
    }
}


async function searchMealWithName(req, res) {
    const mealName = req.query.meal;
    const location = req.query.location || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!mealName) {
        return res.status(400).json({ error: "Meal name is required" });
    }

    const query = {
        strMeal: { $regex: mealName, $options: 'i' }
    };
    if (location) {
        query.strArea = { $regex: location, $options: 'i' };
    }

    try {
        const skip = (page - 1) * limit;
        const totalMeals = await Meal.countDocuments(query);
        const meals = await Meal.find(query).skip(skip).limit(limit);

        if (meals.length === 0) {
            return res.status(200).json({ message: "No Meal Data Found" });
        }

        const totalPages = Math.ceil(totalMeals / limit);

        return res.status(200).json({
            meals: meals,
            pagination: {
                totalMeals: totalMeals,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while searching for meals" });
    }
}

async function searchMealWithId(req, res) {
    const mealId = req.query?.mealId

    const meal = Meal.findOne({
        idMeal: mealId
    })

    if (!meal) {
        return res.status(200).json({ message: 'not meal found' })
    }

    return res.status(200).json({ meal: meal })
}

module.exports = { createMeal, getAllMeals, searchMealWithName, searchMealWithId }