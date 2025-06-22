import { z } from "zod";
export const memeFormSchema = z.object({
  title: z.string(),
  image_url: z.string().url(),
  owner_id: z.string().uuid(),
  upvotes: z.number().int(),
  tags: z.array(z.string()),
  credits: z.number().int(),
  ai_caption: z.string(),
  ai_vibe: z.string(),
});
export const memeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  image_url: z.string().url().default("https://picsum.photos/200"),
  owner_id: z.string().uuid(),
  upvotes: z.number().int().default(0),
  tags: z.string().array(),
  credits: z.number().int().default(0),
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

export const memePostSchema = z.object({
  ai_caption: z.string().nullable(),
  ai_vibe: z.string().nullable(),
  created_at: z.string().nullable(), // ISO date string
  credits: z.number().nullable(),
  id: z.string(), // UUID or ID string
  image_url: z.string().url(), // assumes image URL is valid
  owner_id: z
    .object({
      id: z.string(),
      username: z.string(),
    })
    .nullable(),
  tags: z.array(z.string()).nullable(),
  title: z.string(),
  upvotes: z.number().nullable(),
});

export type memePostSchemaType = z.infer<typeof memePostSchema>;
export type Meme = z.infer<typeof memeSchema>;
export type MemeForm = z.infer<typeof memeFormSchema>;
export type Vote = z.infer<typeof voteSchema>;
export type Bid = z.infer<typeof bidSchema>;
