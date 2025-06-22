import { Request, Response } from "express";
import BadRequestError from "../errors/bad-request";
import { supabase } from "../supabase";
import { bidSchema } from "../types";
import { getBidsById } from "../db/getRequest";
import { updateBids } from "../db/updateRequest";
import { io } from "../index"; // 👈 Import socket instance

// ✅ GET total bids and broadcast (if needed)
export const getBid = async (req: Request, res: Response) => {
  const meme_id = req.query.meme_id as string;
  if (!meme_id) throw new BadRequestError("Bad Request");

  const { data: allBids, error } = await supabase
    .from("bids")
    .select("*")
    .eq("meme_id", meme_id);

  if (error) throw new BadRequestError(error.message);

  const totalCredits = allBids?.reduce((sum, bid) => sum + bid.credits, 0) || 0;
  const totalBids = allBids?.length || 0;
  const highestBid = allBids?.sort((a, b) => b.credits - a.credits)[0];

  res.json({
    totalCredits,
    totalBids,
    highestBid: highestBid?.credits || 0,
    highestBidder: highestBid?.user_id || null,
  });
};

// ✅ POST bid and broadcast in real-time
export const postBid = async (req: Request, res: Response) => {
  const result = bidSchema
    .omit({ id: true, created_at: true })
    .safeParse(req.body);

  if (!result.success) {
    throw new BadRequestError("Bad Request");
  }

  const bid = result.data;

  // 1. Update the cached bid count (if any)
  const bids = await getBidsById(bid.meme_id);
  if (!bids.status) throw new BadRequestError("Bad Request");

  await updateBids(bid.meme_id, (bids.message as number) + bid.credits);

  // 2. Insert new bid
  const { data, error } = await supabase
    .from("bids")
    .insert({
      credits: bid.credits,
      meme_id: bid.meme_id,
      user_id: bid.user_id,
      created_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    throw new BadRequestError(error.message);
  }

  // 3. Re-fetch all bids to emit update
  const { data: allBids } = await supabase
    .from("bids")
    .select("*")
    .eq("meme_id", bid.meme_id);

  const totalCredits = allBids?.reduce((sum, b) => sum + b.credits, 0) || 0;
  const highestBid = allBids?.sort((a, b) => b.credits - a.credits)[0];

  io.emit("meme:bid", {
    meme_id: bid.meme_id,
    totalCredits,
    highestBid: highestBid?.credits || 0,
    highestBidder: highestBid?.user_id || null,
  });

  const { data: userData } = await supabase
    .from("users")
    .select("username")
    .eq("id", bid.user_id)
    .single();

  const { data: memeData } = await supabase
    .from("memes")
    .select("title")
    .eq("id", bid.meme_id)
    .single();

  io.emit("leaderboard:user:bid", {
    user_id: bid.user_id,
    username: userData?.username || "Anonymous",
    meme_id: bid.meme_id,
    meme_title: memeData?.title || "Unknown",
    credits: bid.credits,
  });

  // 5. Respond with the new bid
  res.status(200).json({ bid: data?.[0] });
};
