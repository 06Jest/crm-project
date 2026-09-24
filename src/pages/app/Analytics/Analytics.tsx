import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
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
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
// import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
// import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";

import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../store/store";
import {
  clearError,
  fetchAnalytics,
} from "../../../store/analyticsSlice";

import type {
  AnalyticsBreakdownDimension,
  AnalyticsComparison,
  AnalyticsDateRange,
  AnalyticsFilters,
  AnalyticsMetricWithComparison,
  // AnalyticsData,
} from "../../../types/analytics";

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

const formatExactCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return "Php0";

  return `Php${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getStageLabel = (stage: string): string => {
  return stage
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ");
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

const SectionHeading: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{
        letterSpacing: "-0.01em",
        fontSize: "1.05rem",
      }}
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

const SectionCard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
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
/* KPI                                                                  */
/* ------------------------------------------------------------------ */

interface AnalyticsKpiCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  metric?: AnalyticsMetricWithComparison;
  formatChange?: (value: number) => string;
}

const AnalyticsKpiCard: React.FC<AnalyticsKpiCardProps> = ({
  label,
  value,
  icon: Icon,
  loading,
  metric,
  // formatChange = formatCompactNumber,
}) => {
  const hasComparison =
    metric?.available &&
    metric.changePercent !== undefined &&
    metric.previousValue !== undefined;

  const change = metric?.changePercent ?? 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
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
          sx={{
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {value}
        </Typography>
      )}

      {hasComparison && !loading && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mt: 0.75 }}
        >
          {isPositive && (
            <TrendingUpRoundedIcon
              sx={{
                fontSize: 15,
                color: "success.main",
              }}
            />
          )}

          {isNegative && (
            <TrendingDownRoundedIcon
              sx={{
                fontSize: 15,
                color: "error.main",
              }}
            />
          )}

          <Typography
            variant="caption"
            fontWeight={600}
            color={
              isPositive
                ? "success.main"
                : isNegative
                  ? "error.main"
                  : "text.secondary"
            }
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </Typography>

          <Typography variant="caption" color="text.secondary">
            vs previous
          </Typography>
        </Stack>
      )}

      {!hasComparison && !loading && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.75,
          }}
        >
          {metric?.available === false
            ? "Unavailable"
            : "Selected period"}
        </Typography>
      )}
    </Paper>
  );
};

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
  subtitle?: string;
  action?: React.ReactNode;
  height?: number;
  loading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
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
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1.5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

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

/* ------------------------------------------------------------------ */
/* Charts                                                               */
/* ------------------------------------------------------------------ */

interface StageDatum {
  stage: string;
  count: number;
  value: number;
}

const SalesStageChart: React.FC<{
  data: StageDatum[];
}> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          horizontal={false}
          stroke={theme.palette.divider}
        />

        <XAxis type="number" hide />

        <YAxis
          type="category"
          dataKey="stage"
          width={100}
          tick={{
            fontSize: 12,
            fill: theme.palette.text.secondary,
          }}
          axisLine={false}
          tickLine={false}
        />

        <RechartsTooltip
          cursor={{
            fill: theme.palette.action.hover,
          }}
          content={
            <ChartTooltip<StageDatum>
              render={(item) => (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {getStageLabel(item.stage)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.count} deals · {formatCurrency(item.value)}
                  </Typography>
                </>
              )}
            />
          }
        />

        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          fill={theme.palette.primary.main}
          barSize={35}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RevenueStageChart: React.FC<{
  data: StageDatum[];
}> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          horizontal={false}
          stroke={theme.palette.divider}
        />

        <XAxis type="number" hide />

        <YAxis
          type="category"
          dataKey="stage"
          width={100}
          tick={{
            fontSize: 12,
            fill: theme.palette.text.secondary,
          }}
          axisLine={false}
          tickLine={false}
        />

        <RechartsTooltip
          cursor={{
            fill: theme.palette.action.hover,
          }}
          content={
            <ChartTooltip<StageDatum>
              render={(item) => (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {getStageLabel(item.stage)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {formatExactCurrency(item.value)}
                  </Typography>
                </>
              )}
            />
          }
        />

        <Bar
          dataKey="value"
          radius={[0, 4, 4, 0]}
          fill={theme.palette.success.main}
          barSize={35}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface CountDatum {
  label: string;
  count: number;
}

const DistributionChart: React.FC<{
  data: CountDatum[];
  valueLabel: string;
}> = ({ data, valueLabel }) => {
  const theme = useTheme();
  const colors = getChartPalette(theme);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 0,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          horizontal={false}
          stroke={theme.palette.divider}
        />

        <XAxis type="number" hide />

        <YAxis
          type="category"
          dataKey="label"
          width={100}
          tick={{
            fontSize: 12,
            fill: theme.palette.text.secondary,
          }}
          axisLine={false}
          tickLine={false}
        />

        <RechartsTooltip
          cursor={{
            fill: theme.palette.action.hover,
          }}
          content={
            <ChartTooltip<CountDatum>
              render={(item) => (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.count} {valueLabel}
                  </Typography>
                </>
              )}
            />
          }
        />

        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          barSize={35}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={colors[index % colors.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CohortChart: React.FC<{
  data: Array<{
    cohort: string;
    customers: number;
  }>;
}> = ({ data }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          stroke={theme.palette.divider}
          vertical={false}
        />

        <XAxis
          dataKey="cohort"
          tick={{
            fontSize: 11,
            fill: theme.palette.text.secondary,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{
            fontSize: 11,
            fill: theme.palette.text.secondary,
          }}
          axisLine={false}
          tickLine={false}
        />

        <RechartsTooltip
          content={
            <ChartTooltip<{
              cohort: string;
              customers: number;
            }>
              render={(item) => (
                <>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    display="block"
                  >
                    {item.cohort}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.customers} customers
                  </Typography>
                </>
              )}
            />
          }
        />

        <Line
          type="monotone"
          dataKey="customers"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{
            r: 3,
            fill: theme.palette.primary.main,
          }}
          activeDot={{
            r: 5,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

/* ------------------------------------------------------------------ */
/* Health metrics                                                      */
/* ------------------------------------------------------------------ */

const HealthMetric: React.FC<{
  label: string;
  value: number;
  warning?: boolean;
}> = ({ label, value, warning }) => (
  <Stack spacing={0.25} sx={{ minWidth: 100 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography
      variant="h6"
      fontWeight={700}
      color={warning && value > 0 ? "warning.main" : "text.primary"}
    >
      {value.toLocaleString("en-US")}
    </Typography>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Advanced analytics primitives                                       */
/* ------------------------------------------------------------------ */

const formatDays = (value: number): string => {
  if (!Number.isFinite(value)) return "0 days";
  if (value < 1) return `${Math.round(value * 24)}h`;
  return `${value.toFixed(1)}d`;
};

const formatPercent = (value: number): string => {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
};

const AdvancedMetric: React.FC<{
  label: string;
  value: string;
  caption?: string;
}> = ({ label, value, caption }) => (
  <Stack spacing={0.25} sx={{ minWidth: 105 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h6" fontWeight={700}>
      {value}
    </Typography>
    {caption && (
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    )}
  </Stack>
);

const AdvancedCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}> = ({ title, subtitle, icon: Icon = QueryStatsOutlinedIcon, children }) => (
  <SectionCard>
    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
      <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      {children}
    </Box>
  </SectionCard>
);

const AnomalyRow: React.FC<{
  metric: string;
  currentValue: number;
  baselineValue: number;
  deviationPercent: number;
  direction: "increase" | "decrease";
  severity: "low" | "medium" | "high";
}> = ({
  metric,
  currentValue,
  baselineValue,
  deviationPercent,
  direction,
  severity,
}) => {
  const severityColor =
    severity === "high"
      ? "error.main"
      : severity === "medium"
        ? "warning.main"
        : "info.main";

  const isRevenue = metric.toLowerCase().includes("revenue");
  const formatValue = (value: number) =>
    isRevenue ? formatCurrency(value) : formatCompactNumber(value);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      sx={{ py: 1.1 }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography variant="body2" fontWeight={600}>
            {metric}
          </Typography>
          <Chip
            label={severity}
            size="small"
            variant="outlined"
            sx={{
              height: 21,
              color: severityColor,
              borderColor: severityColor,
              textTransform: "capitalize",
              fontSize: 11,
            }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {formatValue(currentValue)} now · {formatValue(baselineValue)} baseline
        </Typography>
      </Box>

      <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }}>
        <Typography
          variant="body2"
          fontWeight={700}
          color={direction === "increase" ? "success.main" : "error.main"}
        >
          {direction === "increase" ? "+" : "-"}
          {formatPercent(deviationPercent)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {direction === "increase" ? "increase" : "decrease"}
        </Typography>
      </Stack>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

const Analytics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: analytics, loading, error } = useSelector(
    (state: RootState) => state.analytics,
  );

  const [range, setRange] =
    useState<AnalyticsDateRange>("30d");

  const [comparison, setComparison] =
    useState<AnalyticsComparison>("previous_period");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [memberId, setMemberId] = useState("");
  const [source, setSource] = useState("");
  const [breakdownDimension, setBreakdownDimension] =
    useState<AnalyticsBreakdownDimension>("industry");

  const filters = useMemo<AnalyticsFilters>(
    () => ({
      range,
      comparison,
      startDate: range === "custom" && startDate ? startDate : undefined,
      endDate: range === "custom" && endDate ? endDate : undefined,
      memberId: memberId || undefined,
      source: source.trim() || undefined,
      dimension: breakdownDimension,
    }),
    [range, comparison, startDate, endDate, memberId, source, breakdownDimension],
  );

  useEffect(() => {
    dispatch(fetchAnalytics(filters));
  }, [dispatch, filters]);

  const handleRefresh = () => {
    dispatch(fetchAnalytics(filters));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const salesChartData = useMemo<StageDatum[]>(
    () =>
      (analytics?.sales.stages ?? []).map((stage) => ({
        stage: stage.stage,
        count: stage.count,
        value: stage.value,
      })),
    [analytics],
  );

  const revenueChartData = useMemo<StageDatum[]>(
    () =>
      (analytics?.revenue.revenueByStage ?? []).map(
        (stage) => ({
          stage: stage.stage,
          count: stage.count,
          value: stage.value,
        }),
      ),
    [analytics],
  );
  const theme = useTheme();
  
  const leadStatusData = useMemo<CountDatum[]>(
    () => 
      (analytics?.leads.statuses ?? []).map((status) => ({
        label: getStageLabel(status.status),
        count: status.count,
      })),
    [analytics],
  );
  const leadStatusColors = getChartPalette(theme);

  const activityData = useMemo<CountDatum[]>(
    () =>
      (analytics?.activity.types ?? []).map((activity) => ({
        label: getStageLabel(activity.type),
        count: activity.count,
      })),
    [analytics],
  );

  const taskStatusData = useMemo<CountDatum[]>(
    () =>
      (analytics?.tasks.statuses ?? []).map((status) => ({
        label: getStageLabel(status.status),
        count: status.count,
      })),
    [analytics],
  );

  const cohortData = useMemo(
    () =>
      [...(analytics?.cohorts.cohorts ?? [])].sort(
        (a, b) => a.cohort.localeCompare(b.cohort),
      ),
    [analytics],
  );

  const teamRows = useMemo(
    () =>
      [...(analytics?.team.members ?? [])].sort(
        (a, b) => b.pipelineValue - a.pipelineValue,
      ),
    [analytics],
  );

  const availableMembers = useMemo(
    () => analytics?.team.members ?? [],
    [analytics],
  );

  const overview = analytics?.overview;

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
          sx={{
            mb: 2.5,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* ------------------------------------------------------------ */}
      {/* Header                                                        */}
      {/* ------------------------------------------------------------ */}

      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              letterSpacing: "-0.02em",
            }}
          >
            Analytics
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Trends, performance, and CRM insights across your data.
          </Typography>
        </Box>

        <Tooltip title="Refresh analytics data">
          <IconButton
            size="small"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh analytics data"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
            }}
          >
            <RefreshOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* ------------------------------------------------------------ */}
      {/* Filters                                                       */}
      {/* ------------------------------------------------------------ */}

      <SectionCard>
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.25}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
          >
            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 150,
                },
              }}
            >
              <InputLabel>Date range</InputLabel>

              <Select
                value={range}
                label="Date range"
                onChange={(event) =>
                  setRange(
                    event.target.value as AnalyticsDateRange,
                  )
                }
              >
                <MenuItem value="today">
                  Today
                </MenuItem>

                <MenuItem value="7d">
                  Last 7 days
                </MenuItem>

                <MenuItem value="30d">
                  Last 30 days
                </MenuItem>

                <MenuItem value="90d">
                  Last 90 days
                </MenuItem>

                <MenuItem value="this_year">
                  This year
                </MenuItem>

                <MenuItem value="custom">
                  Custom
                </MenuItem>
              </Select>
            </FormControl>

            {range === "custom" && (
              <>
                <TextField
                  size="small"
                  type="date"
                  label="Start date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: { xs: "100%", sm: 155 } }}
                />

                <TextField
                  size="small"
                  type="date"
                  label="End date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: { xs: "100%", sm: 155 } }}
                />
              </>
            )}

            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 170,
                },
              }}
            >
              <InputLabel>Compare</InputLabel>

              <Select
                value={comparison}
                label="Compare"
                onChange={(event) =>
                  setComparison(
                    event.target.value as AnalyticsComparison,
                  )
                }
              >
                <MenuItem value="previous_period">
                  Previous period
                </MenuItem>

                <MenuItem value="previous_year">
                  Previous year
                </MenuItem>

                <MenuItem value="none">
                  No comparison
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 170,
                },
              }}
            >
              <InputLabel>Member</InputLabel>

              <Select
                value={memberId}
                label="Member"
                onChange={(event) =>
                  setMemberId(event.target.value)
                }
              >
                <MenuItem value="">
                  All members
                </MenuItem>

                {availableMembers.map((member) => (
                  <MenuItem
                    key={member.memberId}
                    value={member.memberId}
                  >
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Source"
              value={source}
              onChange={(event) =>
                setSource(event.target.value)
              }
              placeholder="e.g. Website"
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 170,
                },
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 190,
                },
              }}
            >
              <InputLabel>Breakdown</InputLabel>

              <Select
                value={breakdownDimension}
                label="Breakdown"
                onChange={(event) =>
                  setBreakdownDimension(
                    event.target.value as AnalyticsBreakdownDimension,
                  )
                }
              >
                <MenuItem value="industry">Industry</MenuItem>
                <MenuItem value="source">Source</MenuItem>
                <MenuItem value="department">Department</MenuItem>
                <MenuItem value="position">Position</MenuItem>
                <MenuItem value="company">Company</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="preferred_contact_time">
                  Preferred contact time
                </MenuItem>
                <MenuItem value="gender">Gender</MenuItem>
                <MenuItem value="social_channel">Social channel</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </SectionCard>

      {/* ------------------------------------------------------------ */}
      {/* Executive Overview                                            */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Executive Overview"
          subtitle="Key CRM metrics for the selected period"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Leads"
              value={
                overview
                  ? formatCompactNumber(
                      overview.totalLeads.value,
                    )
                  : "—"
              }
              icon={PersonAddAltOutlinedIcon}
              loading={loading}
              metric={overview?.totalLeads}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Contacts"
              value={
                overview
                  ? formatCompactNumber(
                      overview.totalContacts.value,
                    )
                  : "—"
              }
              icon={PeopleAltOutlinedIcon}
              loading={loading}
              metric={overview?.totalContacts}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Customers"
              value={
                overview
                  ? formatCompactNumber(
                      overview.totalCustomers.value,
                    )
                  : "—"
              }
              icon={GroupsOutlinedIcon}
              loading={loading}
              metric={overview?.totalCustomers}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Deals"
              value={
                overview
                  ? formatCompactNumber(
                      overview.totalDeals.value,
                    )
                  : "—"
              }
              icon={SellOutlinedIcon}
              loading={loading}
              metric={overview?.totalDeals}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Pipeline"
              value={
                overview
                  ? formatCurrency(
                      overview.pipelineValue.value,
                    )
                  : "—"
              }
              icon={AttachMoneyOutlinedIcon}
              loading={loading}
              metric={overview?.pipelineValue}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <AnalyticsKpiCard
              label="Won Revenue"
              value={
                overview
                  ? formatCurrency(
                      overview.wonRevenue.value,
                    )
                  : "—"
              }
              icon={AssessmentOutlinedIcon}
              loading={loading}
              metric={overview?.wonRevenue}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Sales & Pipeline                                               */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Sales & Pipeline"
          subtitle="Deal distribution and value across stages"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Deals by Stage"
              subtitle="Number of deals created during the selected period"
              height={280}
              loading={loading}
              isEmpty={salesChartData.length === 0}
              emptyMessage="No deal data available for this period."
            >
              <SalesStageChart data={salesChartData} />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Value by Stage"
              subtitle="Deal value distributed across stages"
              height={280}
              loading={loading}
              isEmpty={revenueChartData.length === 0}
              emptyMessage="No revenue data available for this period."
            >
              <RevenueStageChart data={revenueChartData} />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Lead Analytics                                                 */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Lead Analytics"
          subtitle="Lead distribution across observed statuses"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 7 }}>
  <ChartCard
    title="Lead Status Distribution"
    action={
      <Chip
        label={
          loading
            ? "—"
            : `${analytics?.leads.totalLeads ?? 0} total`
        }
        size="small"
        variant="outlined"
      />
    }
    height={260}
    loading={loading}
    isEmpty={leadStatusData.length === 0}
    emptyMessage="No lead data available for this period."
  >
    <Box sx={{ position: "relative", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={leadStatusData}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={120}
            paddingAngle={2}
          >
            {leadStatusData.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={leadStatusColors[index % leadStatusColors.length]}
              />
            ))}
          </Pie>

          <RechartsTooltip
            content={
              <ChartTooltip<CountDatum>
                render={(item) => (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      display="block"
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {item.count} leads
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
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Stack alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            {analytics?.leads.totalLeads ?? 0}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Leads
          </Typography>
        </Stack>
      </Box>
    </Box>
  </ChartCard>
</Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <SectionCard>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1.5 }}
                >
                  Lead Summary
                </Typography>

                <Stack spacing={1.5} divider={<Divider />}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Total leads
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={700}
                    >
                      {loading
                        ? "—"
                        : formatCompactNumber(
                            analytics?.leads.totalLeads ?? 0,
                          )}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Observed statuses
                    </Typography>

                    <Typography
                      variant="body2"
                      fontWeight={700}
                    >
                      {loading
                        ? "—"
                        : analytics?.leads.statuses.length ?? 0}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    Status distribution reflects the lead records
                    created during the selected period. It does not
                    imply conversion between statuses.
                  </Typography>
                </Stack>
              </Box>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Activity & Tasks                                               */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Activity & Productivity"
          subtitle="CRM activity and task distribution"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Activity by Type"
              subtitle="Recorded CRM activity during the selected period"
              height={270}
              loading={loading}
              isEmpty={activityData.length === 0}
              emptyMessage="No activity recorded for this period."
            >
              <DistributionChart
                data={activityData}
                valueLabel="activities"
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard
              title="Task Status"
              subtitle="Tasks created during the selected period"
              height={270}
              loading={loading}
              isEmpty={taskStatusData.length === 0}
              emptyMessage="No task data available for this period."
            >
              <DistributionChart
                data={taskStatusData}
                valueLabel="tasks"
              />
            </ChartCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Breakdown Analysis                                              */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Breakdown Analysis"
          subtitle="Compare CRM records across the selected dimension"
        />

        <SectionCard>
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {(() => {
                    const labels: Record<
                      AnalyticsBreakdownDimension,
                      string
                    > = {
                      industry: "Industry",
                      source: "Source",
                      department: "Department",
                      position: "Position",
                      company: "Company",
                      priority: "Priority",
                      status: "Status",
                      assigned_member: "Assigned Member",
                      preferred_contact_time: "Preferred Contact Time",
                      gender: "Gender",
                      social_channel: "Social Channel",
                    };

                    return `By ${labels[breakdownDimension]}`;
                  })()}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Leads, contacts, customers, and closed-won deal activity
                  for the selected period
                </Typography>
              </Box>

              <Chip
                label={
                  loading
                    ? "—"
                    : `${analytics?.breakdown.rows.length ?? 0} groups`
                }
                size="small"
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 1.5 }} />

            {loading ? (
              <Stack spacing={1}>
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    height={42}
                  />
                ))}
              </Stack>
            ) : analytics?.breakdown.available === false ? (
              <EmptyState
                message={
                  analytics.breakdown.reason ??
                  "Breakdown analytics are unavailable."
                }
              />
            ) : analytics?.breakdown.rows.length ? (
              <Box sx={{ overflowX: "auto" }}>
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    minWidth: 760,
                    borderCollapse: "collapse",

                    "& th": {
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "text.secondary",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      px: 1.5,
                      py: 1,
                      whiteSpace: "nowrap",
                    },

                    "& td": {
                      fontSize: 13,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      px: 1.5,
                      py: 1,
                      whiteSpace: "nowrap",
                    },

                    "& tbody tr:hover": {
                      bgcolor: "action.hover",
                    },

                    "& tbody tr:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th>Dimension</th>
                      <th>Leads</th>
                      <th>Contacts</th>
                      <th>Active</th>
                      <th>Customers</th>
                      <th>Won Deals</th>
                      <th>Won Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {analytics.breakdown.rows.map((row) => (
                      <tr key={row.dimension}>
                        <td>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {row.dimension}
                          </Typography>
                        </td>
                        <td>{formatCompactNumber(row.leads)}</td>
                        <td>{formatCompactNumber(row.contacts)}</td>
                        <td>{formatCompactNumber(row.active)}</td>
                        <td>{formatCompactNumber(row.customers)}</td>
                        <td>{formatCompactNumber(row.wonDeals)}</td>
                        <td>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {formatCurrency(row.wonRevenue)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Box>
              </Box>
            ) : (
              <EmptyState message="No breakdown data available for this period." />
            )}
          </Box>
        </SectionCard>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Team Performance                                               */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Team Performance"
          subtitle="Work distribution and pipeline by active member"
        />

        <SectionCard>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <Stack spacing={1}>
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    height={48}
                  />
                ))}
              </Stack>
            </Box>
          ) : teamRows.length === 0 ? (
            <EmptyState message="No team data available." />
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  minWidth: 850,
                  borderCollapse: "collapse",

                  "& th": {
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "text.secondary",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    px: 1.5,
                    py: 1,
                  },

                  "& td": {
                    fontSize: 13,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    px: 1.5,
                    py: 1,
                  },

                  "& tbody tr:hover": {
                    bgcolor: "action.hover",
                  },

                  "& tbody tr:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Leads</th>
                    <th>Contacts</th>
                    <th>Customers</th>
                    <th>Deals</th>
                    <th>Open Deals</th>
                    <th>Pipeline</th>
                    <th>Tasks</th>
                  </tr>
                </thead>

                <tbody>
                  {teamRows.map((member) => (
                    <tr key={member.memberId}>
                      <td>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {member.name}
                        </Typography>
                      </td>

                      <td>{member.leads}</td>
                      <td>{member.contacts}</td>
                      <td>{member.customers}</td>
                      <td>{member.deals}</td>
                      <td>{member.openDeals}</td>

                      <td>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                        >
                          {formatCurrency(
                            member.pipelineValue,
                          )}
                        </Typography>
                      </td>

                      <td>{member.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          )}
        </SectionCard>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* CRM Health                                                     */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="CRM Health"
          subtitle="Current data quality and record state"
        />

        <SectionCard>
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            {loading ? (
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={3}
                rowGap={2}
              >
                {[0, 1, 2, 3, 4].map((item) => (
                  <Skeleton
                    key={item}
                    variant="rounded"
                    width={110}
                    height={48}
                  />
                ))}
              </Stack>
            ) : (
              <Stack
                direction="row"
                flexWrap="wrap"
                spacing={3}
                rowGap={2}
              >
                <HealthMetric
                  label="Total records"
                  value={analytics?.health.totalRecords ?? 0}
                />

                <HealthMetric
                  label="Archived"
                  value={
                    analytics?.health.archivedRecords ?? 0
                  }
                  warning={
                    (analytics?.health.archivedRecords ?? 0) > 0
                  }
                />

                <HealthMetric
                  label="Deleted"
                  value={
                    analytics?.health.deletedRecords ?? 0
                  }
                />

                <HealthMetric
                  label="Missing owner"
                  value={
                    analytics?.health.recordsMissingOwner ?? 0
                  }
                  warning={
                    (analytics?.health.recordsMissingOwner ?? 0) >
                    0
                  }
                />

                <HealthMetric
                  label="Missing contact info"
                  value={
                    analytics?.health.recordsMissingContactInfo ??
                    0
                  }
                  warning={
                    (analytics?.health.recordsMissingContactInfo ??
                      0) > 0
                  }
                />
              </Stack>
            )}
          </Box>
        </SectionCard>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Customer Cohorts                                               */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Customer Cohorts"
          subtitle="Customer acquisition by creation month"
        />

        <ChartCard
          title="Customer Acquisition Cohorts"
          subtitle="Number of customers created in each cohort month"
          height={280}
          loading={loading}
          isEmpty={cohortData.length === 0}
          emptyMessage="No customer cohort data available."
        >
          <CohortChart data={cohortData} />
        </ChartCard>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Advanced Analytics                                            */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3 }}>
        <SectionHeading
          title="Advanced Analytics"
          subtitle="Lifecycle, revenue projection, source attribution, and anomaly signals"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AdvancedCard
              title="Conversion Time"
              subtitle="Completed conversions in the selected period"
              icon={QueryStatsOutlinedIcon}
            >
              {loading ? (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" height={48} />
                  <Skeleton variant="rounded" height={48} />
                </Stack>
              ) : analytics?.conversionTime.available ? (
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Lead conversion
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      spacing={3}
                      rowGap={1.5}
                      sx={{ mt: 0.75 }}
                    >
                      <AdvancedMetric
                        label="Average"
                        value={formatDays(analytics.conversionTime.leads.averageDays)}
                      />
                      <AdvancedMetric
                        label="Median"
                        value={formatDays(analytics.conversionTime.leads.medianDays)}
                      />
                      <AdvancedMetric
                        label="Fastest"
                        value={formatDays(analytics.conversionTime.leads.fastestDays)}
                      />
                      <AdvancedMetric
                        label="Sample"
                        value={formatCompactNumber(analytics.conversionTime.leads.sampleSize)}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Deal conversion to won
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      spacing={3}
                      rowGap={1.5}
                      sx={{ mt: 0.75 }}
                    >
                      <AdvancedMetric
                        label="Average"
                        value={formatDays(analytics.conversionTime.deals.averageDays)}
                      />
                      <AdvancedMetric
                        label="Median"
                        value={formatDays(analytics.conversionTime.deals.medianDays)}
                      />
                      <AdvancedMetric
                        label="Slowest"
                        value={formatDays(analytics.conversionTime.deals.slowestDays)}
                      />
                      <AdvancedMetric
                        label="Sample"
                        value={formatCompactNumber(analytics.conversionTime.deals.sampleSize)}
                      />
                    </Stack>
                  </Box>
                </Stack>
              ) : (
                <EmptyState
                  message={
                    analytics?.conversionTime.reason ??
                    "No completed conversion data is available."
                  }
                />
              )}
            </AdvancedCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <AdvancedCard
              title="Forecasting"
              subtitle="Actual revenue plus weighted open pipeline"
              icon={TrendingUpRoundedIcon}
            >
              {loading ? (
                <Stack spacing={1}>
                  <Skeleton variant="rounded" height={48} />
                  <Skeleton variant="rounded" height={48} />
                </Stack>
              ) : analytics?.forecasting.available ? (
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    spacing={3}
                    rowGap={1.5}
                  >
                    <AdvancedMetric
                      label="Historical"
                      value={formatCurrency(analytics.forecasting.revenue.historical)}
                    />
                    <AdvancedMetric
                      label="Projected"
                      value={formatCurrency(analytics.forecasting.revenue.projected)}
                    />
                    <AdvancedMetric
                      label="Growth"
                      value={formatPercent(analytics.forecasting.revenue.growthRate * 100)}
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    spacing={3}
                    rowGap={1.5}
                  >
                    <AdvancedMetric
                      label="Open pipeline"
                      value={formatCurrency(analytics.forecasting.pipeline.openValue)}
                    />
                    <AdvancedMetric
                      label="Weighted pipeline"
                      value={formatCurrency(analytics.forecasting.pipeline.weightedValue)}
                    />
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    Projection uses the selected-period revenue trend. Pipeline weighting is based on the current deal stage.
                  </Typography>
                </Stack>
              ) : (
                <EmptyState
                  message={
                    analytics?.forecasting.reason ??
                    "No forecast data is available."
                  }
                />
              )}
            </AdvancedCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <AdvancedCard
              title="Attribution"
              subtitle="Lead source through conversion and closed-won revenue"
              icon={AssessmentOutlinedIcon}
            >
              {loading ? (
                <Stack spacing={1}>
                  {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rounded" height={38} />
                  ))}
                </Stack>
              ) : analytics?.attribution.available && analytics.attribution.sources.length ? (
                <Box sx={{ overflowX: "auto" }}>
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      minWidth: 720,
                      borderCollapse: "collapse",
                      "& th": {
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "text.secondary",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        px: 1.25,
                        py: 1,
                        whiteSpace: "nowrap",
                      },
                      "& td": {
                        fontSize: 13,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        px: 1.25,
                        py: 1,
                        whiteSpace: "nowrap",
                      },
                      "& tbody tr:last-child td": { borderBottom: 0 },
                      "& tbody tr:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Leads</th>
                        <th>Converted</th>
                        <th>Conversion rate</th>
                        <th>Won deals</th>
                        <th>Won revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.attribution.sources.map((item) => (
                        <tr key={item.source}>
                          <td>
                            <Typography variant="body2" fontWeight={600}>
                              {item.source}
                            </Typography>
                          </td>
                          <td>{formatCompactNumber(item.leads)}</td>
                          <td>{formatCompactNumber(item.convertedLeads)}</td>
                          <td>{formatPercent(item.conversionRate)}</td>
                          <td>{formatCompactNumber(item.wonDeals)}</td>
                          <td>
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(item.wonRevenue)}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
              ) : (
                <EmptyState
                  message={
                    analytics?.attribution.reason ??
                    "No attributable source data is available."
                  }
                />
              )}
            </AdvancedCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------ */}
      {/* Engagement & Anomalies                                        */}
      {/* ------------------------------------------------------------ */}

      <Box sx={{ mt: 3, pb: 3 }}>
        <SectionHeading
          title="Engagement & Anomalies"
          subtitle="Activity signals and meaningful period-over-period deviations"
        />

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AssessmentOutlinedIcon
                      sx={{ fontSize: 19, color: "primary.main" }}
                    />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Engagement
                    </Typography>
                  </Stack>

                  <Chip
                    label={
                      loading
                        ? "—"
                        : `${analytics?.engagement.totalActivities ?? 0} activities`
                    }
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {loading ? (
                  <Stack spacing={1}>
                    {[0, 1, 2].map((item) => (
                      <Skeleton key={item} variant="rounded" height={32} />
                    ))}
                  </Stack>
                ) : analytics?.engagement.byType.length ? (
                  <Stack spacing={1}>
                    {analytics.engagement.byType.slice(0, 6).map((item) => (
                      <Stack
                        key={item.type}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {getStageLabel(item.type)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.count}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState message="No engagement data available." />
                )}
              </Box>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <QueryStatsOutlinedIcon
                      sx={{ fontSize: 19, color: "primary.main" }}
                    />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Anomaly Detection
                    </Typography>
                  </Stack>

                  <Chip
                    label={
                      loading
                        ? "—"
                        : `${analytics?.anomalies.anomalies.length ?? 0} detected`
                    }
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  Changes of at least 25% against the comparison baseline.
                </Typography>

                <Divider sx={{ my: 1.25 }} />

                {loading ? (
                  <Stack spacing={1}>
                    {[0, 1, 2].map((item) => (
                      <Skeleton key={item} variant="rounded" height={52} />
                    ))}
                  </Stack>
                ) : analytics?.anomalies.available ? (
                  analytics.anomalies.anomalies.length ? (
                    <Stack divider={<Divider />}>
                      {analytics.anomalies.anomalies.map((item) => (
                        <AnomalyRow key={item.metric} {...item} />
                      ))}
                    </Stack>
                  ) : (
                    <EmptyState
                      message={
                        analytics.anomalies.reason ??
                        "No significant anomalies detected."
                      }
                    />
                  )
                ) : (
                  <EmptyState
                    message={
                      analytics?.anomalies.reason ??
                      "Anomaly analytics are unavailable."
                    }
                  />
                )}
              </Box>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;