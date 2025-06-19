import { Router } from "express";
import { getMeme } from "../controllers/meme";
import { logger } from "../middleware/logger";

export const memeRouter = Router();

memeRouter.route("/meme").get(getMeme);
