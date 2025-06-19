import cors from "cors";
import { env } from "./env/envSchema";

export const corsConfig = cors({
  origin: env.CLIENT_URL,
  methods: ["GET", "PATCH", "POST", "DELETE"],
});
