import { z } from "zod";

export const tagSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});
export const memeTagSchema = z.object({
  meme_id: z.string().uuid(),
  tag_id: z.number().int(),
});

export type Tag = z.infer<typeof tagSchema>;
export type MemeTag = z.infer<typeof memeTagSchema>;
