import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  credits: z.number().int().default(1000),
  created_at: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;
