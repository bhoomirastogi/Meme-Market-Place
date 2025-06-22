import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env/envSchema";
import { supabase } from "../supabase";
import UnAuthorised from "../errors/unauthorised";
import NotFoundError from "../errors/not-found";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = await req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnAuthorised("UnAuthorised");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { user_id: string };
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.user_id)
      .single();

    if (error || !user) {
      throw new NotFoundError("No User Found");
    }

    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
