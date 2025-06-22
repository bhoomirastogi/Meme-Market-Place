// server/src/routes/authRoutes.ts
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

export const authRouter = Router();
authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
