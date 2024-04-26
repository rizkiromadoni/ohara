import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
require("dotenv").config()

export const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN_URL,
}))
