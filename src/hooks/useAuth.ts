import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: {subscription} } = supabase.auth.onAuthStateChange((_event,session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  },[]);
  return {
    session,
    user: session?.user ?? null,
    loading,
  };
};