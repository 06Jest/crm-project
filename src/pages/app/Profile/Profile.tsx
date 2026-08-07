

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Divider,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import type { PasswordChangeValues, ProfileFormValues, ProfileStatus } from "../../../types/profile";
import type { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../../store/profileSlice";
import ErrorAlert from "../../../components/Error";

export interface ProfilePageProps {
  saving?: boolean;
  onAvatarUpload?: (file: File) => void;
  onAvatarRemove?: () => void;
  onChangePassword?: (
    values: PasswordChangeValues
  ) => void;
}


const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#FAFBFC", paper: "#FFFFFF" },
    primary: { main: "#AD7450'", dark: "#775038" },
    text: { primary: "#101828", secondary: "#667085" },
    divider: "#E4E7EC",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h5: { fontWeight: 600, letterSpacing: -0.2 },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none", fontWeight: 600, borderRadius: 8 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
  },
});

const STATUS_STYLES: Record<ProfileStatus, { bg: string; color: string; label: string }> = {
  active: { bg: "#ECFDF3", color: "#067647", label: "Active member" },
  pending: { bg: "#FFFAEB", color: "#B54708", label: "Pending" },
  inactive: { bg: "#F2F4F7", color: "#475467", label: "Inactive" },
  banned: { bg: "#FEF3F2", color: "#B42318", label: "Banned" },
  deleted: { bg: "#F2F4F7", color: "#475467", label: "Deleted" },
};


