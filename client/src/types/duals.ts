import { z } from "zod";

export const memeDuelSchema = z.object({
  id: z.string().uuid(),
  meme1_id: z.string().uuid(),
  meme2_id: z.string().uuid(),
  winner_id: z.string().uuid().nullable().optional(),
  duel_started_at: z.string().datetime(),
  duel_ended_at: z.string().datetime().nullable().optional(),
});

export type MemeDuel = z.infer<typeof memeDuelSchema>;
