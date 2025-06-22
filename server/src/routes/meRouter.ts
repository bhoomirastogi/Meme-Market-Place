import { Request, Response, Router } from "express";
import { checkMe } from "../controllers/authController";

export const meRouter = Router();

meRouter.route("/me").get(checkMe);
