import { Redis } from "ioredis";
require("dotenv").config()

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("REDIS_URL: " + process.env.REDIS_URL)
        return process.env.REDIS_URL
    }

    throw new Error("REDIS_URL is not defined")
}

const redis = new Redis(redisClient())

export default redis
