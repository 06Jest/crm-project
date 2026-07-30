import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./services/supabase";
import { fetchConversations} from "./store/conversationsSlice";
import type { AppDispatch} from "../src/store/store";
import { useDispatch } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: Props) {
  const { loaded, loading, currentUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    
    if (!loaded && !loading) {
      currentUser();
    }
  }, [loaded, loading, currentUser]);

useEffect(() => {
  if (!loaded || loading) return;

  const channel = supabase
    .channel("global-chat")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "conversations" },
      () => {
        dispatch(fetchConversations());
      }
    )
    .subscribe((status) => {
      console.log(status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [loaded, loading, dispatch]);
  
  return <>{children}</>;
}