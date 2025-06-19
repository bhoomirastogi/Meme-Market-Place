import "dotenv/config";

type EnvSchemaType = {
  DATABASE_URL: string;
  SUPABASE_KEY: string;
  SUPABASE_URL: string;
  PORT: string;
  CLIENT_URL: string;
  SERVER_URL: string;
};

export const env: EnvSchemaType = {
  // VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  CLIENT_URL: process.env.CLIENT_URL!,
  PORT: process.env.PORT!,
  SERVER_URL: process.env.SERVER_URL!,
};
