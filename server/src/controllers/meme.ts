import { Request, Response } from "express";
import { getMemeQuery, getMemeByID } from "../db/getRequest";
import { insertMeme } from "../db/insertRequest";
import BadRequestError from "../errors/bad-request";
import { memeSchema } from "../types";
import { io } from "./../index";
export const getMeme = async (req: Request, res: Response) => {
  const { sort = "created_at", order = "desc" } = req.query as {
    sort?: string;
    order?: string;
  };

  const { status, message } = await getMemeQuery(sort, order);
  if (!status) {
    throw new BadRequestError(message as string);
  }
  res.status(200).json(message);
};

export const getMemeID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, message } = await getMemeByID(id);
  console.log(message);
  if (!status) {
    throw new BadRequestError(message as string);
  }
  res.status(200).json(message);
};

export const postMeme = async (req: Request, res: Response) => {
  // Validate request body using Zod schema
  const result = memeSchema.safeParse(req.body);

  if (!result.success) {
    console.log("DATA mising");
    throw new BadRequestError("Bad Request");
  }
  const { message, status } = await insertMeme({ meme: result.data });
  if (!status) throw new BadRequestError(message as string);
  io.emit("meme:created", message);
  res.status(201).json({ status: true, message: "Meme Created Successfully" });
};
