import jwt from 'jsonwebtoken'
import { User } from '../types'
import dotenv from 'dotenv'
import e from 'express'

dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET

export const generateToken = (user: User)=>{

    if(!jwtSecretKey){
        return {
            error: "Jwt secret key is required"
        }
    }

    try {
        const token = jwt.sign({user}, jwtSecretKey, {expiresIn: 60*60})

        return {
            message: "Jwt token generated successfully",
            token
        }
    } catch (error) {
        if(error instanceof Error)
        return {
            error: "Error generating token "+error.message
        }
    }
}

export const verifyToken = (token: string)=>{

    if(!jwtSecretKey){
        return {
            error: "Jwt secret key is required"
        }
    }else if(!token){
        return {
            error: "Token is required"
        }
    }
    try {
        const decodedUser = jwt.verify(token, jwtSecretKey)
        return {
            decodedUser
        }
    } catch (error) {
        if(error instanceof Error){
            return {
                error: "Error while verifying token "+error.message
            }
        }
    }
    
}