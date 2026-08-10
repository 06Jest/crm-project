import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Button,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import type { PasswordChangeValues } from "../../../types/profile";
import FormField from "./Formfield";

// Full-screen entrance on small viewports feels native (sheet slides up)
// instead of the desktop modal fading in place.
const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PasswordChangeValues) => void;
}

export default function ChangePasswordDialog({ open, onClose, onSubmit }: ChangePasswordDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const resetAndClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    onClose();
  };

  const newPasswordValid = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && newPasswordValid && passwordsMatch;

  const fieldType = showPasswords ? "text" : "password";

  const visibilityToggle = (
    <IconButton
      size="small"
      onClick={() => setShowPasswords((s) => !s)}
      edge="end"
      aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
    >
      {showPasswords ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
    </IconButton>
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ currentPassword, newPassword });
  };

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      TransitionComponent={fullScreen ? SlideUpTransition : undefined}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Change password</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <FormField
            label="Current password"
            type={fieldType}
            value={currentPassword}
            onChange={setCurrentPassword}
            endAdornment={visibilityToggle}
            autoFocus
          />
          <FormField
            label="New password"
            type={fieldType}
            value={newPassword}
            onChange={setNewPassword}
            helperText="Must be at least 8 characters"
            endAdornment={visibilityToggle}
          />
          <FormField
            label="Confirm new password"
            type={fieldType}
            value={confirmPassword}
            onChange={setConfirmPassword}
            helperText={confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : undefined}
            endAdornment={visibilityToggle}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={resetAndClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" disableElevation disabled={!canSubmit} onClick={handleSubmit}>
          Update password
        </Button>
      </DialogActions>
    </Dialog>
  );
}