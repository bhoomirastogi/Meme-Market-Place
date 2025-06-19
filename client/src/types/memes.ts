import { z } from "zod";

export const memeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  image_url: z.string().url().default("https://picsum.photos/200"),
  owner_id: z.string().uuid(),
  upvotes: z.number().int().default(0),
  tags: z.string().array(),
  downvotes: z.number().int().default(0),
  ai_caption: z.string(),
  ai_vibe: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const voteSchema = z.object({
  id: z.string().uuid(),
  meme_id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.enum(["up", "down"]),
  created_at: z.string().datetime(),
});

export const bidSchema = z.object({
  id: z.string().uuid(),
  meme_id: z.string().uuid(),
  user_id: z.string().uuid(),
  credits: z.number().int().min(1),
  created_at: z.string().datetime(),
});

export type Meme = z.infer<typeof memeSchema>;
export type Vote = z.infer<typeof voteSchema>;
export type Bid = z.infer<typeof bidSchema>;
