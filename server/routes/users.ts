import express from "express"
import { registrationUser, activateUser } from "../controllers/users"

const userRouter = express.Router()

userRouter.post("/registration", registrationUser)
userRouter.post("/activation", activateUser)

export default userRouter

