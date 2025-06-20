type EnvSchemaType = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
};

export const env: EnvSchemaType = {
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY!,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL!,
};
