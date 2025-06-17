import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./models/index";
import { env } from "../env/envSchema";
const client = postgres(
    env.DATABASE_URL
)
