import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

import type { RootState, AppDispatch } from '../../../store/store';
import {
  fetchDashboardOverview,
  fetchLeadMetrics,
  fetchDealMetrics,
  fetchCustomerMetrics,
  fetchActivityMetrics,
  fetchDashboardTrends,
  fetchRecentDashboardActivities,
  fetchUserPerformanceMetrics,
  clearError,
} from '../../../store/dashboardSlice';
import type { ActivityItem, ActivityType, TrendInterval } from '../../../types/dashboard';
import { useAuth } from '../../../hooks/useAuth';
import type { ProfileIDName } from '../../../types/profile';
import { fetchMembersIDNames } from '../../../store/profileSlice';


const formatCompactNumber = (value: number): string => {
  if (!Number.isFinite(value)) return '0';
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString('en-US');
};

const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) return 'Php0';
  if (Math.abs(value) >= 1_000_000) return `Php${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `Php${(value / 1_000).toFixed(1)}K`;
  return `Php${value.toLocaleString('en-US')}`;
};

const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (label: string): string => {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};


const formatUserLabel = (
  key: string,
  profiles: ProfileIDName[]
): string => {
  if (!key || key === 'Unassigned') return 'Unassigned';

  const user = profiles.find((p) => p.id === key);

  return user?.display_name ?? 'Unknown';
};

const getDaypart = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const toSeries = (
  record: Record<string, number> | undefined
): { date: string; value: number }[] => {
  if (!record) return [];
  return Object.entries(record)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
};

const computeDelta = (series: { date: string; value: number }[]): number | null => {
  if (series.length < 2) return null;
  const last = series[series.length - 1].value;
  const prior = series[series.length - 2].value;
  if (prior === 0) return null;
  return ((last - prior) / prior) * 100;
};

type ChipTone = 'success' | 'warning' | 'error' | 'info' | 'default';

const SUCCESS_KEYWORDS = ['won', 'active', 'completed', 'sent', 'converted', 'closed'];
const WARNING_KEYWORDS = ['pending', 'open', 'in progress', 'proposal', 'negotiation'];
const ERROR_KEYWORDS = ['lost', 'churned', 'overdue', 'failed'];

const statusTone = (status: string | null | undefined): ChipTone => {
  const value = (status ?? '').toLowerCase();
  if (SUCCESS_KEYWORDS.some((k) => value.includes(k))) return 'success';
  if (ERROR_KEYWORDS.some((k) => value.includes(k))) return 'error';
  if (WARNING_KEYWORDS.some((k) => value.includes(k))) return 'warning';
  if (value) return 'info';
  return 'default';
};

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  lead: PersonAddAltOutlinedIcon,
  deal: SellOutlinedIcon,
  customer: GroupsOutlinedIcon,
  email: EmailOutlinedIcon,
  sms: SmsOutlinedIcon,
  call: PhoneOutlinedIcon,
  task: TaskAltOutlinedIcon,
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ py: 6, color: 'text.disabled' }}>
    <InboxOutlinedIcon sx={{ fontSize: 28 }} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Stack>
);

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, action }) => (
  <Stack
    direction="row"
    alignItems="flex-end"
    justifyContent="space-between"
    flexWrap="wrap"
    rowGap={1}
    sx={{ mb: 2 }}
  >
    <Box>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Stack>
);

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  delta?: number | null;
  tooltip?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon: Icon, loading, delta, tooltip }) => {
  const theme = useTheme();

  const content = (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        borderColor: 'divider',
        height: '100%',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          borderColor: theme.palette.grey[400],
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
      </Stack>

      {loading ? (
        <Skeleton variant="text" width="60%" height={36} />
      ) : (
        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
      )}

      {!loading && delta !== null && delta !== undefined && (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.75 }}>
          {delta >= 0 ? (
            <TrendingUpOutlinedIcon sx={{ fontSize: 14 }} color="success" />
          ) : (
            <TrendingDownOutlinedIcon sx={{ fontSize: 14 }} color="error" />
          )}
          <Typography variant="caption" fontWeight={600} color={delta >= 0 ? 'success.main' : 'error.main'}>
            {Math.abs(delta).toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs prior period
          </Typography>
        </Stack>
      )}
    </Paper>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
};

interface ChartPanelProps {
  title: string;
  loading: boolean;
  isEmpty: boolean;
  children: React.ReactNode;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ title, loading, isEmpty, children }) => (
  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'divider', height: '100%' }}>
    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
      {title}
    </Typography>
    {loading ? (
      <Skeleton variant="rounded" height={240} />
    ) : isEmpty ? (
      <EmptyState message="No data for this period yet." />
    ) : (
      children
    )}
  </Paper>
);

interface MetricBarProps {
  label: string;
  value: number;
  display: string;
  loading: boolean;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, display, loading }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {loading ? (
        <Skeleton width={40} />
      ) : (
        <Typography variant="body2" fontWeight={600}>
          {display}
        </Typography>
      )}
    </Stack>
    <LinearProgress
      variant="determinate"
      value={Math.min(100, Math.max(0, value))}
      sx={{
        height: 6,
        borderRadius: 3,
        '& .MuiLinearProgress-bar': { borderRadius: 3 },
      }}
    />
  </Box>
);

interface ActivityListCardProps {
  title: string;
  items: ActivityItem[];
  loading: boolean;
}

const ActivityListCard: React.FC<ActivityListCardProps> = ({ title, items, loading }) => (
  <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', height: '100%' }}>
    <Box sx={{ p: 3, pb: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    {loading ? (
      <Box sx={{ px: 3, pb: 3 }}>
        <Stack spacing={1.5}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={44} />
          ))}
        </Stack>
      </Box>
    ) : items.length === 0 ? (
      <Box sx={{ pb: 3 }}>
        <EmptyState message="Nothing here yet." />
      </Box>
    ) : (
      <List disablePadding sx={{ pb: 1 }}>
        {items.map((item, idx) => {
          const Icon = ACTIVITY_ICONS[item.type] ?? InboxOutlinedIcon;
          const tone = statusTone(item.description);
          return (
            <React.Fragment key={item.id}>
              <ListItem sx={{ px: 3, py: 1.25, gap: 1 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <Icon sx={{ fontSize: 16 }} />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {item.title}
                    </Typography>
                  }
                  secondary={formatRelativeTime(item.createdAt)}
                  secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                />
                {item.description && (
                  <Chip
                    label={item.description}
                    size="small"
                    color={tone === 'default' ? undefined : tone}
                    variant="outlined"
                    sx={{ height: 22, fontSize: 11, textTransform: 'capitalize', flexShrink: 0 }}
                  />
                )}
              </ListItem>
              {idx < items.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
            </React.Fragment>
          );
        })}
      </List>
    )}
  </Paper>
);



const Dashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

   const userName =
    user?.display_name ||
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
    'there';

  const orgName = user?.org?.name ?? 'your organization';

  const {
    overview,
    leadMetrics,
    dealMetrics,
    customerMetrics,
    activityMetrics,
    trends,
    recentActivities,
    userPerformance,
    loading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  const [trendInterval, setTrendInterval] = useState<TrendInterval>('day');

  const loadAll = useCallback(() => {
    dispatch(fetchDashboardOverview());
    dispatch(fetchLeadMetrics());
    dispatch(fetchDealMetrics());
    dispatch(fetchCustomerMetrics());
    dispatch(fetchActivityMetrics());
    dispatch(fetchDashboardTrends({ interval: trendInterval, daysBack: 30 }));
    dispatch(fetchRecentDashboardActivities(12));
    dispatch(fetchUserPerformanceMetrics());
    
  }, [dispatch, trendInterval]);

  const { items: profiles, loaded, loading: pL} = useSelector((state:RootState) => state.profile);

  const loadProfiles = useCallback(() => {
    if (!loaded && !pL) {
      dispatch(fetchMembersIDNames());
    }
  }, [dispatch, loaded, pL]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleIntervalChange = (_event: React.MouseEvent<HTMLElement>, next: TrendInterval | null) => {
    if (!next) return;
    setTrendInterval(next);
    dispatch(fetchDashboardTrends({ interval: next, daysBack: 30 }));
  };

  const handleExport = useCallback(() => {
    if (!overview) return;
    const rows: string[][] = [
      ['Metric', 'Value'],
      ['Total Leads', String(overview.totalLeads)],
      ['Contacts', String(overview.totalContacts)],
      ['Deals', String(overview.totalDeals)],
      ['Customers', String(overview.totalCustomers)],
      ['Revenue', String(dealMetrics?.totalRevenue ?? 0)],
      ['Open Tasks', String(activityMetrics?.tasksPending ?? 0)],
      ['Calls', String(overview.totalCalls)],
      ['Emails', String(overview.totalEmails)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [overview, dealMetrics, activityMetrics]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const revenueSeries = useMemo(() => toSeries(trends?.revenueOverTime), [trends]);
  const leadSeries = useMemo(() => toSeries(trends?.leadsCreated), [trends]);
  const customerSeries = useMemo(() => toSeries(trends?.customerGrowth), [trends]);
  const dealStageData = useMemo(
    () => Object.entries(dealMetrics?.dealsByStage ?? {}).map(([stage, count]) => ({ stage, count })),
    [dealMetrics]
  );

  const revenueDelta = useMemo(() => computeDelta(revenueSeries), [revenueSeries]);
  const leadDelta = useMemo(() => computeDelta(leadSeries), [leadSeries]);
  const customerDelta = useMemo(() => computeDelta(customerSeries), [customerSeries]);

  const recentTasks = useMemo(() => recentActivities.filter((a) => a.type === 'task').slice(0, 6), [
    recentActivities,
  ]);
  const recentDeals = useMemo(() => recentActivities.filter((a) => a.type === 'deal').slice(0, 6), [
    recentActivities,
  ]);

  const leaderboard = useMemo(() => {
    if (!userPerformance) return [];

    const keys = new Set<string>([
      ...Object.keys(userPerformance.leadsPerUser),
      ...Object.keys(userPerformance.dealsClosedPerUser),
      ...Object.keys(userPerformance.tasksCompletedPerUser),
      ...Object.keys(userPerformance.callsCompletedPerUser),
    ]);

    return Array.from(keys)
      .map((key) => ({
        key,
        label: formatUserLabel(key, profiles),
        leads: userPerformance.leadsPerUser[key] ?? 0,
        dealsClosed: userPerformance.dealsClosedPerUser[key] ?? 0,
        tasksCompleted: userPerformance.tasksCompletedPerUser[key] ?? 0,
        callsCompleted: userPerformance.callsCompletedPerUser[key] ?? 0,
      }))
      .sort((a, b) => b.dealsClosed - a.dealsClosed || b.leads - a.leads);

  }, [userPerformance, profiles]);

  const topPerformer = leaderboard[0];

  const kpis: KpiCardProps[] = [
    {
      label: 'Total Leads',
      value: overview ? formatCompactNumber(overview.totalLeads) : '—',
      icon: PersonAddAltOutlinedIcon,
      loading: loading.overview,
      delta: leadDelta,
    },
    {
      label: 'Contacts',
      value: overview ? formatCompactNumber(overview.totalContacts) : '—',
      icon: PeopleAltOutlinedIcon,
      loading: loading.overview,
    },
    {
      label: 'Deals',
      value: overview ? formatCompactNumber(overview.totalDeals) : '—',
      icon: SellOutlinedIcon,
      loading: loading.overview,
      tooltip: dealMetrics
        ? `${dealMetrics.openDeals} open · ${dealMetrics.wonDeals} won · ${dealMetrics.lostDeals} lost`
        : undefined,
    },
    {
      label: 'Customers',
      value: overview ? formatCompactNumber(overview.totalCustomers) : '—',
      icon: GroupsOutlinedIcon,
      loading: loading.overview,
      delta: customerDelta,
      tooltip: customerMetrics
        ? `${customerMetrics.activeCustomers} active · ${customerMetrics.churnedCustomers} churned`
        : undefined,
    },
    {
      label: 'Revenue',
      value: dealMetrics ? formatCurrency(dealMetrics.totalRevenue) : '—',
      icon: AttachMoneyOutlinedIcon,
      loading: loading.deals,
      delta: revenueDelta,
    },
    {
      label: 'Open Tasks',
      value: activityMetrics ? formatCompactNumber(activityMetrics.tasksPending) : '—',
      icon: TaskAltOutlinedIcon,
      loading: loading.activity,
      tooltip: activityMetrics ? `${activityMetrics.tasksOverdue} overdue` : undefined,
    },
    {
      label: 'Calls',
      value: overview ? formatCompactNumber(overview.totalCalls) : '—',
      icon: PhoneOutlinedIcon,
      loading: loading.overview,
    },
    {
      label: 'Emails',
      value: overview ? formatCompactNumber(overview.totalEmails) : '—',
      icon: EmailOutlinedIcon,
      loading: loading.overview,
    },
  ];

  console.log("trends", trends);
console.log("revenueOverTime", trends?.revenueOverTime);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 },pt: 0, }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
            Good {getDaypart()}, {userName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.5 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {today} · {orgName}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExport}
            disabled={!overview}
            sx={{ borderColor: 'divider', color: 'text.primary' }}
          >
            Export
          </Button>
          <Tooltip title="Refresh dashboard data">
            <IconButton
              size="small"
              onClick={loadAll}
              aria-label="Refresh dashboard data"
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
            >
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {kpis.map((kpi) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={kpi.label}
          >
            <KpiCard {...kpi} />
          </Grid>
        ))}
      </Grid>

      <SectionHeading
        title="Analytics"
        subtitle="Trends across your pipeline over time"
        action={
          <ToggleButtonGroup
            size="small"
            exclusive
            value={trendInterval}
            onChange={handleIntervalChange}
            aria-label="Trend interval"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 1.75,
                py: 0.5,
                borderColor: 'divider',
              },
            }}
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartPanel title="Revenue Trend" loading={loading.trends} isEmpty={revenueSeries.length === 0}>
            <LineChart
              dataset={revenueSeries}
              xAxis={[{ dataKey: 'date', scaleType: 'point', tickLabelStyle: { fontSize: 11 } }]}
              series={[
                {
                  dataKey: 'value',
                  color: theme.palette.primary.main,
                  showMark: false,
                  curve: 'monotoneX',
                  valueFormatter: (v) => formatCurrency(Number(v ?? 0)),
                },
              ]}
              height={260}
              margin={{ left: 56, right: 16, top: 16, bottom: 32 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  sx: {
                    display: "none",
                  },
                },
              }}
            />
          </ChartPanel>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartPanel title="Lead Growth" loading={loading.trends} isEmpty={leadSeries.length === 0}>
            <LineChart
              dataset={leadSeries}
              xAxis={[{ dataKey: 'date', scaleType: 'point', tickLabelStyle: { fontSize: 11 } }]}
              series={[
                {
                  dataKey: 'value',
                  color: theme.palette.grey[700],
                  showMark: false,
                  curve: 'monotoneX',
                  area: true,
                },
              ]}
              height={260}
              margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  sx: {
                    display: "none",
                  },
                },
              }}
              sx={{ '& .MuiAreaElement-root': { fillOpacity: 0.08 } }}
            />
          </ChartPanel>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartPanel title="Deal Pipeline" loading={loading.deals} isEmpty={dealStageData.length === 0}>
            <BarChart
              dataset={dealStageData}
              xAxis={[{ dataKey: 'stage', scaleType: 'band', tickLabelStyle: { fontSize: 11 } }]}
              series={[{ dataKey: 'count', color: theme.palette.primary.main }]}
              height={260}
              margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  sx: {
                    display: "none",
                  },
                },
              }}
              borderRadius={4}
            />
          </ChartPanel>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ChartPanel title="Customer Growth" loading={loading.trends} isEmpty={customerSeries.length === 0}>
            <LineChart
              dataset={customerSeries}
              xAxis={[{ dataKey: 'date', scaleType: 'point', tickLabelStyle: { fontSize: 11 } }]}
              series={[
                {
                  dataKey: 'value',
                  color: theme.palette.info.main,
                  showMark: false,
                  curve: 'monotoneX',
                },
              ]}
              height={260}
              margin={{ left: 40, right: 16, top: 16, bottom: 32 }}
              grid={{ horizontal: true }}
              slotProps={{
                legend: {
                  sx: {
                    display: "none",
                  },
                },
              }}
            />
          </ChartPanel>
        </Grid>
      </Grid>

      <SectionHeading title="Activity" subtitle="What's happening across your organization" />
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ActivityListCard
            title="Recent Activities"
            items={recentActivities.slice(0, 6)}
            loading={loading.recentActivities}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ActivityListCard title="Recent Tasks" items={recentTasks} loading={loading.recentActivities} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ActivityListCard title="Recent Deals" items={recentDeals} loading={loading.recentActivities} />
        </Grid>
      </Grid>

      <SectionHeading title="Performance" subtitle="Team output and conversion health" />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider', overflow: 'hidden' }}>
            <Box sx={{ p: 3, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Team Leaderboard
              </Typography>
            </Box>
            {loading.performance ? (
              <Box sx={{ px: 3, pb: 3 }}>
                <Skeleton variant="rounded" height={220} />
              </Box>
            ) : leaderboard.length === 0 ? (
              <Box sx={{ px: 3, pb: 4 }}>
                <EmptyState message="No performance data yet." />
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 340 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rep</TableCell>
                      <TableCell align="right">Leads</TableCell>
                      <TableCell align="right">Deals Closed</TableCell>
                      <TableCell align="right">Tasks Done</TableCell>
                      <TableCell align="right">Calls</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((row) => (
                      <TableRow key={row.key} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1.25}>
                            <Avatar
                              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'grey.200', color: 'text.primary' }}
                            >
                              {getInitials(row.label)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {row.label}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">{row.leads}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {row.dealsClosed}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.tasksCompleted}</TableCell>
                        <TableCell align="right">{row.callsCompleted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 8, md: 5 }}>
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Top Performer
              </Typography>
              {loading.performance ? (
                <Skeleton variant="rounded" height={72} />
              ) : topPerformer ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 44, height: 44, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    {getInitials(topPerformer.label)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {topPerformer.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {topPerformer.dealsClosed} deals closed
                    </Typography>
                  </Box>
                  <EmojiEventsOutlinedIcon sx={{ color: 'warning.main', fontSize: 26 }} />
                </Stack>
              ) : (
                <EmptyState message="No leaderboard data yet." />
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Conversion Metrics
              </Typography>
              <Stack spacing={2.5}>
                <MetricBar
                  label="Lead Conversion"
                  value={leadMetrics?.conversionRate ?? 0}
                  display={leadMetrics ? formatPercent(leadMetrics.conversionRate) : '—'}
                  loading={loading.leads}
                />
                <MetricBar
                  label="Deal Win Rate"
                  value={dealMetrics?.winRate ?? 0}
                  display={dealMetrics ? formatPercent(dealMetrics.winRate) : '—'}
                  loading={loading.deals}
                />
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Average Deal Size
                  </Typography>
                  {loading.deals ? (
                    <Skeleton width={60} />
                  ) : (
                    <Typography variant="body2" fontWeight={600}>
                      {dealMetrics ? formatCurrency(dealMetrics.averageDealSize) : '—'}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;