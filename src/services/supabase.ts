import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function syncRealtimeAuth(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/realtime-token", {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to get realtime token");
      return false;
    }

    const { token } = await res.json();

    supabase.realtime.setAuth(token);

    return true;
  } catch (error) {
    console.error("Failed to sync realtime auth:", error);
    return false;
  }
}