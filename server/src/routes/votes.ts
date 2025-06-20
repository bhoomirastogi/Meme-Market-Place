import { Router } from "express";
import { getVotes, postVote } from "../controllers/votes";

export const voteRouter = Router();

voteRouter.route("/vote").post(postVote);
voteRouter.route("/vote").get(getVotes);
