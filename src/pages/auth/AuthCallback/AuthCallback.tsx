import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { supabase } from "../../../services/supabase";
import { oauthLoginAPI } from "../../../services/authService";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error || !data.session) {
          navigate("/login", { replace: true });
          return;
        }

        const result = await oauthLoginAPI(
          data.session.access_token
        );

        navigate(
          result.needsOnboarding
            ? "/onboarding"
            : "/app/dashboard",
          { replace: true }
        );

      } catch (error) {
        console.error(
          "OAuth authentication failed:",
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