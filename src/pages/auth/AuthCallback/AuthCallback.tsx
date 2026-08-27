import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { supabase } from "../../../services/supabase";
import { oauthLoginAPI } from "../../../services/authService";

export default function AuthCallback() {
  const navigate = useNavigate();

useEffect(() => {
  const handleCallback = async () => {
    console.log("🔥 AUTH CALLBACK STARTED");

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("🔥 SUPABASE SESSION:", session);
      console.log("🔥 SUPABASE ERROR:", error);

      if (error || !session?.access_token) {
        console.log("🔥 NO SESSION, REDIRECTING TO LOGIN");
        navigate("/login", { replace: true });
        return;
      }

      console.log("🔥 CALLING BACKEND OAUTH");

      const result = await oauthLoginAPI(
        session.access_token
      );

      console.log("🔥 BACKEND OAUTH RESULT:", result);

      navigate(
        result.needsOnboarding
          ? "/onboarding"
          : "/app/dashboard",
        { replace: true }
      );
    } catch (error) {
      console.error(
        "🔥 OAuth authentication failed:",
        error
      );

      navigate("/login", { replace: true });
    }
  };

  handleCallback();
}, [navigate]);

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