import { Request, Response } from "express";
import BadRequestError from "../errors/bad-request";
import { supabase } from "../supabase";
import { bidSchema } from "../types";

export const getBid = async (req: Request, res: Response) => {
  const meme_id = req.query.meme_id as string;
  if (!meme_id) throw new BadRequestError("Bad Request");
  const { data, error } = await supabase
    .from("bids")
    .select("credits")
    .eq("meme_id", meme_id);

  if (error) throw new BadRequestError(error.message);

  const total = data.reduce((sum, bid) => sum + bid.credits, 0);
  res.json({ totalCredits: total });
};

export const postBid = async (req: Request, res: Response) => {
  const result = bidSchema
    .omit({ id: true, created_at: true })
    .safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError("Bad Request");
  }

  const bid = result.data;

  const { data, error } = await supabase
    .from("bids")
    .insert({
      credits: bid.credits,
      meme_id: bid.meme_id,
      user_id: bid.user_id,
    })
    .select();

  if (error) {
    throw new BadRequestError(error.message);
  }

  res.status(200).json({ bid: data?.[0] });
};
