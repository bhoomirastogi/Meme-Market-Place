import { pgTable, real, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./drizzleHelper";

export const memes = pgTable("memes", {
  id,
  createdAt,
  updatedAt,
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").array().default([]),
  upvotes: real("upvotes").default(0),
  caption: text("caption"),
  vibe: text("vibe"),
  userId: uuid("owner_id").notNull(),
});
