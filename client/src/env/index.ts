type EnvSchemaType = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  GEMINI_KEY: string;
  VITE_GEMINI_URL: string;
};

export const env: EnvSchemaType = {
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY!,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL!,
  GEMINI_KEY: import.meta.env.VITE_GEMINI_KEY!,
  VITE_GEMINI_URL: import.meta.env.VITE_GEMINI_URL!,
};
