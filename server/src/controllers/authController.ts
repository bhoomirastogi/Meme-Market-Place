// server/src/controllers/authController.ts
import { Request, Response } from "express";
import { supabase } from "../supabase";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad-request";
import { env } from "../env/envSchema";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    throw new BadRequestError("Missing fields");
  }

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }
  const user_id = signUpData.user?.id;

  if (user_id) {
    await supabase.from("users").insert({ id: user_id, username, email });
  }

  const token = jwt.sign(
    {
      user_id,
      username,
      email,
      credits: 0,
    },
    env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  res
    .status(201)
    .json({ message: "User registered, please verify email", token: token });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError("Missing credentials");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) throw new BadRequestError("Invalid credentials");
  const { data: credits, error: error1 } = await supabase
    .from("users")
    .select("credits,username")
    .eq("email", email)
    .single(); // use `.single()` if you're expecting only one row

  const credit = credits?.credits;
  if (!credits) {
    throw new BadRequestError(error1.message);
  }
  const token = jwt.sign(
    {
      user_id: data.user.id,
      username: credits.credits,
      email: data.user.email,
      credits: credits.credits,
    },
    env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.status(200).json({ token });
};

export const checkMe = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ user });
};
