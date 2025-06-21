import { Request, Response } from "express";
import { supabase } from "../supabase";
import BadRequestError from "../errors/bad-request";

export const getLeaderboard = async (req: Request, res: Response) => {
  const { data: memes, error } = await supabase
    .from("memes")
    .select("id, title, image_url");

  if (error) throw new BadRequestError(error.message);

  // For each meme, get its highest bid
  const memeWithBids = await Promise.all(
    memes.map(async (meme) => {
      const { data: bids } = await supabase
        .from("bids")
        .select("*")
        .eq("meme_id", meme.id)
        .order("credits", { ascending: false })
        .limit(1);

      return {
        ...meme,
        highestBid: bids?.[0]?.credits || 0,
        highestBidder: bids?.[0]?.user_id || "—",
      };
    })
  );

  // Sort by highest bid
  memeWithBids.sort((a, b) => b.highestBid - a.highestBid);

  res.status(200).json({ leaderboard: memeWithBids });
};
