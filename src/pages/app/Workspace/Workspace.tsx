import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import type { GridColDef } from "@mui/x-data-grid";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip, { type ChipProps } from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Slide, { type SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";
import ToggleOffRoundedIcon from "@mui/icons-material/ToggleOffRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

import type { AppDispatch, RootState } from "../../../store/store";
import { fetchWorkspace, updateWorkspaceDetails } from "../../../store/organizationSlice";
import {
  fetchOrgMembers,
  updateMemberRole,
  updateMemberStatus,
  removeOrgMember,
} from "../../../store/organizationMemberSlice";
import {
  fetchOrgInvites,
  createOrganizationInvite,
  revokeOrganizationInvite,
} from "../../../store/organizationInviteSlice";

import type { Roles } from "../../../types/global";
import type {
  DisplayOrganization,
  UpdateWorkspaceDetailsDTO,
} from "../../../types/organization";
import type {
  DisplayOrganizationMember,
  OrganizationMemberStatus,
} from "../../../types/organization.member";
import type { OrganizationInvite } from "../../../types/organization.invite";
import { useAuth } from "../../../hooks/useAuth";
import { PLAN_LIMITS, type MemberLimits } from "../../../types/subscription";
import ErrorAlert from "../../../components/Error";
import { approveJoinMemberAPI, rejectJoinMemberAPI } from "../../../services/orgInviteService";

const DataGrid = lazy(() =>
  import("@mui/x-data-grid").then((mod) => ({
    default: mod.DataGrid,
  }))
) as typeof import("@mui/x-data-grid").DataGrid;


const canManageMembers = (role?: Roles | null): boolean =>
  role === "owner" || role === "manager";

const canEditWorkspaceDetails = (role?: Roles | null): boolean =>
  role === "owner" || role === "manager";

const canManageSubscription = (role?: Roles | null): boolean =>
  role === "owner";

const nextRoleFor = (
  currentUserRole: Roles | null | undefined,
  targetRole: Roles
): Roles | null => {
  if (targetRole === "owner") return null;

  if (currentUserRole === "owner") {
    return targetRole === "agent" ? "manager" : "agent";
  }

  if (currentUserRole === "manager" && targetRole === "agent") {
    return "manager";
  }

  return null;
};

const canChangeRole = (
  currentUserRole: Roles | null | undefined,
  targetRole: Roles,
  isSelf: boolean
): boolean => !isSelf && nextRoleFor(currentUserRole, targetRole) !== null;

const canChangeStatus = (
  currentUserRole: Roles | null | undefined,
  targetRole: Roles,
  isSelf: boolean
): boolean => {
  if (isSelf) return false;
  if (targetRole === "owner") return false;
  if (currentUserRole === "owner") return true;
  if (currentUserRole === "manager") return targetRole === "agent";
  return false;
};

const canRemoveMember = (
  currentUserRole: Roles | null | undefined,
  targetRole: Roles,
  isSelf: boolean
): boolean => {
  if (isSelf) return false;
  if (!canManageMembers(currentUserRole)) return false;
  if (targetRole === "owner") return false;
  if (currentUserRole === "manager" && targetRole === "manager") return false;
  return true;
};

const canManageInvites = (role?: Roles | null): boolean =>
  canManageMembers(role);


const formatDate = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const initialsFromName = (name?: string | null): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const humanize = (value?: string | null): string => {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const toNullableInput = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

type ChipColor = ChipProps["color"];

const PLAN_COLOR: Record<string, ChipColor> = {
  free: "default",
  starter: "info",
  team: "primary",
  business: "secondary",
  enterprise: "success",
};

const planChipColor = (plan?: string | null): ChipColor =>
  (plan && PLAN_COLOR[plan.toLowerCase()]) || "default";

const SUBSCRIPTION_STATUS_COLOR: Record<string, ChipColor> = {
  active: "success",
  cancelled: "default",
  canceled: "default",
  expired: "error",
  past_due: "warning",
};

const subscriptionStatusChipColor = (status?: string | null): ChipColor =>
  (status && SUBSCRIPTION_STATUS_COLOR[status.toLowerCase()]) || "default";

const ROLE_COLOR: Record<Roles, ChipColor> = {
  owner: "primary",
  manager: "success",
  agent: "default",
};

const roleChipColor = (role: Roles): ChipColor => ROLE_COLOR[role];

const MEMBER_STATUS_COLOR: Record<OrganizationMemberStatus, ChipColor> = {
  invited: "default",
  active: "success",
  suspended: "warning",
  removed: "error",
};

const memberStatusChipColor = (status: OrganizationMemberStatus): ChipColor =>
  MEMBER_STATUS_COLOR[status];

const INVITE_STATUS_COLOR: Record<OrganizationInvite["status"], ChipColor> = {
  active: "warning",
  completed: "success",
  expired: "default",
  revoked: "error",
};

// ---------------------------------------------------------------------------
// UI-only presentation helpers (styling constants, no data or business logic)
// ---------------------------------------------------------------------------

/** Staggered fade + rise entrance used on each top-level section. */
const fadeInSx = (delayMs = 0) => ({
  animation: "fadeSlideIn 0.5s ease both",
  animationDelay: `${delayMs}ms`,
  "@keyframes fadeSlideIn": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

/** Subtle hover lift for compact, clickable summary cards. */
const hoverLiftSx = {
  transition: "box-shadow 0.25s ease, transform 0.25s ease",
  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
};

/** Consistent, calm button styling used across the page. */
const actionButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  borderRadius: 2,
};

/** Small hover affordance for icon-only buttons. */
const iconHoverSx = {
  transition: "transform 0.15s ease, background-color 0.15s ease",
  "&:hover": { transform: "scale(1.08)" },
};

/** Consistent slide-up transition for every toast in the page. */
function SlideUpTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface FieldRowProps {
  label: string;
  value?: ReactNode;
}

const FieldRow = ({ label, value }: FieldRowProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "140px 1fr" },
      columnGap: 2,
      rowGap: 0.25,
      py: 1,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
      {value || value === 0 ? value : "—"}
    </Typography>
  </Box>
);

interface EditFieldRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  multiline?: boolean;
}

const EditFieldRow = ({
  label,
  value,
  onChange,
  disabled,
  required,
  error,
  helperText,
  multiline,
}: EditFieldRowProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "140px 1fr" },
      columnGap: 2,
      alignItems: multiline ? "flex-start" : "center",
      py: 1,
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ pt: multiline ? 2 : 0 }}
    >
      {label}
    </Typography>
    <TextField
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      error={error}
      helperText={helperText}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
    />
  </Box>
);


