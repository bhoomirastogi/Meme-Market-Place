import { Request, Response, Router } from "express";
import { z } from "zod";
import { supabase } from "../supabase";
import { memeSchema } from "../types";

const router = Router;

router.post("/", async (req: Request, res: Response) => {
  const result = memeSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.flatten() });
  const { title, image_url, owner_id } = result.data;

  const { data, error } = await supabase
    .from("memes")
    .insert({
      title,
      image_url: image_url || "https://picsum.photos/200",

      upvotes: 0,
      owner_id,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.status(201).json(data);
});

router.get("/", async (req: Request, res: Response) => {
  const { sort = "created_at", order = "desc" } = req.query as {
    sort?: string;
    order?: string;
  };
  const { data, error } = await supabase
    .from("memes")
    .select("*")
    .order(sort, { ascending: order === "asc" });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

const voteRequestSchema = z.object({ type: z.enum(["up", "down"]) });

router.post("/:id/vote", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = voteRequestSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ error: result.error.flatten() });
  const { type } = result.data;

  const { data: meme, error: fetchError } = await supabase
    .from("memes")
    .select("upvotes")
    .eq("id", id)
    .single();
  if (fetchError || !meme)
    return res.status(404).json({ error: "Meme not found" });

  const newVotes = meme.upvotes + (type === "up" ? 1 : -1);
  const { error } = await supabase
    .from("memes")
    .update({ upvotes: newVotes })
    .eq("id", id);
  if (error) return res.status(500).json({ error });
  res.json({ success: true });
});

export default router;
