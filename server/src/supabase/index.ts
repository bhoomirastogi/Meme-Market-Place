import { env } from "../env/envSchema";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_KEY
);
