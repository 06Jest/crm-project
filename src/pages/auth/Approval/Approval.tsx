import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Fade,
  Avatar,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import { useAuth } from "../../../hooks/useAuth";

export default function Approval() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={28} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Fade in timeout={450}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 3,
              bgcolor: "action.selected",
              color: "primary.main",
            }}
          >
            <HourglassTopRoundedIcon fontSize="medium" />
          </Avatar>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: "-0.01em" }}>
            Waiting for Approval
          </Typography>

          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Your workspace membership is waiting for approval from an owner or
            manager. You'll be able to access the workspace once your request
            has been approved.
          </Typography>

          {user?.email && (
            <Box
              sx={{
                mt: 3,
                py: 1,
                px: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "inline-block",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Signed in as <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>{user.email}</Box>
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
            Once your request has been approved, refresh this page to continue.
          </Typography>

          <Button
            variant="contained"
            disableElevation
            startIcon={<RefreshRoundedIcon />}
            onClick={() => window.location.reload()}
            fullWidth
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              },
            }}
          >
            Refresh Status
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}