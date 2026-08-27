import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { supabase } from "../../../services/supabase";
import { oauthLoginAPI } from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const hasHandledCallback = useRef(false);

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    const handleCallback = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.access_token) {
          navigate("/login", { replace: true });
          return;
        }
        await oauthLoginAPI(session.access_token);
        await currentUser();
        navigate("/app/dashboard", { replace: true });
      } catch (error) {
        console.error("OAuth authentication failed:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, currentUser]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}