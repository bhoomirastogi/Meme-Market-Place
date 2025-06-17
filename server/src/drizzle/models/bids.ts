import { pgTable, real, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./drizzleHelper";

export const bids = pgTable("bids", {
  id,
  memeId: uuid("meme_id").notNull(),
  userId: uuid("user_id").notNull(),
  credits: real("credits").notNull(),
  createdAt,
  updatedAt,
});
