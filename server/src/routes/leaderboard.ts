import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderbard";

export const leaderboardRouter = Router();
leaderboardRouter.route("/leaderboard").get(getLeaderboard);
