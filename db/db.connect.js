const mongoose = require('mongoose')
require("dotenv").config()
const mongoUri = process.env.MONGODB

const initializeData = async()=>{
    await mongoose.connect(mongoUri).then(()=>{
        console.log("Connected to Database")
    }).catch((error)=>{
        console.log("Error while connecting to database")
    })
}


module.exports = {initializeData}