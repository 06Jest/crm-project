import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading, loaded } = useAuth();
  const location = useLocation();
  
  console.log({
    pathname: location.pathname,
    completed: user?.onboarding_completed,
  });
  if (loading || !loaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    !user.onboarding_completed &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  if (
    user.onboarding_completed &&
    location.pathname === "/onboarding"
  ) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}