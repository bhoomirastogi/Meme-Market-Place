import { Request, Response } from "express";
import { getMemeUpVoteByID } from "../db/getRequest";
import BadRequestError from "../errors/bad-request";
import NotFoundError from "../errors/not-found";
import { supabase } from "../supabase";
import { voteSchema } from "../types";

export const postVote = async (req: Request, res: Response) => {
  const result = voteSchema.safeParse(req.body);
  if (!result.success) throw new BadRequestError("Invalid Vote Payload");

  const { meme_id, user_id, type } = result.data;

  // Step 1: Get existing meme
  const { message: memeData, status } = await getMemeUpVoteByID(meme_id);
  if (!status) throw new NotFoundError(memeData as string);

  const meme = memeData as { upvotes: number };

  // Step 2: Check if this user already voted for this meme
  const { data: existingVote, error: voteCheckError } = await supabase
    .from("votes")
    .select("*")
    .eq("meme_id", meme_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (voteCheckError) {
    throw new BadRequestError(voteCheckError.message);
  }

  let newVotes = meme.upvotes;

  if (existingVote) {
    // 🧨 Already voted, so remove vote (toggle off)
    await supabase.from("votes").delete().eq("id", existingVote.id);

    newVotes -= 1; // 🧨 Decrease upvote count
  } else {
    // 👍 New vote
    await supabase.from("votes").insert({
      meme_id,
      user_id,
      type,
      created_at: new Date().toISOString(),
    });

    newVotes += 1; // 👍 Increase upvote count
  }

  // Update meme's upvotes
  const { error: updateError } = await supabase
    .from("memes")
    .update({ upvotes: newVotes })
    .eq("id", meme_id);

  if (updateError) throw new BadRequestError(updateError.message);

  res.status(200).json({
    success: true,
    message: existingVote ? "Vote removed" : "Vote added",
    upvotes: newVotes,
  });
};

export const getVotes = async (req: Request, res: Response) => {
  const { user_id } = req.query;

  if (!user_id || typeof user_id !== "string") {
    throw new BadRequestError("Missing or invalid user_id");
  }

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  console.log(data);
  res.status(200).json(data);
};
