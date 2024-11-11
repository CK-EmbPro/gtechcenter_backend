import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { verifyToken } from "../utils/jwt"
import { UserModel } from "../models/User"

dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET
export const authMiddleware = async(req: Request, res: Response, next:NextFunction)=>{
    try {
    const token = req.header('Authorization')?.substring(7)

    if(!token){
        return res.status(401).json({
            message: "Auth Token required"
        })

    }

    const decodedToken = verifyToken(token)

    //@ts-ignore
    const user = decodedToken?.decodedUser?.user
    const error = decodedToken?.error

    if(error?.substring(8).startsWith('Jwt')){
       return res.status(401).json({
        message: "Provide secrekey key"
       })

    }else if(error?.substring(8).startsWith('Token'))
        return res.status(401).json({
            message: "Token is required"
        })


    console.log('user is', user);
    const savedUser = await UserModel.findOne({...user})
    console.log("savedUser", savedUser)

    //@ts-ignore
    req.user = savedUser

    next()

    } catch (error) {
        return res.status(500).json({
            message: "Error happened while verifying token",
            error
        })
    }
    
}