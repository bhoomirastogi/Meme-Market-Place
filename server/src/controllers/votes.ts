import { z } from "zod";
import BadRequestError from "../errors/bad-request";
import { Request, Response } from "express";
import { getMemeByID } from "../db/getRequest";
import NotFoundError from "../errors/not-found";
import { updateVote } from "../db/updateRequest";

const voteRequestSchema = z.object({ type: z.enum(["up", "down"]) });

export const postVote = async (req: Request, res: Response) => {
  console.log("HELLO");
  const { id } = req.params;
  const result = voteRequestSchema.safeParse(req.body);
  console.log(result.data);
  if (!result.success) throw new BadRequestError("Bad Request");
  const { type } = result.data;

  const { message, status } = await getMemeByID(id);
  if (!status) throw new NotFoundError(message as string);

  const meme = message as number;
  console.log("MERA upvotes", meme);
  const newVotes = meme + (type === "up" ? 1 : -1);
  const { message: voteMessage, status: votestatus } = await updateVote(
    newVotes,
    id
  );
  if (!votestatus) throw new BadRequestError(voteMessage as string);
  res.json({ success: true });
};
