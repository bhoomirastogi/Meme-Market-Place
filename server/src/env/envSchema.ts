type EnvSchemaType = {
  DATABASE_URL: string;
  SUPABASE_KEY: string;
  SUPABASE_URL: string;
};

export const env: EnvSchemaType = {
  // VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_KEY!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
};
