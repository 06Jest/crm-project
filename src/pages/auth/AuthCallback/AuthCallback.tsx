import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { supabase } from "../../../services/supabase";
import { oauthLoginAPI } from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
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

        const result = await oauthLoginAPI(session.access_token);

        await currentUser().unwrap();

        navigate(
          result.needsOnboarding ? "/onboarding" : "/app/dashboard",
          { replace: true }
        );
      } catch (err) {
        console.error("OAuth authentication failed:", err);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}