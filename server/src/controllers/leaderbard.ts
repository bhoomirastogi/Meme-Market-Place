import { Request, Response } from "express";
import { supabase } from "../supabase";
import BadRequestError from "../errors/bad-request";

export const getLeaderboard = async (req: Request, res: Response) => {
  // 1. Get all memes (for Meme Leaderboard)
  const { data: memes, error: memesError } = await supabase
    .from("memes")
    .select("id, title, image_url, credits");

  if (memesError) throw new BadRequestError(memesError.message);

  // 2. For each meme, get highest bid
  const memeLeaderboard = await Promise.all(
    memes.map(async (meme) => {
      const { data: bids } = await supabase
        .from("bids")
        .select("credits, user_id, users(username)")
        .eq("meme_id", meme.id)
        .order("credits", { ascending: false })
        .limit(1);

      return {
        ...meme,
        highestBid: bids?.[0]?.credits || 0,
        highestBidder: bids?.[0]?.user_id || "—",
        highestBidderName: bids?.[0]?.users?.username || "Anonymous",
      };
    })
  );

  memeLeaderboard.sort((a, b) => b.highestBid - a.highestBid);

  // 3. User Leaderboard (users with their highest bid + meme title)
  const { data: allBids, error: bidsError } = await supabase
    .from("bids")
    .select("user_id, meme_id, credits, users(username)");

  if (bidsError) throw new BadRequestError(bidsError.message);

  // Reduce to highest bid per user
  const userMap = new Map<
    string,
    { user_id: string; username: string; meme_id: string; credits: number }
  >();

  for (const bid of allBids) {
    if (!bid.user_id || !bid.meme_id) continue;
    const username = bid.users?.username || "Anonymous";

    if (
      !userMap.has(bid.user_id) ||
      bid.credits > userMap.get(bid.user_id)!.credits
    ) {
      userMap.set(bid.user_id, {
        user_id: bid.user_id,
        username,
        meme_id: bid.meme_id,
        credits: bid.credits,
      });
    }
  }

  const userLeaderboard = Array.from(userMap.values())
    .sort((a, b) => b.credits - a.credits)
    .map((entry) => {
      const memeTitle =
        memes.find((m) => m.id === entry.meme_id)?.title || "Unknown Meme";
      return {
        user_id: entry.user_id,
        username: entry.username,
        credits: entry.credits,
        meme_id: entry.meme_id,
        meme_title: memeTitle,
      };
    });

  res.status(200).json({
    memeLeaderboard,
    userLeaderboard,
  });
};
