import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function AppInitializer({ children }: Props) {
  const { loaded, loading, currentUser } = useAuth();

  useEffect(() => {
  if (!loaded && !loading) {
    currentUser();
  }
}, [loaded, loading]);
  
  return <>{children}</>;
}