function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMemberSince(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatTimestamp(isoDate?: string): string {
  if (!isoDate) return "Never";
  const date = new Date(isoDate);
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return `Today • ${time}`;
  const day = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  return `${day} • ${time}`;
}


interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FormField({ label, value, onChange, placeholder }: FormFieldProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="label"
        variant="body2"
        sx={{ display: "block", mb: 0.75, fontWeight: 500, color: "text.primary" }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  trailing?: React.ReactNode;
}

function InfoRow({ label, value, trailing }: InfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        sm: { alignItems: "center" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 1,
        py: 1.25,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, justifyContent: { xs: "flex-start", sm: "flex-end" } }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
        {trailing}
      </Box>
    </Box>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, borderColor: "divider" }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}


export default function ProfilePage({
  saving = false,
  onAvatarUpload,
  onAvatarRemove,
  onChangePassword,
}: ProfilePageProps) {
  const [form, setForm] = useState<ProfileFormValues>({
    first_name: "",
    last_name: "",
    display_name: "",
    job_title: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const {profile, loading, loaded,  error } = useSelector((state: RootState) => state.profile);
 const [avatarUrl, setAvatarUrl] =
    useState<string>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!profile) return;

    setForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        display_name: profile.display_name ?? "",
        job_title: profile.job_title ?? "",
    });

    setAvatarUrl(profile.avatar_url);

  }, [profile]);  

  useEffect(() => {

    if (!loaded && !loading) {
        dispatch(fetchProfile());
    }

  }, [dispatch, loaded, loading]);


  const baseline = useMemo(
    () => ({
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      display_name: profile?.display_name ?? "",
      job_title: profile?.job_title ?? "",
    }),
    [profile]
  );

  const isDirty =
    form.first_name !== baseline.first_name ||
    form.last_name !== baseline.last_name ||
    form.display_name !== baseline.display_name ||
    form.job_title !== baseline.job_title;

  useEffect(() => {
    return () => {
      if (avatarUrl && avatarFile) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
    // dsdsds
  }, [avatarUrl, avatarFile]);

  if (loading && !profile) {
    return <CircularProgress />;
  }

  if (!profile) {
    return null;
  }

  const fullName = `${form.first_name} ${form.last_name}`.trim();
  const initials = getInitials(form.first_name || "?", form.last_name || "?");
  const statusStyle = STATUS_STYLES[profile.status ?? 'pending'];

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setAvatarUrl(nextUrl);
    setAvatarFile(file);
    onAvatarUpload?.(file);
    e.target.value = "";
  };

  const handleAvatarRemove = () => {
    setAvatarUrl(undefined);
    setAvatarFile(null);
    onAvatarRemove?.();
  };

  const handleSave = async () => {
    try {
        setIsSaving(true);

        await dispatch(
            updateProfile({
                first_name: form.first_name,
                last_name: form.last_name,
                display_name: form.display_name,
                job_title: form.job_title,
            })
        ).unwrap();

        setToast("Profile updated.");
    } finally {
        setIsSaving(false);
    }
  };

  const saveDisabled =
    !isDirty ||
    isSaving ||
    loading;

  if (loading && !profile) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                mt: 8,
            }}
        >
            <CircularProgress />
        </Box>
    );
  }

  if (!profile) {
      return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100%", py: { xs: 3, md: 5 } }}>
        <Box sx={{ maxWidth: 880, mx: "auto", px: { xs: 2, md: 3 } }}>
          {error && (
            <Box sx={{ px: 2, pb: 1 }}>
              <ErrorAlert
                message={error}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pb: 2.5,
            }}
          >
            <Box>
              <Typography variant="h5">Profile</Typography>
              {isDirty && (
                <Typography variant="caption" color="text.secondary">
                  Unsaved changes
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saveDisabled}
            >
              {isSaving || saving ? "Saving…" : "Save changes"}
            </Button>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Stack spacing={3}>
            {/* Profile overview */}
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 3, md: 4 },
                }}
              >
                {/* Avatar column */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.25,
                    minWidth: { md: 168 },
                  }}
                >
                  <Box
                    component="label"
                    sx={{
                      position: "relative",
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "block",
                      "&:hover .avatar-overlay": { opacity: 1 },
                    }}
                  >
                    <Avatar
                      src={avatarUrl}
                      sx={{
                        width: 96,
                        height: 96,
                        fontSize: 28,
                        fontWeight: 600,
                        bgcolor: "primary.main",
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box
                      className="avatar-overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        bgcolor: "rgba(16,24,40,0.55)",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 150ms ease",
                      }}
                    >
                      <PhotoCameraOutlinedIcon fontSize="small" />
                    </Box>
                    <input
                      ref={fileInputRef}
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                    />
                  </Box>

                  <Stack spacing={0.5} sx={{ width: "100%", alignItems: "center" }}>
                    <Button
                      size="small"
                      component="label"
                      startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                      sx={{ px: 1.5 }}
                    >
                      Upload avatar
                      <input hidden type="file" accept="image/*" onChange={handleAvatarSelect} />
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={handleAvatarRemove}
                      disabled={!avatarUrl}
                      sx={{ px: 1.5 }}
                    >
                      Remove avatar
                    </Button>
                  </Stack>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" } }} />
                <Divider sx={{ display: { xs: "block", md: "none" } }} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {fullName || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {form.job_title || "No title set"}
                  </Typography>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      mt: 1.5,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: statusStyle.bg,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: statusStyle.color }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: statusStyle.color }}>
                      {statusStyle.label}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {profile.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Member since {formatMemberSince(profile.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>


            <SectionCard title="Personal information">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <FormField
                  label="First name"
                  value={form.first_name}
                  onChange={(v) => setForm((f) => ({ ...f, first_name: v }))}
                />
                <FormField
                  label="Last name"
                  value={form.last_name}
                  onChange={(v) => setForm((f) => ({ ...f, last_name: v }))}
                />
                <FormField
                  label="Display name"
                  value={form.display_name}
                  placeholder="How your name appears to teammates"
                  onChange={(v) => setForm((f) => ({ ...f, display_name: v }))}
                />
                <FormField
                  label="Position"
                  value={form.job_title}
                  placeholder="e.g. Sales Manager"
                  onChange={(v) => setForm((f) => ({ ...f, job_title: v }))}
                />
              </Box>

              {profile.display_id && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <InfoRow
                    label="Employee ID"
                    value={profile.display_id}
                    trailing={<Chip label="Read only" size="small" variant="outlined" />}
                  />
                </>
              )}
            </SectionCard>

            <SectionCard title="Workspace">
              <Stack divider={<Divider />}>
                <InfoRow label="Workspace" value={profile.org.name} />
                <InfoRow label="Organization type" value={capitalize(profile.org.type)} />
                <InfoRow
                      label="Role"
                      value={capitalize(profile.membership.role)}
                  />

                  <InfoRow
                      label="Status"
                      value={capitalize(profile.status)}
                  />
                <InfoRow label="Organization code" value={profile.org.display_id} />
              </Stack>
            </SectionCard>

            <SectionCard title="Account">
              <Stack divider={<Divider />}>
                <InfoRow
                  label="Email address"
                  value={profile.email}
                  trailing={<Chip label="Read only" size="small" variant="outlined" />}
                />
                <InfoRow
                  label="Password"
                  value="••••••••••"
                  trailing={
                    <Button
                      size="small"
                      endIcon={<ChevronRightIcon fontSize="small" />}
                      onClick={() => setPasswordOpen(true)}
                    >
                      Change password
                    </Button>
                  }
                />
                <InfoRow label="Last login" value={formatTimestamp(profile.last_login)} />
                <InfoRow label="Account created" value={formatMemberSince(profile.created_at)} />
              </Stack>
            </SectionCard>
          </Stack>
        </Box>
      </Box>

      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSubmit={(values) => {
          onChangePassword?.(values);
          setPasswordOpen(false);
          setToast("Password updated successfully.");
        }}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast(null)}>
          {toast}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}


interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: PasswordChangeValues) => void;
}

function ChangePasswordDialog({ open, onClose, onSubmit }: ChangePasswordDialogProps) {
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

  return (
    <Dialog open={open} onClose={resetAndClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Change password</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <FormField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <Box>
            <Typography variant="body2" sx={{ display: "block", mb: 0.75, fontWeight: 500 }}>
              New password
            </Typography>
            <TextField
              fullWidth
              type={fieldType}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Must be at least 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPasswords((s) => !s)}
                      edge="end"
                      aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
                    >
                      {showPasswords ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <FormField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={resetAndClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => onSubmit({ currentPassword, newPassword })}
        >
          Update password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
