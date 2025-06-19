import { memeDuelSchema, type MemeDuel } from "./duals";
import {
  memeSchema,
  type Bid,
  type Meme,
  type Vote,
  bidSchema,
  voteSchema,
} from "./memes";
import { type MemeTag, type Tag, memeTagSchema, tagSchema } from "./tags";
import { type User, userSchema } from "./user";

export {
  memeDuelSchema,
  memeSchema,
  voteSchema,
  bidSchema,
  memeTagSchema,
  tagSchema,
  userSchema,
};

export type { MemeDuel, Bid, Meme, Vote, MemeTag, Tag, User };