interface OrganizationOverviewCardProps {
  organization: DisplayOrganization | null;
  loading: boolean;
  updating: boolean;
  currentUserRole?: Roles;
}

interface WorkspaceDraft {
  name: string;
  industry: string;
  company_size: string;
  product_type: string;
  website: string;
  description: string;
}

const draftFromOrganization = (
  organization: DisplayOrganization | null
): WorkspaceDraft => ({
  name: organization?.name ?? "",
  industry: organization?.industry ?? "",
  company_size: organization?.company_size ?? "",
  product_type: organization?.product_type ?? "",
  website: organization?.website ?? "",
  description: organization?.description ?? "",
});

function OrganizationOverviewCard({
  organization,
  loading,
  updating,
  currentUserRole,
}: OrganizationOverviewCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const canEdit = canEditWorkspaceDetails(currentUserRole);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<WorkspaceDraft>(() =>
    draftFromOrganization(organization)
  );
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const initials = useMemo(
    () => initialsFromName(organization?.name),
    [organization?.name]
  );

  const nameError = editing && draft.name.trim().length === 0;

  const startEditing = () => {
    console.log(organization)
    setDraft(draftFromOrganization(organization));
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(draftFromOrganization(organization));
    setEditing(false);
  };

  const setField =
    (field: keyof WorkspaceDraft) => (value: string) =>
      setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (nameError) return;

    const updates: UpdateWorkspaceDetailsDTO = {
      name: draft.name.trim(),
      industry: toNullableInput(draft.industry),
      company_size: toNullableInput(draft.company_size),
      product_type: toNullableInput(draft.product_type),
      website: toNullableInput(draft.website),
      description: toNullableInput(draft.description),
    };

    try {
      await dispatch(updateWorkspaceDetails(updates)).unwrap();
      setSnackbar({ message: "Workspace details updated", severity: "success" });
      setEditing(false);
    } catch (err) {
      setSnackbar({
        message: typeof err === "string" ? err : "Failed to update workspace details",
        severity: "error",
      });
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ...hoverLiftSx,
        ...fadeInSx(0),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.2 }}>
          Organization Overview
        </Typography>

        {organization && canEdit && !editing && (
          <Tooltip title="Edit workspace details">
            <IconButton
              size="small"
              onClick={startEditing}
              aria-label="Edit workspace details"
              sx={iconHoverSx}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {loading && !organization ? (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={56} height={56} animation="wave" />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={28} animation="wave" />
              <Skeleton variant="text" width="30%" animation="wave" />
            </Box>
          </Stack>
          <Skeleton variant="rounded" height={180} animation="wave" />
        </Stack>
      ) : !organization ? (
        <Typography variant="body2" color="text.secondary">
          No organization data available.
        </Typography>
      ) : (
        <>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={organization.logo_url || undefined}
              alt={organization.name}
              imgProps={{ loading: "lazy" }}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontWeight: 600,
                fontSize: 18,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.04)" },
              }}
            >
              {!organization.logo_url && initials}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {editing ? draft.name || organization.name : organization.name}
              </Typography>
              <Chip
                size="small"
                variant="outlined"
                label={organization.display_id}
                sx={{ mt: 0.5, fontFamily: "monospace" }}
              />
            </Box>
          </Stack>

          <Divider />

          {editing ? (
            <Box>
              <EditFieldRow
                label="Name"
                value={draft.name}
                onChange={setField("name")}
                disabled={updating}
                required
                error={nameError}
                helperText={nameError ? "Workspace name is required" : undefined}
              />
              <FieldRow label="Type" value={humanize(organization.type)} />
              <EditFieldRow
                label="Industry"
                value={draft.industry}
                onChange={setField("industry")}
                disabled={updating}
              />
              <EditFieldRow
                label="Product / Service"
                value={draft.product_type}
                onChange={setField("product_type")}
                disabled={updating}
              />
              <EditFieldRow
                label="Company Size"
                value={draft.company_size}
                onChange={setField("company_size")}
                disabled={updating}
              />
              <EditFieldRow
                label="Website"
                value={draft.website}
                onChange={setField("website")}
                disabled={updating}
              />
              <EditFieldRow
                label="Description"
                value={draft.description}
                onChange={setField("description")}
                disabled={updating}
                multiline
              />

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Button onClick={cancelEditing} disabled={updating} sx={actionButtonSx}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleSave}
                  disabled={updating || nameError}
                  startIcon={updating ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={actionButtonSx}
                >
                  {updating ? "Saving…" : "Save"}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box>
              <FieldRow label="Type" value={humanize(organization.type)} />
              <FieldRow label="Industry" value={organization.industry} />
              <FieldRow label="Product / Service" value={organization.product_type} />
              <FieldRow label="Company Size" value={organization.company_size} />
              <FieldRow
                label="Website"
                value={
                  organization.website ? (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      component="a"
                      href={
                        organization.website.startsWith("http")
                          ? organization.website
                          : `https://${organization.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        transition: "opacity 0.15s ease",
                        "&:hover": { textDecoration: "underline", opacity: 0.85 },
                      }}
                    >
                      <LanguageRoundedIcon sx={{ fontSize: 16 }} />
                      <span>{organization.website}</span>
                    </Stack>
                  ) : undefined
                }
              />
              <FieldRow label="Created" value={formatDate(organization.created_at)} />
            </Box>
          )}

          {!editing && organization.description && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {organization.description}
                </Typography>
              </Box>
            </>
          )}

          {!editing && !canEdit && (
            <Typography variant="caption" color="text.secondary">
              Only owners and managers can edit workspace details.
            </Typography>
          )}
        </>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      >
        {snackbar ? (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Paper>
  );
}


interface SubscriptionCardProps {
  subscription: DisplayOrganization["subscription"] | undefined;
  loading: boolean;
  currentUserRole?: Roles;
}

function SubscriptionCard({ subscription, loading, currentUserRole }: SubscriptionCardProps) {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const canManage = canManageSubscription(currentUserRole);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ...hoverLiftSx,
        ...fadeInSx(60),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.2 }}>
          Subscription
        </Typography>
        {subscription && (
          <Chip
            label={humanize(subscription.plan)}
            color={planChipColor(subscription.plan)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Stack>

      {loading && !subscription ? (
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={32} width="40%" animation="wave" />
          <Skeleton variant="rounded" height={220} animation="wave" />
        </Stack>
      ) : !subscription ? (
        <Typography variant="body2" color="text.secondary">
          No active subscription found for this workspace.
        </Typography>
      ) : (
        <>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Chip
              label={humanize(subscription.status)}
              color={subscriptionStatusChipColor(subscription.status)}
              size="small"
              variant="outlined"
            />
            <Chip
              label={subscription.cancel_at_period_end ? "Auto-renew off" : "Auto-renew on"}
              size="small"
              variant="outlined"
              color={subscription.cancel_at_period_end ? "warning" : "success"}
            />
          </Stack>

          <Divider />

          <Box>
            <FieldRow label="Billing Cycle" value={humanize(subscription.billing_cycle)} />
            <FieldRow label="Payment Provider" value={humanize(subscription.payment_provider)} />
            <FieldRow
              label="Provider Ref"
              value={
                subscription.provider_reference ? (
                  <Box
                    component="span"
                    sx={{ fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}
                  >
                    {subscription.provider_reference}
                  </Box>
                ) : undefined
              }
            />
            <FieldRow
              label="Current Period"
              value={`${formatDate(subscription.current_period_start)} – ${formatDate(
                subscription.current_period_end
              )}`}
            />
            <FieldRow
              label={subscription.cancel_at_period_end ? "Cancels On" : "Renews On"}
              value={formatDate(subscription.current_period_end)}
            />
            <FieldRow label="Subscribed Since" value={formatDate(subscription.created_at)} />
          </Box>
        </>
      )}

      <Box sx={{ mt: "auto", pt: 1 }}>
        {canManage ? (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setComingSoonOpen(true)}
            sx={actionButtonSx}
          >
            Upgrade Plan
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Only the workspace owner can manage the subscription.
          </Typography>
        )}
      </Box>

      <Snackbar
        open={comingSoonOpen}
        autoHideDuration={2500}
        onClose={() => setComingSoonOpen(false)}
        message="Coming soon"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      />
    </Paper>
  );
}

function PendingJoinRequestsSection({
  currentUserRole,
}: {
  currentUserRole?: Roles;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { items } = useSelector(
    (state: RootState) => state.orgmembers
  );

  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] =
    useState<DisplayOrganizationMember | null>(null);

  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const allowed = canManageMembers(currentUserRole);

  const pendingMembers = useMemo(
    () => items.filter((member) => member.status === "invited"),
    [items]
  );

  if (!allowed || pendingMembers.length === 0) {
    return null;
  }

  const handleApprove = async (member: DisplayOrganizationMember) => {
  setPendingMemberId(member.id);

  try {
    await approveJoinMemberAPI(member.id);

    setSnackbar({
      message: "Join request approved",
      severity: "success",
    });

    await dispatch(fetchOrgMembers()).unwrap();
  } catch (err) {
    setSnackbar({
      message:
        typeof err === "string"
          ? err
          : "Failed to approve join request",
      severity: "error",
    });
  } finally {
    setPendingMemberId(null);
  }
};

const handleReject = async () => {
  if (!rejectTarget) return;

  setPendingMemberId(rejectTarget.id);

  try {
    await rejectJoinMemberAPI(rejectTarget.id);

    setSnackbar({
      message: "Join request rejected",
      severity: "success",
    });

    await dispatch(fetchOrgMembers()).unwrap();
  } catch (err) {
    setSnackbar({
      message:
        typeof err === "string"
          ? err
          : "Failed to reject join request",
      severity: "error",
    });
  } finally {
    setPendingMemberId(null);
    setRejectTarget(null);
  }
};


  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          borderRadius: 3,
          borderColor: "divider",
          overflow: "hidden",
          ...fadeInSx(120),
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, letterSpacing: 0.2 }}
          >
            Pending Join Requests
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            People who accepted an invitation and are waiting
            for approval.
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={0}>
          {pendingMembers.map((member) => {
            const profile = member.profile;

            const fullName =
              `${profile?.first_name ?? ""} ${
                profile?.last_name ?? ""
              }`.trim() || "Unknown User";

            const isPending =
              pendingMemberId === member.id;

            return (
              <Box
                key={member.id}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  justifyContent="space-between"
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Avatar
                      src={
                        profile?.avatar_url ??
                        undefined
                      }
                      imgProps={{ loading: "lazy" }}
                    >
                      {!profile?.avatar_url &&
                        initialsFromName(fullName)}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {fullName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {profile?.email ?? "No email"}
                      </Typography>
                    </Box>

                    <Chip
                      label={member.role}
                      size="small"
                      color={roleChipColor(member.role)}
                      sx={{
                        textTransform: "capitalize",
                      }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      disableElevation
                      disabled={isPending}
                      onClick={() =>
                        handleApprove(member)
                      }
                      startIcon={
                        isPending ? (
                          <CircularProgress
                            size={15}
                            color="inherit"
                          />
                        ) : undefined
                      }
                      sx={actionButtonSx}
                    >
                      {isPending
                        ? "Approving…"
                        : "Approve"}
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      disabled={isPending}
                      onClick={() =>
                        setRejectTarget(member)
                      }
                      sx={actionButtonSx}
                    >
                      Reject
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Dialog
        open={!!rejectTarget}
        onClose={() => {
          if (!pendingMemberId) {
            setRejectTarget(null);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Reject join request?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {rejectTarget &&
              `${rejectTarget.profile?.first_name ?? ""} ${
                rejectTarget.profile?.last_name ?? ""
              } will be removed from the pending join requests.`}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setRejectTarget(null)}
            disabled={!!pendingMemberId}
            sx={actionButtonSx}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={handleReject}
            disabled={!!pendingMemberId}
            sx={actionButtonSx}
          >
            {pendingMemberId
              ? "Rejecting…"
              : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      >
        {snackbar ? (
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() => setSnackbar(null)}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}

interface TeamMembersSectionProps {
  currentUserId?: string;
  currentUserRole?: Roles;
  onInviteClick?: () => void;
}

function TeamMembersSection({
  currentUserId,
  currentUserRole,
  onInviteClick,
}: TeamMembersSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, loaded, error } = useSelector(
    (state: RootState) => state.orgmembers
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeMember, setActiveMember] =
    useState<DisplayOrganizationMember | null>(null);
  const [removeTarget, setRemoveTarget] =
    useState<DisplayOrganizationMember | null>(null);

  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    member: DisplayOrganizationMember;
    newRole: Roles;
  } | null>(null);
  // Tracks the member currently being mutated so its row's action button
  // can be disabled — prevents double-submitting a role/status/removal
  // request while the previous one is still in flight.
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchOrgMembers());
    }
  }, [dispatch, loaded, loading]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((member) => {
      const fullName =
        `${member.profile.first_name} ${member.profile.last_name}`.toLowerCase();
      return (
        fullName.includes(term) ||
        member.profile.email.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const openMenu = (
    event: MouseEvent<HTMLElement>,
    member: DisplayOrganizationMember
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveMember(member);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setActiveMember(null);
  };

  const requestRoleChange = (member: DisplayOrganizationMember) => {
    const newRole = nextRoleFor(currentUserRole, member.role);
    closeMenu();
    if (!newRole) return;
    setRoleChangeTarget({ member, newRole });
  };

  const handleRoleChangeConfirm = async () => {
    if (!roleChangeTarget) return;
    const { member, newRole } = roleChangeTarget;

    setPendingMemberId(member.id);
    try {
      await dispatch(updateMemberRole({ id: member.id, role: newRole })).unwrap();
      setSnackbar({ message: "Member role updated", severity: "success" });
    } catch (err) {
      setSnackbar({
        message: typeof err === "string" ? err : "Failed to update role",
        severity: "error",
      });
    } finally {
      setPendingMemberId(null);
      setRoleChangeTarget(null);
    }
  };


  const handleStatusChange = async (
    member: DisplayOrganizationMember,
    status: OrganizationMemberStatus
  ) => {
    closeMenu();
    setPendingMemberId(member.id);

    try {
      await dispatch(
        updateMemberStatus({
          id: member.id,
          status,
        })
      ).unwrap();

      setSnackbar({
        message: "Member status updated",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        message:
          typeof err === "string"
            ? err
            : "Failed to update status",
        severity: "error",
      });
    } finally {
      setPendingMemberId(null);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    setPendingMemberId(removeTarget.id);
    try {
      await dispatch(removeOrgMember(removeTarget.id)).unwrap();
      setSnackbar({ message: "Member removed", severity: "success" });
    } catch (err) {
      setSnackbar({
        message: typeof err === "string" ? err : "Failed to remove member",
        severity: "error",
      });
    } finally {
      setPendingMemberId(null);
      setRemoveTarget(null);
    }
  };

  const columns: GridColDef<DisplayOrganizationMember>[] = useMemo(
  () => [
    {
      field: "display_id",
      headerName: "ID",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Chip
          size="small"
          variant="outlined"
          label={params.row.display_id}
          sx={{
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        const profile = params.row.profile;

        if (!profile) {
          return (
            <Typography variant="body2">
              Unknown User
            </Typography>
          );
        }

        const fullName =
          `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                height: 30,
                width: 30,
                fontSize: 15,
              }}
              src={profile.avatar_url ?? undefined}
              imgProps={{ loading: "lazy" }}
            >
              {!profile.avatar_url && initialsFromName(fullName)}
            </Avatar>

            <Typography>
              {fullName || "Unknown"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 150,
      sortable: false,
      valueGetter: (_, row) => row.profile?.email ?? "—",
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.row.role}
          size="small"
          color={roleChipColor(params.row.role)}
          sx={{
            textTransform: "capitalize",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          variant="outlined"
          color={memberStatusChipColor(params.row.status)}
          sx={{
            textTransform: "capitalize",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Joined",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            height: 40,
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            {formatDate(params.row.created_at)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 20,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const member = params.row;

        const isSelf =
          !!currentUserId &&
          member.profile_id === currentUserId;

        const hasAnyAction =
          canChangeRole(
            currentUserRole,
            member.role,
            isSelf
          ) ||
          canChangeStatus(
            currentUserRole,
            member.role,
            isSelf
          ) ||
          canRemoveMember(
            currentUserRole,
            member.role,
            isSelf
          );

        return (
          <IconButton
            size="small"
            disabled={
              !hasAnyAction ||
              pendingMemberId === member.id
            }
            onClick={(e) => openMenu(e, member)}
            aria-label="Member actions"
            sx={iconHoverSx}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ],
  [
    currentUserId,
    currentUserRole,
    pendingMemberId,
  ]
);

  const isSelfActive =
    !!activeMember && !!currentUserId && activeMember.profile_id === currentUserId;

  const activeMemberNextRole =
    activeMember ? nextRoleFor(currentUserRole, activeMember.role) : null;

    const nextStatus =
  activeMember?.status === "active"
    ? "suspended"
    : activeMember?.status === "suspended"
      ? "active"
      : null;

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 3, borderColor: "divider", overflow: "hidden", ...fadeInSx(180) }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.2 }}>
            Team Members
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <TextField
              size="small"
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 260 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Box>

      <Divider />

      {error && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          {error}
        </Alert>
      )}

      {isMobile ? (

        <Stack spacing={1.5} sx={{ p: 2 }}>
          {loading && filteredRows.length === 0 ? (
            <>
              <Skeleton variant="rounded" height={92} animation="wave" />
              <Skeleton variant="rounded" height={92} animation="wave" />
              <Skeleton variant="rounded" height={92} animation="wave" />
            </>
          ) : filteredRows.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1.5}
              sx={{ py: 5, color: "text.secondary" }}
            >
              <Typography variant="body2">
                {search ? "No members match your search." : "No team members yet."}
              </Typography>
              {!search && canManageMembers(currentUserRole) && onInviteClick && (
                <Button
                  size="small"
                  startIcon={<PersonAddAltRoundedIcon fontSize="small" />}
                  onClick={onInviteClick}
                  sx={actionButtonSx}
                >
                  Invite members
                </Button>
              )}
            </Stack>
          ) : (
            filteredRows.map((member) => {
              const profile = member.profile;
              const fullName = profile
                ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                : "";
              const isSelf = !!currentUserId && member.profile_id === currentUserId;
              const hasAnyAction =
                canChangeRole(currentUserRole, member.role, isSelf) ||
                canChangeStatus(currentUserRole, member.role, isSelf) ||
                canRemoveMember(currentUserRole, member.role, isSelf);

              return (
                <Box
                  key={member.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar
                      sx={{ width: 40, height: 40, fontSize: 15, flexShrink: 0 }}
                      src={profile?.avatar_url ?? undefined}
                      imgProps={{ loading: "lazy" }}
                    >
                      {!profile?.avatar_url && initialsFromName(fullName)}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {fullName || "Unknown User"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: "block" }}
                      >
                        {profile?.email ?? "—"}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                        <Chip
                          label={member.role}
                          size="small"
                          color={roleChipColor(member.role)}
                          sx={{ textTransform: "capitalize", fontWeight: 500 }}
                        />
                        <Chip
                          label={member.status}
                          size="small"
                          variant="outlined"
                          color={memberStatusChipColor(member.status)}
                          sx={{ textTransform: "capitalize", fontWeight: 500 }}
                        />
                      </Stack>

                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Joined {formatDate(member.created_at)}
                      </Typography>
                    </Box>

                    <IconButton
                      size="small"
                      disabled={!hasAnyAction || pendingMemberId === member.id}
                      onClick={(e) => openMenu(e, member)}
                      aria-label="Member actions"
                      sx={{ ...iconHoverSx, flexShrink: 0 }}
                    >
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })
          )}
        </Stack>
      ) : (
        <Box sx={{ height: 480 }}>
          <Suspense
            fallback={
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
              />
            }
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              rowHeight={40}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[10, 25, 50]}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "grey.50",
                  borderRadius: 0,
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
                "& .MuiDataGrid-row": {
                  transition: "background-color 0.15s ease",
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1.5}
                    sx={{ height: "100%", color: "text.secondary" }}
                  >
                    <Typography variant="body2">
                      {search ? "No members match your search." : "No team members yet."}
                    </Typography>
                    {!search && canManageMembers(currentUserRole) && onInviteClick && (
                      <Button
                        size="small"
                        startIcon={<PersonAddAltRoundedIcon fontSize="small" />}
                        onClick={onInviteClick}
                        sx={actionButtonSx}
                      >
                        Invite members
                      </Button>
                    )}
                  </Stack>
                ),
              }}
            />
          </Suspense>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        transitionDuration={150}
        PaperProps={{ sx: { borderRadius: 2, mt: 0.5, minWidth: 200 } }}
      >
        {activeMember && activeMemberNextRole && (
          <MenuItem
            onClick={() => requestRoleChange(activeMember)}
            sx={{ borderRadius: 1, mx: 0.5, my: 0.25 }}
          >
            <ListItemIcon>
              {activeMemberNextRole === "manager" ? (
                <ArrowUpwardRoundedIcon fontSize="small" />
              ) : (
                <ArrowDownwardRoundedIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {activeMemberNextRole === "manager" ? "Promote to Manager" : "Demote to Agent"}
            </ListItemText>
          </MenuItem>
        )}

        {activeMember &&
  canChangeStatus(
    currentUserRole,
    activeMember.role,
    isSelfActive
  ) &&
  nextStatus && (
    <MenuItem
      onClick={() =>
        handleStatusChange(activeMember, nextStatus)
      }
      sx={{ borderRadius: 1, mx: 0.5, my: 0.25 }}
    >
      <ListItemIcon>
        {nextStatus === "suspended" ? (
          <ToggleOffRoundedIcon fontSize="small" />
        ) : (
          <ToggleOnRoundedIcon fontSize="small" />
        )}
      </ListItemIcon>

      <ListItemText>
        {nextStatus === "suspended"
          ? "Suspend"
          : "Activate"}
      </ListItemText>
    </MenuItem>
  )}

        {activeMember &&
          canRemoveMember(currentUserRole, activeMember.role, isSelfActive) && (
            <Tooltip title="Coming Soon" placement="left">
              <span>
                <MenuItem
                  disabled
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.25,
                    cursor: "not-allowed",
                    "&.Mui-disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  <ListItemIcon>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </ListItemIcon>

                  <ListItemText primary="Remove Member" />
                </MenuItem>
              </span>
            </Tooltip>
          )}
      </Menu>

      <Dialog
        open={!!roleChangeTarget}
        onClose={() => setRoleChangeTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Change member role?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {roleChangeTarget &&
              `${roleChangeTarget.member.profile.first_name} ${roleChangeTarget.member.profile.last_name} will become a${
                roleChangeTarget.newRole === "agent" ? "n" : ""
              } ${roleChangeTarget.newRole}. This changes what they can see and do in this workspace immediately.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRoleChangeTarget(null)}
            disabled={!!pendingMemberId}
            sx={actionButtonSx}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleRoleChangeConfirm}
            disabled={!!pendingMemberId}
            startIcon={pendingMemberId ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={actionButtonSx}
          >
            {pendingMemberId ? "Updating…" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Remove member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {removeTarget &&
              `${removeTarget.profile.first_name} ${removeTarget.profile.last_name} will lose access to this workspace immediately. This can't be undone from here.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRemoveTarget(null)}
            disabled={!!pendingMemberId}
            sx={actionButtonSx}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={handleRemoveConfirm}
            disabled={!!pendingMemberId}
            startIcon={pendingMemberId ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={actionButtonSx}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      >
        {snackbar ? (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Paper>
  );
}

interface InviteMembersSectionProps {
  currentUserRole?: Roles;
  memberLimits: MemberLimits | null;
  activeMemberCount: number;
  totalMemberCount: number;
}

const MAX_USES_OPTIONS = [1, 5, 10, 25, 50];
const EXPIRES_OPTIONS = [
  { label: "1 Day", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
];

const INVITE_ROLES: Roles[] = ["manager", "agent"];


function InviteAcceptances({ invite }: { invite: OrganizationInvite }) {
  const acceptances = invite.acceptances ?? [];
  if (acceptances.length === 0) return null;

  return (
    <Tooltip
      title={acceptances
        .map((a) =>
          a.profile ? `${a.profile.first_name} ${a.profile.last_name}` : "Unknown user"
        )
        .join(", ")}
    >
      <Stack direction="row" spacing={0.75} alignItems="center">
        <AvatarGroup
          max={4}
          sx={{ "& .MuiAvatar-root": { width: 22, height: 22, fontSize: 11 } }}
        >
          {acceptances.map((a) => (
            <Avatar key={a.id} src={a.profile?.avatar_url ?? undefined} imgProps={{ loading: "lazy" }}>
              {!a.profile?.avatar_url &&
                initialsFromName(
                  a.profile ? `${a.profile.first_name} ${a.profile.last_name}` : undefined
                )}
            </Avatar>
          ))}
        </AvatarGroup>
        <Typography variant="caption" color="text.secondary">
          Accepted by {acceptances.length}
        </Typography>
      </Stack>
    </Tooltip>
  );
}

function InviteMembersSection({
  currentUserRole,
  memberLimits,
  activeMemberCount,
  totalMemberCount,
}: InviteMembersSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { invites, loading, creating, revoking, error } = useSelector(
    (state: RootState) => state.orginvites
  );

  const allowed = canManageInvites(currentUserRole);
  const hasFetched = useRef(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Roles>("agent");
  const [maxUses, setMaxUses] = useState(10);
  const [expiresDays, setExpiresDays] = useState(7);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (allowed && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchOrgInvites());
    }
  }, [allowed, dispatch]);

  const activeMembersReached =
  activeMemberCount >= (memberLimits?.active_limit ?? Infinity);

  const memberStorageReached =
    totalMemberCount >= (memberLimits?.store_limit ?? Infinity);

  const memberLimitReached =
  activeMembersReached || memberStorageReached;

  const activeInvites = useMemo(
    () => invites.filter((invite) => invite.status === "active"),
    [invites]
  );
  const pastInvites = useMemo(
    () => invites.filter((invite) => invite.status !== "active"),
    [invites]
  );

  

  const handleGenerate = async () => {
    const expires_at = new Date(
      Date.now() + expiresDays * 24 * 60 * 60 * 1000
    ).toISOString();

    try {
      await dispatch(
        createOrganizationInvite({
          role,
          email: email.trim() ? email.trim() : null,
          max_uses: maxUses,
          expires_at,
        })
      ).unwrap();
      setEmail("");
      setSnackbar({ message: "Invite link created", severity: "success" });
    } catch (err) {
      setSnackbar({
        message: typeof err === "string" ? err : "Failed to create invite",
        severity: "error",
      });
    }
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setSnackbar({ message: "Invite code copied", severity: "success" });
    } catch {
      setSnackbar({ message: "Couldn't copy code", severity: "error" });
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await dispatch(revokeOrganizationInvite(id)).unwrap();
      setSnackbar({ message: "Invite revoked", severity: "success" });
    } catch (err) {
      setSnackbar({
        message: typeof err === "string" ? err : "Failed to revoke invite",
        severity: "error",
      });
    }
  };

  if (!allowed) {
    return (
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, borderColor: "divider", ...fadeInSx(240) }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.2, mb: 1 }}>
          Invite Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Only owners and managers can create or manage invite links.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, borderColor: "divider", ...fadeInSx(240) }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.2, mb: 0.5 }}>
        Invite Members
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Anyone who accepts a link below joins immediately and appears in Team
        Members. Links stay pending until they're fully used, expired, or
        revoked.
      </Typography>

      {error && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}
      {memberLimitReached && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorAlert
            message={activeMembersReached
              ? `Your workspace has reached its active member limit of ${memberLimits?.active_limit}.`
              : `Your workspace has reached its member storage limit of ${memberLimits?.store_limit}.`}
          />
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "2fr 1fr 1fr 1fr auto",
          },
          gap: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Email (optional)"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          size="small"
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as Roles)}
        >
          {INVITE_ROLES.map((r) => (
            <MenuItem key={r} value={r} sx={{ textTransform: "capitalize" }}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Max Uses"
          value={maxUses}
          onChange={(e) => setMaxUses(Number(e.target.value))}
        >
          {MAX_USES_OPTIONS.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          select
          label="Expires"
          value={expiresDays}
          onChange={(e) => setExpiresDays(Number(e.target.value))}
        >
          {EXPIRES_OPTIONS.map((opt) => (
            <MenuItem key={opt.days} value={opt.days}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          disableElevation
          onClick={handleGenerate}
          disabled={creating || memberLimitReached}
          startIcon={creating ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ ...actionButtonSx, height: 40, whiteSpace: "nowrap" }}
        >
          {creating ? "Generating…" : "Generate Invite"}
        </Button>
      </Box>
      {memberLimitReached && (
        <Alert severity="warning" sx={{ mb: 2, mt: 2 }}>
          {activeMembersReached
            ? `Your workspace has reached its active member limit of ${memberLimits?.active_limit}.`
            : `Your workspace has reached its member storage limit of ${memberLimits?.store_limit}.`}
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
        Pending Invitations
      </Typography>

      {loading && invites.length === 0 ? (
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={72} animation="wave" />
          <Skeleton variant="rounded" height={72} animation="wave" />
        </Stack>
      ) : activeInvites.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No pending invite links. Generate one above.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {activeInvites.map((invite) => (
            <Box
              key={invite.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                transition: "border-color 0.2s ease, background-color 0.2s ease",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <ContentCopyRoundedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }} noWrap>
                    {invite.code}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Copy link">
                    <IconButton size="small" onClick={() => handleCopy(invite.code)} sx={iconHoverSx}>
                      <ContentCopyRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button
                    size="small"
                    color="error"
                    disabled={revoking}
                    onClick={() => handleRevoke(invite.id)}
                    sx={actionButtonSx}
                  >
                    Revoke
                  </Button>
                </Stack>
              </Stack>

              <Stack
                direction="row"
                spacing={3}
                sx={{ mt: 1.5 }}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
              >
                <Typography variant="caption" color="text.secondary">
                  Role:{" "}
                  <Box component="span" sx={{ color: "text.primary", textTransform: "capitalize" }}>
                    {invite.role}
                  </Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Uses:{" "}
                  <Box component="span" sx={{ color: "text.primary" }}>
                    {invite.used_count} / {invite.max_uses}
                  </Box>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Expires:{" "}
                  <Box component="span" sx={{ color: "text.primary" }}>
                    {formatDate(invite.expires_at)}
                  </Box>
                </Typography>
                {invite.email && (
                  <Typography variant="caption" color="text.secondary">
                    Restricted to:{" "}
                    <Box component="span" sx={{ color: "text.primary" }}>
                      {invite.email}
                    </Box>
                  </Typography>
                )}
                <InviteAcceptances invite={invite} />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {pastInvites.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
            Past Links
          </Typography>
          <Stack spacing={1}>
            {pastInvites.map((invite) => (
              <Stack
                key={invite.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
                sx={{
                  py: 1,
                  px: 1,
                  borderRadius: 1.5,
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }} noWrap>
                    {invite.code}
                  </Typography>
                  <InviteAcceptances invite={invite} />
                </Stack>
                <Chip
                  label={invite.status}
                  size="small"
                  variant="outlined"
                  color={INVITE_STATUS_COLOR[invite.status]}
                  sx={{ textTransform: "capitalize" }}
                />
              </Stack>
            ))}
          </Stack>
        </>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      >
        {snackbar ? (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Paper>
  );
}


export default function WorkspacePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { item: organization, loading, updating, loaded, error } = useSelector(
    (state: RootState) => state.organization
  );
  const { items: members } = useSelector(
    (state: RootState) => state.orgmembers
  );
  const activeMemberCount = members.filter(
    (member) => member.status === "active"
  ).length;

const totalMemberCount = members.length;
  const memberLimits =
    organization?.subscription?.plan
      ? PLAN_LIMITS[organization.subscription.plan].members
      : null;


  const currentUser = useAuth();
  const currentUserId = currentUser.user?.id;
  const currentUserRole = currentUser.user?.membership?.[0]?.role;

  const inviteSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchWorkspace());
    }
  }, [dispatch, loaded, loading]);

  const scrollToInvite = () => {
    inviteSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1280, mx: "auto" }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, fontSize: { xs: "1.35rem", sm: "1.5rem" }, letterSpacing: -0.2 }}
      >
        Workspace
      </Typography>

      {error && !organization && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <OrganizationOverviewCard
          organization={organization}
          loading={loading}
          updating={updating}
          currentUserRole={currentUserRole}
        />
        <SubscriptionCard
          subscription={organization?.subscription}
          loading={loading}
          currentUserRole={currentUserRole}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <TeamMembersSection
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onInviteClick={scrollToInvite}
        />
      </Box>

      <Box ref={inviteSectionRef} sx={{ mt: 3 }}>
        <InviteMembersSection
          currentUserRole={currentUserRole}
          memberLimits={memberLimits}
          activeMemberCount={activeMemberCount}
          totalMemberCount={totalMemberCount}
        />
      </Box>

      <PendingJoinRequestsSection
        currentUserRole={currentUserRole}
      />
    </Box>
  );
}