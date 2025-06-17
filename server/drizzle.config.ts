import { defineConfig } from "drizzle-kit";
import { env } from "./src/env/envSchema";
export default defineConfig({
  out: "./migrations",
  schema: "./src/drizzle/models/index.ts",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
