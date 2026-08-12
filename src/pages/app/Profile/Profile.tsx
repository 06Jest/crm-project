
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Divider,
  Typography,
  Button,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Fade,
  Collapse,
  Slide,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { ProfileStatus } from "../../../types/profile";
import type { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../../store/profileSlice";
import ErrorAlert from "../../../components/Error";
import FormField from "./Formfield";
import { useNavigate } from "react-router-dom";

export interface ProfilePageProps {
  saving?: boolean;
  onAvatarUpload?: (file: File) => void;
  onAvatarRemove?: () => void;
}

const STATUS_STYLES: Record<
  ProfileStatus,
  { bg: string; color: string; label: string }
> = {
  active: {
    bg: "#ECFDF3",
    color: "#067647",
    label: "Active member",
  },
  pending: {
    bg: "#FFFAEB",
    color: "#B54708",
    label: "Pending",
  },
  inactive: {
    bg: "#F2F4F7",
    color: "#475467",
    label: "Inactive",
  },
  banned: {
    bg: "#FEF3F2",
    color: "#B42318",
    label: "Banned",
  },
  deleted: {
    bg: "#F2F4F7",
    color: "#475467",
    label: "Deleted",
  },
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

interface InfoRowProps {
  label: string;
  value?: string;
  trailing?: React.ReactNode;
}

function InfoRow({ label, value, trailing }: InfoRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 1,
        py: 1.5,
        px: 1,
        mx: -1,
        borderRadius: 2,
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: { sm: 180 } }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flex: 1,
          justifyContent: {
            xs: "flex-start",
            sm: "flex-end",
          },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>

        {trailing}
      </Box>
    </Box>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3, md: 4 },
        borderRadius: 3,
        borderColor: "divider",
        transition:
          "box-shadow 0.25s ease, border-color 0.25s ease",
        "&:hover": {
          borderColor: "grey.300",
          boxShadow: "0 2px 16px rgba(16, 24, 40, 0.06)",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mb: { xs: 2, sm: 2.5 },
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  );
}

