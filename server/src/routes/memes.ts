import { Router } from "express";
import { getMeme, postMeme } from "../controllers/meme";

export const memeRouter = Router();

memeRouter.route("/meme").get(getMeme);
memeRouter.route("/meme").post(postMeme);
