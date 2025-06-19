import { Response, Request } from "express";

export const getMeme = async (req: Request, res: Response) => {
  res.status(200).json({
    name: "GET",
    age: 10,
  });
};
