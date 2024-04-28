import { app } from "./app"
import userRouter from "./routes/users"
import connectDB from "./utils/db"
require("dotenv").config()

app.use("/api", userRouter)

app.get("/", (req, res) => {
    res.json({ value: "Hello World" })
})

app.all("*", (req, res) => {
    res.status(404).json({ error: "Not found" })
})

app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server running on port ${process.env.PORT}`)
})