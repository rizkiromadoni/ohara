import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import ejs from "ejs"
import userModel from "../models/users"
import ErrorHanlder from "../errors/ErrorHandler"
import CatchAsyncError from "../middleware/catchAsyncError"
import path from "path"
import sendMail from "../utils/sendMail"
require("dotenv").config()

interface IRegistrationBody {
    name: string
    email: string
    password: string
    avatar?: string
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body

        const isEmailExist = await userModel.findOne({ email })
        if (isEmailExist) {
            return next(new ErrorHanlder("Email already exist", 400))
        }

        const user: IRegistrationBody = {
            name,
            email,
            password
        }

        const activationToken = createActivationToken(user)
        const activationCode = activationToken.activationCode

        const data = {
            user: { name: user.name },
            activationCode
        }

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation.ejs",
                data
            })

            res.status(201).json({
                success: true,
                message: "Registration success. Please check your email to activate your account",
                activationToken: activationToken.token
            })
        } catch (error: any) {
            return next(new ErrorHanlder(error.message, 500))
        }
    } catch (error: any) {
        return next(new ErrorHanlder(error.message, 400))
    }
})

interface IActivationToken {
    token: string
    activationCode: string
}

export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_TOKEN_SECRET as Secret, {
        expiresIn: "5m"
    })

    return { token, activationCode }
}