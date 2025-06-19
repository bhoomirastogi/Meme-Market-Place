import { Router } from "express";
import { getMeme, getMemeID, postMeme } from "../controllers/meme";

export const memeRouter = Router();

memeRouter.route("/meme").get(getMeme);
memeRouter.route("/meme").post(postMeme);
memeRouter.route("/meme/:id").get(getMemeID);
