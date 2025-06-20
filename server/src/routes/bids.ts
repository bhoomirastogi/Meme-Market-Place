import { Router } from "express";
import { getBid, postBid } from "../controllers/bids";

export const bidsRouter = Router();
bidsRouter.route("/bids").post(postBid);

bidsRouter.route("/bids").get(getBid);
