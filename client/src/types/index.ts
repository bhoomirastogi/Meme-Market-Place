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
import { memePostSchema, type memePostSchemaType } from "./memes";

export {
  memeDuelSchema,
  memeSchema,
  voteSchema,
  bidSchema,
  memeTagSchema,
  tagSchema,
  userSchema,
  memePostSchema,
};

export type {
  MemeDuel,
  memePostSchemaType,
  Bid,
  Meme,
  Vote,
  MemeTag,
  Tag,
  User,
};
