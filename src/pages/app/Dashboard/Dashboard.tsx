import React, { useEffect, useMemo } from "react";

import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

import type {
  DashboardActivity,
  InactiveContactItem,
  MemberDashboardStats,
  OpenDealItem,
  PriorityItem,
} from "../../../types/dashboard";

import { useAuth } from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { clearError, fetchDashboard } from "../../../store/dashboardSlice";

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const formatCompactNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "0";

  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString("en-US");
};

const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "Php0";

  if (Math.abs(value) >= 1_000_000) {
    return `Php${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `Php${(value / 1_000).toFixed(1)}K`;
  }

  return `Php${value.toLocaleString("en-US")}`;
};

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "No activity";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "No activity";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInitials = (label: string): string => {
  const parts = label.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getDaypart = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";

  return "evening";
};

const getActivityIcon = (type: string): React.ElementType => {
  switch (type.toLowerCase()) {
    case "lead":
      return PersonAddAltOutlinedIcon;
    case "contact":
      return PeopleAltOutlinedIcon;
    case "customer":
      return GroupsOutlinedIcon;
    case "deal":
      return SellOutlinedIcon;
    case "email":
      return EmailOutlinedIcon;
    case "sms":
      return SmsOutlinedIcon;
    case "call":
      return PhoneOutlinedIcon;
    case "task":
      return TaskAltOutlinedIcon;
    default:
      return CircleOutlinedIcon;
  }
};

const getPriorityColor = (
  priority: string
): "error" | "warning" | "default" => {
  switch (priority.toLowerCase()) {
    case "highest":
      return "error";
    case "high":
      return "warning";
    default:
      return "default";
  }
};

const getStageLabel = (stage: string): string => {
  return stage.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ");
};

const getChartPalette = (theme: Theme): string[] => [
  theme.palette.primary.main,
  theme.palette.info.main,
  theme.palette.warning.main,
  theme.palette.success.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
];

const surfaceHoverSx = {
  transition: (theme: Theme) =>
    theme.transitions.create(["border-color", "box-shadow"], {
      duration: 160,
    }),

  "&:hover": {
    borderColor: "grey.400",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
};

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    spacing={0.75}
    sx={{ py: 3, color: "text.disabled" }}
  >
    <InboxOutlinedIcon sx={{ fontSize: 22, opacity: 0.5 }} />

    <Typography variant="caption" color="text.secondary">
      {message}
    </Typography>
  </Stack>
);

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
}) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{ letterSpacing: "-0.01em", fontSize: "1.05rem" }}
    >
      {title}
    </Typography>

    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  secondary?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  icon: Icon,
  loading,
  secondary,
}) => (
  <Paper
    variant="outlined"
    sx={[
      {
        p: 1.5,
        borderRadius: 2,
        borderColor: "divider",
        height: "100%",
      },
      surfaceHoverSx,
    ]}
  >
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={1}
      sx={{ mb: 1 }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={500}
        noWrap
      >
        {label}
      </Typography>

      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          bgcolor: "action.hover",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 16 }} />
      </Box>
    </Stack>

    {loading ? (
      <Skeleton variant="text" width="55%" height={30} />
    ) : (
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
      >
        {value}
      </Typography>
    )}

    {secondary && !loading && (
      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{ display: "block", mt: 0.25 }}
      >
        {secondary}
      </Typography>
    )}
  </Paper>
);

const SectionCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Paper
    variant="outlined"
    sx={[
      {
        borderRadius: 2,
        borderColor: "divider",
        height: "100%",
        overflow: "hidden",
      },
      surfaceHoverSx,
    ]}
  >
    {children}
  </Paper>
);

/* ------------------------------------------------------------------ */
/* Chart primitives                                                    */
/* ------------------------------------------------------------------ */

interface ChartTooltipProps<T extends object> {
  active?: boolean;
  payload?: Array<{ payload: T }>;
  render?: (item: T) => React.ReactNode;
}
const ChartTooltip = <T extends object>({
  active,
  payload,
  render,
}: ChartTooltipProps<T>) => {
  if (!active || !payload?.length || !render) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        px: 1.25,
        py: 0.75,
        boxShadow: 3,
      }}
    >
      {render(payload[0].payload)}
    </Box>
  );
};

interface ChartCardProps {
  title: string;
  action?: React.ReactNode;
  height?: number;
  loading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  action,
  height = 260,
  loading,
  isEmpty,
  emptyMessage,
  children,
}) => (
  <SectionCard>
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {title}
        </Typography>

        {action}
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" height={height} />
      ) : isEmpty ? (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmptyState message={emptyMessage} />
        </Box>
      ) : (
        <Box sx={{ height }}>{children}</Box>
      )}
    </Box>
  </SectionCard>
);

interface PipelineStageDatum {
  stage: string;
  count: number;
  value: number;
}

const PipelineChart: React.FC<{ stages: PipelineStageDatum[] }> = ({
  stages,
}) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={stages}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={theme.palette.divider} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          width={96}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          cursor={{ fill: theme.palette.action.hover }}
          content={
            <ChartTooltip<PipelineStageDatum>
              render={(item) => (
                <>
                  <Typography>{item.stage}</Typography>
                  <Typography>{item.count}</Typography>
                </>
              )}
            />
          }
        />
        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          fill={theme.palette.primary.main}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface StatusDatum {
  label: string;
  count: number;
}

const LeadStatusChart: React.FC<{ data: StatusDatum[] }> = ({ data }) => {
  const theme = useTheme();
  const colors = getChartPalette(theme);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={theme.palette.divider} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={90}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          cursor={{ fill: theme.palette.action.hover }}
          content={
            <ChartTooltip<StatusDatum>
              render={(item) => (
                <>
                  <Typography variant="caption" fontWeight={600} display="block">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.count} leads
                  </Typography>
                </>
              )}
            />
          }
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={25}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomerStatusChart: React.FC<{
  data: StatusDatum[];
  total: number;
}> = ({ data, total }) => {
  const theme = useTheme();
  const colors = getChartPalette(theme);

  return (
    <Stack direction="row" spacing={2.5} alignItems="center" sx={{ height: "100%" }}>
      <Box sx={{ position: "relative", width: 250, height: "100%", flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius="40%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              content={
                <ChartTooltip<StatusDatum>
                  render={(item) => (
                    <>
                      <Typography variant="caption" fontWeight={600} display="block">
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.count} customers
                      </Typography>
                    </>
                  )}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            total
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        {data.map((entry, index) => (
          <Stack key={entry.label} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: colors[index % colors.length],
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
              {entry.label}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} fontWeight={600}>
              {entry.count}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

interface WorkloadDatum {
  name: string;
  workload: number;
}

const WorkloadChart: React.FC<{ data: WorkloadDatum[] }> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke={theme.palette.divider} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={76}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          cursor={{ fill: theme.palette.action.hover }}
          content={
            <ChartTooltip<WorkloadDatum>
              render={(item) => (
                <>
                  <Typography variant="caption" fontWeight={600} display="block">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Workload: {item.workload}
                  </Typography>
                </>
              )}
            />
          }
        />
        <Bar
          dataKey="workload"
          radius={[0, 4, 4, 0]}
          fill={theme.palette.secondary.main}
          barSize={14}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface ActivitySummaryProps {
  emailsSent: number;
  smsSent: number;
  callsCompleted: number;
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  emailsSent,
  smsSent,
  callsCompleted,
  tasksCompleted,
  tasksPending,
  tasksOverdue,
}) => {
  const metrics: Array<{
    label: string;
    value: number;
    icon: React.ElementType;
    highlight?: boolean;
  }> = [
    { label: "Emails", value: emailsSent, icon: EmailOutlinedIcon },
    { label: "SMS", value: smsSent, icon: SmsOutlinedIcon },
    { label: "Calls", value: callsCompleted, icon: PhoneOutlinedIcon },
    {
      label: "Tasks done",
      value: tasksCompleted,
      icon: CheckCircleOutlineOutlinedIcon,
    },
    { label: "Pending", value: tasksPending, icon: TaskAltOutlinedIcon },
    {
      label: "Overdue",
      value: tasksOverdue,
      icon: WarningAmberOutlinedIcon,
      highlight: tasksOverdue > 0,
    },
  ];

  return (
    <Grid container spacing={1.5}>
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Grid key={metric.label} size={{ xs: 6, sm: 4, md: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: metric.highlight ? "error.main" : "action.hover",
                  color: metric.highlight
                    ? "error.contrastText"
                    : "text.secondary",
                  flexShrink: 0,
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  color={metric.highlight ? "error.main" : "text.primary"}
                >
                  {metric.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {metric.label}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
};

/* ------------------------------------------------------------------ */
/* Lists                                                                */
/* ------------------------------------------------------------------ */

const PriorityList: React.FC<{
  items: PriorityItem[];
  label: string;
}> = ({ items, label }) => {
  if (items.length === 0) {
    return <EmptyState message={`No priority ${label.toLowerCase()} right now.`} />;
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ListItem sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar sx={{ width: 30, height: 30, fontSize: 12 }}>
                {getInitials(item.name)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.name}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {item.displayId}
                </Typography>
              }
            />

            <Chip
              label={item.priority}
              size="small"
              color={getPriorityColor(item.priority)}
              variant="outlined"
              sx={{ textTransform: "capitalize", flexShrink: 0 }}
            />
          </ListItem>

          {index < items.length - 1 && (
            <Divider component="li" sx={{ mx: { xs: 1.5, sm: 2 } }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

const OpenDealsList: React.FC<{ items: OpenDealItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState message="No open deals right now." />;
  }

  return (
    <List disablePadding>
      {items.map((deal, index) => (
        <React.Fragment key={deal.id}>
          <ListItem sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ minWidth: 0 }}>
                    {deal.title}
                  </Typography>

                  <Chip
                    label={getStageLabel(deal.stage)}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: 11, flexShrink: 0 }}
                  />
                </Stack>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {deal.displayId}
                  {deal.closeDate ? ` · Close ${formatDate(deal.closeDate)}` : ""}
                </Typography>
              }
            />

            <Typography variant="body2" fontWeight={700} sx={{ ml: 2, flexShrink: 0 }}>
              {formatCurrency(deal.value)}
            </Typography>
          </ListItem>

          {index < items.length - 1 && (
            <Divider component="li" sx={{ mx: { xs: 1.5, sm: 2 } }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

const InactiveContactsList: React.FC<{ items: InactiveContactItem[] }> = ({
  items,
}) => {
  if (items.length === 0) {
    return <EmptyState message="No inactive contacts right now." />;
  }

  return (
    <List disablePadding>
      {items.map((contact, index) => (
        <React.Fragment key={contact.id}>
          <ListItem sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar sx={{ width: 30, height: 30, fontSize: 12 }}>
                {getInitials(contact.name)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={600} noWrap>
                  {contact.name}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {contact.displayId} ·{" "}
                  {contact.lastActivityAt
                    ? `Last activity ${formatDate(contact.lastActivityAt)}`
                    : "No recorded activity"}
                </Typography>
              }
            />

            <Stack alignItems="flex-end" sx={{ ml: 1, flexShrink: 0 }}>
              <Typography variant="body2" fontWeight={700} color="warning.main">
                {contact.inactiveDays}d
              </Typography>
              <Typography variant="caption" color="text.secondary">
                inactive
              </Typography>
            </Stack>
          </ListItem>

          {index < items.length - 1 && (
            <Divider component="li" sx={{ mx: { xs: 1.5, sm: 2 } }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

const RecentActivityList: React.FC<{ activities: DashboardActivity[] }> = ({
  activities,
}) => {
  if (activities.length === 0) {
    return <EmptyState message="No recent activity yet." />;
  }

  return (
    <List disablePadding>
      {activities.slice(0, 5).map((activity, index) => {
        const Icon = getActivityIcon(activity.type);

        return (
          <React.Fragment key={activity.id}>
            <ListItem sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                    color: "text.secondary",
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Stack direction="row" spacing={0.75} sx={{ mt: 0.25 }}>
                    {activity.createdBy && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {activity.createdBy.name}
                      </Typography>
                    )}

                    {activity.targetName && (
                      <>
                        <Typography variant="caption" color="text.disabled">
                          ·
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {activity.targetName}
                        </Typography>
                      </>
                    )}

                    <Typography variant="caption" color="text.disabled">
                      ·
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                      {formatRelativeTime(activity.createdAt)}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>

            {index < activities.length - 1 && (
              <Divider component="li" sx={{ mx: { xs: 1.5, sm: 2 } }} />
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const { data: dashboard, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const userName =
    user?.display_name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "there";

  const membership = user?.membership?.[0];
  const orgName = membership?.org?.name ?? "your organization";

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const isOrganizationDashboard = dashboard?.scope === "organization";
  const isUserDashboard = dashboard?.scope === "user";

  const kpis = dashboard?.kpis;
  const activityStats = dashboard?.activity;

  const pipelineChartData = useMemo<PipelineStageDatum[]>(
    () =>
      (dashboard?.pipeline.stages ?? []).map((stage) => ({
        stage: getStageLabel(stage.stage),
        count: stage.count,
        value: stage.value,
      })),
    [dashboard]
  );

  const leadChartData = useMemo<StatusDatum[]>(
    () =>
      Object.entries(dashboard?.leads.byStatus ?? {})
        .sort(([, a], [, b]) => b - a)
        .map(([status, count]) => ({ label: getStageLabel(status), count })),
    [dashboard]
  );

  const customerChartData = useMemo<StatusDatum[]>(
    () =>
      Object.entries(dashboard?.customers.byStatus ?? {})
        .sort(([, a], [, b]) => b - a)
        .map(([status, count]) => ({ label: getStageLabel(status), count })),
    [dashboard]
  );

  const memberRows = useMemo(
    () =>
      [...(dashboard?.members ?? [])].sort((a, b) => {
        const workloadA = a.openTasks + a.openDeals + a.scheduledCalls;
        const workloadB = b.openTasks + b.openDeals + b.scheduledCalls;
        return workloadB - workloadA;
      }),
    [dashboard]
  );

  const workloadChartData = useMemo<WorkloadDatum[]>(
    () =>
      memberRows.slice(0, 6).map((member) => ({
        name: member.name.split(" ")[0] || member.name,
        workload: member.openTasks + member.openDeals + member.scheduledCalls,
      })),
    [memberRows]
  );

  const handleRefresh = () => {
    dispatch(fetchDashboard());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 2.5 },
        pt: 0,
      }}
    >
      {error && (
        <Alert
          severity="error"
          onClose={handleClearError}
          sx={{ mb: 2.5, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: "-0.02em" }}>
            Good {getDaypart()}, {userName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isOrganizationDashboard
              ? `Organization overview · ${orgName}`
              : "Your personal CRM overview"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {today}
          </Typography>
        </Box>

        <Tooltip title="Refresh dashboard data">
          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh dashboard data"
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}
          >
            <RefreshOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* KPI cards */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Total Leads"
            value={kpis ? formatCompactNumber(kpis.totalLeads) : "—"}
            icon={PersonAddAltOutlinedIcon}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Contacts"
            value={kpis ? formatCompactNumber(kpis.totalContacts) : "—"}
            icon={PeopleAltOutlinedIcon}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Customers"
            value={kpis ? formatCompactNumber(kpis.totalCustomers) : "—"}
            icon={GroupsOutlinedIcon}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Open Deals"
            value={kpis ? formatCompactNumber(kpis.openDeals) : "—"}
            icon={SellOutlinedIcon}
            loading={loading}
            secondary={kpis ? `${formatCurrency(kpis.pipelineValue)} pipeline` : undefined}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Pipeline Value"
            value={kpis ? formatCurrency(kpis.pipelineValue) : "—"}
            icon={AttachMoneyOutlinedIcon}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Open Tasks"
            value={kpis ? formatCompactNumber(kpis.openTasks) : "—"}
            icon={TaskAltOutlinedIcon}
            loading={loading}
            secondary={kpis ? `${kpis.overdueTasks} overdue` : undefined}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Scheduled Calls"
            value={kpis ? formatCompactNumber(kpis.scheduledCalls) : "—"}
            icon={PhoneOutlinedIcon}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <KpiCard
            label="Won Revenue"
            value={kpis ? formatCurrency(kpis.wonRevenue) : "—"}
            icon={CheckCircleOutlineOutlinedIcon}
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Pipeline */}
      <SectionHeading title="Pipeline" subtitle="Deal stages, open pipeline and won revenue" />

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard
            title="Pipeline by Stage"
            height={280}
            loading={loading}
            isEmpty={pipelineChartData.length === 0}
            emptyMessage="No deals in the pipeline yet."
          >
            <PipelineChart stages={pipelineChartData} />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Pipeline Summary
              </Typography>

              <Stack spacing={1.5} divider={<Divider />}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Open pipeline
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 0.25 }}>
                    {loading ? "—" : formatCurrency(kpis?.pipelineValue ?? 0)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Won revenue
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 0.25 }}>
                    {loading ? "—" : formatCurrency(kpis?.wonRevenue ?? 0)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

      {/* CRM overview */}
      <SectionHeading title="CRM Overview" subtitle="Distribution across leads and customers" />

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Lead Status"
            action={
              <Chip
                label={loading ? "—" : `${dashboard?.leads.total ?? 0} total`}
                size="small"
                variant="outlined"
              />
            }
            height={240}
            loading={loading}
            isEmpty={leadChartData.length === 0}
            emptyMessage="No lead data yet."
          >
            <LeadStatusChart data={leadChartData} />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Customer Status"
            action={
              <Chip
                label={loading ? "—" : `${dashboard?.customers.total ?? 0} total`}
                size="small"
                variant="outlined"
              />
            }
            height={240}
            loading={loading}
            isEmpty={customerChartData.length === 0}
            emptyMessage="No customer data yet."
          >
            
            <CustomerStatusChart
              data={customerChartData}
              total={dashboard?.customers.total ?? 0}
            />
            
          </ChartCard>
        </Grid>
      </Grid>

      {/* Activity */}
      <SectionHeading title="Activity" subtitle="Communication and task volume" />

      <Box sx={{ mb: 3 }}>
        <SectionCard>
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            {loading ? (
              <Grid container spacing={1.5}>
                {[0, 1, 2, 3, 4, 5].map((item) => (
                  <Grid key={item} size={{ xs: 6, sm: 4, md: 2 }}>
                    <Skeleton variant="rounded" height={40} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <ActivitySummary
                emailsSent={activityStats?.emailsSent ?? 0}
                smsSent={activityStats?.smsSent ?? 0}
                callsCompleted={activityStats?.callsCompleted ?? 0}
                tasksCompleted={activityStats?.tasksCompleted ?? 0}
                tasksPending={activityStats?.tasksPending ?? 0}
                tasksOverdue={activityStats?.tasksOverdue ?? 0}
              />
            )}
          </Box>
        </SectionCard>
      </Box>

      {/* Needs attention */}
      <SectionHeading title="Needs Attention" subtitle="Items that may need action right now" />

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Priority Leads
                </Typography>
              </Stack>
            </Box>

            {loading ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rounded" height={44} />
                  ))}
                </Stack>
              </Box>
            ) : (
              <PriorityList items={dashboard?.attention.priorityLeads ?? []} label="leads" />
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Priority Contacts
                </Typography>
              </Stack>
            </Box>

            {loading ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rounded" height={44} />
                  ))}
                </Stack>
              </Box>
            ) : (
              <PriorityList
                items={dashboard?.attention.priorityContacts ?? []}
                label="contacts"
              />
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AttachMoneyOutlinedIcon sx={{ fontSize: 19, color: "success.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Open Deals
                </Typography>
              </Stack>
            </Box>

            {loading ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rounded" height={44} />
                  ))}
                </Stack>
              </Box>
            ) : (
              <OpenDealsList items={dashboard?.attention.openDeals ?? []} />
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PersonOffOutlinedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Inactive Contacts
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                No recorded CRM activity in the last 30 days
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rounded" height={44} />
                  ))}
                </Stack>
              </Box>
            ) : (
              <InactiveContactsList items={dashboard?.attention.inactiveContacts ?? []} />
            )}
          </SectionCard>
        </Grid>
      </Grid>

      {/* Recent activity */}
      <SectionHeading
        title="Recent Activity"
        subtitle={
          isOrganizationDashboard
            ? "Latest activity across your organization"
            : "Your latest CRM activity"
        }
      />

      <Box sx={{ mb: 3 }}>
        <SectionCard>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                {[0, 1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} variant="rounded" height={44} />
                ))}
              </Stack>
            </Box>
          ) : (
            <RecentActivityList activities={dashboard?.recentActivity ?? []} />
          )}
        </SectionCard>
      </Box>

      {/* Team workload */}
      {isOrganizationDashboard && (
        <>
          <SectionHeading
            title="Team Workload"
            subtitle="Current workload and communication volume by active member"
          />

          <Stack spacing={1.5}>
            {(loading || workloadChartData.length > 0) && (
              <ChartCard
                title="Workload by Member"
                height={Math.max(140, workloadChartData.length * 30)}
                loading={loading}
                isEmpty={workloadChartData.length === 0}
                emptyMessage="No active organization members."
              >
                <WorkloadChart data={workloadChartData} />
              </ChartCard>
            )}

            <SectionCard>
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    {[0, 1, 2, 3].map((item) => (
                      <Skeleton key={item} variant="rounded" height={48} />
                    ))}
                  </Stack>
                </Box>
              ) : memberRows.length === 0 ? (
                <EmptyState message="No active organization members." />
              ) : (
                <TableContainer>
                  <Table
                    size="small"
                    sx={{
                      minWidth: 900,
                      "& .MuiTableCell-root": {
                        py: 0.75,
                        px: 1.5,
                        fontSize: 13,
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="right">Leads</TableCell>
                        <TableCell align="right">Contacts</TableCell>
                        <TableCell align="right">Customers</TableCell>
                        <TableCell align="right">Open Deals</TableCell>
                        <TableCell align="right">Pipeline</TableCell>
                        <TableCell align="right">Open Tasks</TableCell>
                        <TableCell align="right">Overdue</TableCell>
                        <TableCell align="right">Calls</TableCell>
                        <TableCell align="right">Emails</TableCell>
                        <TableCell align="right">SMS</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {memberRows.map((member: MemberDashboardStats) => (
                        <TableRow key={member.memberId} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1.25}>
                              <Avatar
                                src={member.avatarUrl ?? undefined}
                                sx={{ width: 28, height: 28, fontSize: 11 }}
                              >
                                {getInitials(member.name)}
                              </Avatar>

                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                  {member.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {member.displayId}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={member.role}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: "capitalize", height: 20, fontSize: 11 }}
                            />
                          </TableCell>

                          <TableCell align="right">{member.leads}</TableCell>
                          <TableCell align="right">{member.contacts}</TableCell>
                          <TableCell align="right">{member.customers}</TableCell>
                          <TableCell align="right">{member.openDeals}</TableCell>

                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(member.pipelineValue)}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">{member.openTasks}</TableCell>

                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={member.overdueTasks > 0 ? "error.main" : "text.primary"}
                              fontWeight={member.overdueTasks > 0 ? 600 : 400}
                            >
                              {member.overdueTasks}
                            </Typography>
                          </TableCell>

                          <TableCell align="right">{member.scheduledCalls}</TableCell>
                          <TableCell align="right">{member.emailsSent}</TableCell>
                          <TableCell align="right">{member.smsSent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </SectionCard>
          </Stack>
        </>
      )}

      {/* Personal workload */}
      {isUserDashboard && dashboard?.members[0] && (
        <>
          <SectionHeading title="My Workload" subtitle="Your current assignments and activity" />

          <SectionCard>
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Stack direction="row" flexWrap="wrap" spacing={3} rowGap={1.5}>
                {[
                  { label: "Leads", value: formatCompactNumber(dashboard.members[0].leads) },
                  { label: "Contacts", value: formatCompactNumber(dashboard.members[0].contacts) },
                  { label: "Deals", value: formatCompactNumber(dashboard.members[0].openDeals) },
                  { label: "Tasks", value: formatCompactNumber(dashboard.members[0].openTasks) },
                  { label: "Calls", value: formatCompactNumber(dashboard.members[0].scheduledCalls) },
                  { label: "Pipeline", value: formatCurrency(dashboard.members[0].pipelineValue) },
                ].map((item) => (
                  <Stack key={item.label} spacing={0.25} sx={{ minWidth: 76 }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </SectionCard>
        </>
      )}
    </Box>
  );
};

export default Dashboard;