function ProfileSkeleton() {
  return (
    <Box
      sx={{
        minHeight: "100%",
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 880,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2.5,
          }}
        >
          <Skeleton
            variant="rounded"
            width={132}
            height={38}
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              alignItems: {
                xs: "center",
                md: "flex-start",
              },
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ flex: 1, width: "100%" }}>
              <Skeleton
                variant="rounded"
                width={120}
                height={24}
                sx={{
                  my: 1.5,
                  borderRadius: 999,
                }}
              />
            </Box>
          </Box>
        </Paper>

        {[0, 1, 2].map((i) => (
          <Paper
            key={i}
            variant="outlined"
            sx={{
              mt: 3,
              p: { xs: 2.5, sm: 3, md: 4 },
              borderRadius: 3,
            }}
          >
            <Skeleton
              variant="text"
              width={170}
              height={28}
              sx={{ mb: 2 }}
            />

            <Skeleton
              variant="rounded"
              height={56}
              sx={{
                mb: 1.5,
                borderRadius: 1.5,
              }}
            />

            <Skeleton
              variant="rounded"
              height={56}
              sx={{ borderRadius: 1.5 }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default function Profile({
  saving = false,
}: ProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    profile,
    loading,
    loaded,
    error,
  } = useSelector((state: RootState) => state.profile);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    job_title: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    undefined
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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

  if (loading && !profile) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const fullName =
    `${form.first_name} ${form.last_name}`.trim();

  const initials = getInitials(
    form.first_name || "?",
    form.last_name || "?"
  );

  const statusStyle =
    STATUS_STYLES[profile.status ?? "pending"];

  const membership = profile.membership?.[0];

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
    !isDirty || isSaving || loading;

  const isBusy = isSaving || saving;

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: { xs: 3, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 880,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {error && (
          <Box sx={{ pb: 2 }}>
            <ErrorAlert message={error} />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            pb: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600 }}
            >
              Profile
            </Typography>

            <Collapse in={isDirty}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.25,
                }}
              >
                Unsaved changes
              </Typography>
            </Collapse>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={handleSave}
            disabled={saveDisabled}
            startIcon={
              isBusy ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : undefined
            }
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              borderRadius: 2,
              transition:
                "background-color 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {isBusy ? "Saving…" : "Save changes"}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={3}>
          <Fade in={!!profile} timeout={350}>
            <Paper
              variant="outlined"
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },
                borderRadius: 3,
                borderColor: "divider",
                transition:
                  "box-shadow 0.25s ease, border-color 0.25s ease",
                "&:hover": {
                  borderColor: "grey.300",
                  boxShadow:
                    "0 2px 16px rgba(16, 24, 40, 0.06)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  alignItems: {
                    xs: "center",
                    md: "flex-start",
                  },
                  textAlign: {
                    xs: "center",
                    md: "left",
                  },
                  gap: {
                    xs: 3,
                    md: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.25,
                    minWidth: {
                      md: 168,
                    },
                  }}
                >
                  <Avatar
                    src={avatarUrl}
                    imgProps={{
                      loading: "lazy",
                    }}
                    sx={{
                      width: {
                        xs: 80,
                        sm: 96,
                      },
                      height: {
                        xs: 80,
                        sm: 96,
                      },
                      fontSize: {
                        xs: 24,
                        sm: 28,
                      },
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {initials}
                  </Avatar>

                  <Stack
                    spacing={0.5}
                    sx={{
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled
                      size="small"
                      startIcon={
                        <CloudUploadOutlinedIcon fontSize="small" />
                      }
                      sx={{ px: 1 }}
                    >
                      Upload avatar
                    </Button>

                    <Chip
                      sx={{ opacity: 0.4 }}
                      label="Coming soon"
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                />

                <Divider
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                    width: "100%",
                  }}
                />

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
                    {fullName || "—"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.25 }}
                  >
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
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: statusStyle.color,
                        animation:
                          profile.status === "active"
                            ? "profileStatusPulse 2s ease-in-out infinite"
                            : "none",
                        "@keyframes profileStatusPulse": {
                          "0%": {
                            transform: "scale(1)",
                            opacity: 1,
                          },
                          "50%": {
                            transform: "scale(1.5)",
                            opacity: 0.45,
                          },
                          "100%": {
                            transform: "scale(1)",
                            opacity: 1,
                          },
                        },
                        "@media (prefers-reduced-motion: reduce)": {
                          animation: "none",
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: statusStyle.color,
                      }}
                    >
                      {statusStyle.label}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                  >
                    {profile.email}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Member since{" "}
                    {formatMemberSince(profile.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>

          <Fade in={!!profile} timeout={450}>
            <Box>
              <SectionCard title="Personal information">
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: {
                      xs: 2.5,
                      sm: 3,
                    },
                  }}
                >
                  <FormField
                    label="First name"
                    value={form.first_name}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        first_name: v,
                      }))
                    }
                  />

                  <FormField
                    label="Last name"
                    value={form.last_name}
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        last_name: v,
                      }))
                    }
                  />

                  <FormField
                    label="Display name"
                    value={form.display_name}
                    placeholder="John Doe"
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        display_name: v,
                      }))
                    }
                  />

                  <FormField
                    label="Position"
                    value={form.job_title}
                    placeholder="e.g. Sales Manager"
                    onChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        job_title: v,
                      }))
                    }
                  />
                </Box>

                {profile.membership?.[0].display_id && (
                  <>
                    <Divider sx={{ my: 2.5 }} />

                    <InfoRow
                      label="Employee ID"
                      value={
                        profile.membership?.[0].display_id
                      }
                    />
                  </>
                )}
              </SectionCard>
            </Box>
          </Fade>

          <Fade in={!!profile} timeout={550}>
            <Box>
              <SectionCard title="Workspace">
                <Stack divider={<Divider />}>
                  <InfoRow
                    label="Workspace"
                    value={membership?.org?.name}
                  />

                  <InfoRow
                    label="Organization type"
                    value={capitalize(
                      membership?.org?.type ?? ""
                    )}
                  />

                  <InfoRow
                    label="Role"
                    value={capitalize(
                      membership?.role ?? ""
                    )}
                  />

                  <InfoRow
                    label="Status"
                    value={capitalize(
                      profile.status ?? ""
                    )}
                  />

                  <InfoRow
                    label="Organization code"
                    value={
                      membership?.org?.display_id ?? ""
                    }
                  />
                </Stack>
              </SectionCard>
            </Box>
          </Fade>

          <Fade in={!!profile} timeout={650}>
            <Box>
              <SectionCard title="Account">
                <Stack divider={<Divider />}>
                  <InfoRow
                    label="Email address"
                    value={profile.email}
                  />

                  <InfoRow
                    label="Password"
                    trailing={
                      <Button
                        size="small"
                        endIcon={
                          <ChevronRightIcon fontSize="small" />
                        }
                        onClick={() =>
                          navigate("/forgot-password")
                        }
                      >
                        Change password
                      </Button>
                    }
                  />

                  <InfoRow
                    label="Last login"
                    value={formatTimestamp(
                      profile.last_login
                    )}
                  />

                  <InfoRow
                    label="Account created"
                    value={formatMemberSince(
                      profile.created_at
                    )}
                  />
                </Stack>
              </SectionCard>
            </Box>
          </Fade>
        </Stack>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        TransitionComponent={(props) => (
          <Slide {...props} direction="up" />
        )}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToast(null)}
          sx={{ borderRadius: 2 }}
        >
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}