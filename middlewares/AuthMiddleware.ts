import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../utils/jwt";
import { UserModel } from "../models/User";
import { NotFoundError, UnAuthorizedError } from "../exceptions/errors";
import mongoose from "mongoose";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.substring(7);

    if (!token) {
      return res.status(401).json({
        message: "Auth Token required",
      });
    }

    const decodedToken = verifyToken(token);

    //@ts-ignore
    const user = decodedToken?.decodedUser?.user;

    const currentUser = await UserModel.findOne({ ...user });

    if (!currentUser) {
      return res.status(400).json({
        message: "Invalid token, user not found",
      });
    }

    next();

    
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message:error.message,
      });
    } else if (error instanceof UnAuthorizedError) {
      return res.status(401).json({
        message:error.message,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        message:error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0]
      });
    }
  }
};
