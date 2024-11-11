import { Request, Response } from "express"
import { UserModel } from "../models/User"
import { generateKey } from "crypto"
import { generateToken } from "../utils/jwt"

export const register = async(req: Request, res: Response)=>{

    try {
        const {names, email, password} = req.body
        const userToSave = new UserModel({names, email, password})
        const savedUser = await userToSave.save()
        const token = generateToken(savedUser)
        
        return res.status(201).json({
            message: 'User saved successfully',
            user: savedUser, 
            token
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error happened while registering user",
            error
        })
    }
}

export const login = async(req: Request, res: Response)=>{
    try {
        const {email, password} = req.body
        const userToLogIn = await UserModel.findOne({email})
        if(!userToLogIn){
            return res.status(404).json({
                message: "User not found",
            })
        }else if (!await userToLogIn.comparePassword(password)){
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = generateToken(userToLogIn)

        return res.status(200).json({
            message: "LoggedIn successfully",
            use: userToLogIn,
            token
        })

        
    } catch (error) {
        return res.status(500).json({
            message: "Error while logging in",
            error
        })
    }
}