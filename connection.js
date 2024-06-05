const mongoose = require('mongoose')

async function connectToMongoDb() {
    // console.log(process.env.MONGODB_URL);
    return await mongoose.connect(process.env.MONGODB_URL)
}

module.exports = { connectToMongoDb }