import { NextFunction, Request, Response } from "express";
import ErrorHanlder from "../errors/ErrorHandler";

const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"
    
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHanlder(message, 400)
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHanlder(message, 400)
    }

    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again!"
        err = new ErrorHanlder(message, 400)
    }

    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token is expired. Try again!"
        err = new ErrorHanlder(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

export default ErrorMiddleware
