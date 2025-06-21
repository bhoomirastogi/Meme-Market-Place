// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
