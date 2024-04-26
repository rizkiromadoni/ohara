import mongoose from "mongoose"
require("dotenv").config()

const DBURL = process.env.DB_URL || "mongodb://localhost:27017"

const connectDB = async () => {
    try {
        const db = await mongoose.connect(DBURL)
        console.log(`MongoDB Connected: ${db.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
