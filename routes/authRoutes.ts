import Router, { Request, Response } from "express";
import { getAllUsers, login, register, deleteUser, deleteAllUsers, getCurrentUser, getUser } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { adminMiddleware } from "../middlewares/AdminMiddleware";

export const authRouter = Router();

//@ts-ignore
authRouter.post("/login", login);

//@ts-ignore
authRouter.post("/register", register);

//@ts-ignore
authRouter.get("/current_user",authMiddleware, getCurrentUser);


//@ts-ignore
authRouter.get('/users',adminMiddleware, getAllUsers)

//@ts-ignore
authRouter.get('/users/:user_id',adminMiddleware, getUser)

//@ts-ignore
authRouter.delete('/users/:user_id',adminMiddleware, deleteUser)

//@ts-ignore
authRouter.delete('/users',adminMiddleware, deleteAllUsers)