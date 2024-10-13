import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authorization } from "../middlewares/authorization";
export const userRouter = Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/signin", userController.signin);
userRouter.get("/", [authorization, userController.getUserInfo]);
