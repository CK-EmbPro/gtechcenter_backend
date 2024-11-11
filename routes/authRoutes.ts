import Router, { Request, Response } from "express";
import { login, register } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { middleware } from "../middlewares/middleware";

export const authRouter = Router();

//@ts-ignore
authRouter.post("/login", login);
//@ts-ignore
authRouter.post("/register", register);
//@ts-ignore
authRouter.get("/profile", authMiddleware, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "authorized"
  })
});
