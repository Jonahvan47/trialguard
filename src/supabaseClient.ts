import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vnjlmyuosmevxdaxnnhb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuamxteXVvc21ldnhkYXhubmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDM2MjMsImV4cCI6MjA5MTc3OTYyM30.zbidnqCoh7kJ565f15-665CaGGLKcYcIOytnB7EOgMo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);