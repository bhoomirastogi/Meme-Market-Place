import { Router } from "express";
import { postVote } from "../controllers/votes";

export const voteRouter = Router();

voteRouter.route("/vote").post(postVote);
