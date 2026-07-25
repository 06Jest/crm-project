import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store/store';
// import { fetchActivities } from '../../../store/activitiesSlice';
// import { useAI } from '../../../hooks/useAI';
// import AIInsightCard from '../../../components/AIInsightCard';
// import { aiApi } from '../../../services/backendApi';

import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Chip, Avatar,
  List, ListItem, ListItemAvatar, ListItemText,
  Divider, Button, ToggleButton, ToggleButtonGroup,
  Tabs, Tab, Stack,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
// import PhoneIcon from '@mui/icons-material/Phone';
// import EmailIcon from '@mui/icons-material/Email';
// import EventIcon from '@mui/icons-material/Event';
// import NoteIcon from '@mui/icons-material/Note';
// import SmsIcon from '@mui/icons-material/Sms';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScheduleIcon from '@mui/icons-material/Schedule';
// import AcUnitIcon from '@mui/icons-material/AcUnit';
import EventBusyIcon from '@mui/icons-material/EventBusy';

import { Bar, Line } from 'react-chartjs-2';
// import { Doughnut } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import { formatCurrency } from '../../../utils/dateFilters';
import { CHART_COLORS, CHART_COLORS_ALPHA } from '../../../utils/chartColors';
import { fetchContactsLists } from '../../../store/contactsSlice';
import { fetchLeadsLists } from '../../../store/leadsSlice';
import { fetchDealsLists } from '../../../store/dealsSlice';
import { fetchCustomersLists } from '../../../store/customersSlice';
import { DEAL_STAGES } from '../../../types/deal';
import { formatName } from '../../../utils/formatText';



// ---------- static config ----------

// const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
//   call: <PhoneIcon fontSize="small" />,
//   email: <EmailIcon fontSize="small" />,
//   meeting: <EventIcon fontSize="small" />,
//   note: <NoteIcon fontSize="small" />,
//   sms: <SmsIcon fontSize="small" />,
// };

// const ACTIVITY_COLORS: Record<string, string> = {
//   call: CHART_COLORS.blue,
//   email: CHART_COLORS.purple,
//   meeting: CHART_COLORS.orange,
//   note: CHART_COLORS.green,
//   sms: CHART_COLORS.teal,
// };

const STAGE_COLORS: Record<string, string> = {
  Prospecting: CHART_COLORS.blue,
  Proposal: CHART_COLORS.orange,
  Negotiation: CHART_COLORS.purple,
  'Closed Won': CHART_COLORS.green,
  'Closed Lost': CHART_COLORS.red,
};

type RangeKey = 'week' | 'month' | 'quarter' | 'year';

const RANGE_DAYS: Record<RangeKey, number> = {
  week: 7,
  month: 30,
  quarter: 90,
  year: 365,
};

const RANGE_LABELS: Record<RangeKey, string> = {
  week: 'This week',
  month: 'This month',
  quarter: 'This quarter',
  year: 'This year',
};

// ---------- small reusable pieces ----------

function TrendChip({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return null;

  const diff = current - previous;
  const pct = previous === 0 ? 100 : Math.round((diff / previous) * 100);
  const isFlat = diff === 0;
  const isUp = diff > 0;
  
  const color = isFlat ? 'text.secondary' : isUp ? 'success.main' : 'error.main';
  const Icon = isFlat ? TrendingFlatIcon : isUp ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color, mt: 0.5 }}>
      <Icon sx={{ fontSize: 14 }} />
      <Typography variant="caption" fontWeight={700}>
        {isFlat ? 'No change' : `${isUp ? '+' : ''}${pct}%`}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        vs prior period
      </Typography>
    </Stack>
  );
}

function StatCard({
  title, value, icon, color, subtitle, trend, onClick,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: { current: number; previous: number };
  onClick?: () => void;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': onClick ? { boxShadow: 3, transform: 'translateY(-2px)' } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} noWrap>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && <TrendChip current={trend.current} previous={trend.previous} />}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SectionTitle({
  title, action, onAction, icon,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {icon}
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
      </Stack>
      {action && onAction && (
        <Button size="small" onClick={onAction}>{action}</Button>
      )}
    </Box>
  );
}

function QuickActionButton({
  label, icon, onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={icon}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        borderColor: 'divider',
        color: 'text.primary',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
      }}
    >
      {label}
    </Button>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: contacts, loading: cL, error: cE, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loading: lL, loaded:lLd } = useSelector((s: RootState) => s.leads);
  const { items: deals, loading: dL, loaded: dLd } = useSelector((s: RootState) => s.deals);
  // const { items: activities, loading: aL } = useSelector((s: RootState) => s.activities);
  const { items: customers, loading: cuL, loaded: cuLd } = useSelector((s: RootState) => s.customers);
  // const { unreadCounts } = useSelector((s: RootState) => s.messaging);

  const [range, setRange] = useState<RangeKey>('month');
  const [attentionTab, setAttentionTab] = useState(0);

  const needsLoading = !cLd || !lLd || !dLd || !cuLd;

  useEffect(() => {
  if (!needsLoading) return;

  const loadData = async () => {
    const requests = [];

    if (!cLd) requests.push(dispatch(fetchContactsLists()).unwrap());
    if (!lLd) requests.push(dispatch(fetchLeadsLists()).unwrap());
    if (!dLd) requests.push(dispatch(fetchDealsLists()).unwrap());
    if (!cuLd) requests.push(dispatch(fetchCustomersLists()).unwrap());

    await Promise.all(requests);
  };

  loadData();
}, [
  dispatch,
  cLd,
  lLd,
  dLd,
  cuLd,
  needsLoading
]);

  const isLoading = cL || lL || dL || cuL;

  // const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // ---------- period boundaries ----------
    const { periodStart, prevStart } = useMemo(() => {
    const days = RANGE_DAYS[range];
    const now = new Date();

    const periodStart = new Date(now.getTime() - days * 86400000);
    const prevStart = new Date(now.getTime() - days * 2 * 86400000);

    return { periodStart, prevStart };
  }, [range]);

  const inRange = (dateStr?: string, from?: Date, to?: Date) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (from && d < from) return false;
    if (to && d >= to) return false;
    return true;
  };

  // ---------- deals ----------
  const wonDeals = useMemo(() => deals.filter((d) => d.stage === 'Closed Won'), [deals]);
  const lostDeals = useMemo(() => deals.filter((d) => d.stage === 'Closed Lost'), [deals]);
  const openDeals = useMemo(
    () => deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'),
    [deals]
  );

  const openPipelineValue = useMemo(
    () => openDeals.reduce((s, d) => s + d.value, 0),
    [openDeals]
  );

  const winRate = useMemo(() => {
    const decided = wonDeals.length + lostDeals.length;
    if (decided === 0) return 0;
    return Math.round((wonDeals.length / decided) * 100);
  }, [wonDeals, lostDeals]);

  const avgDealSize = useMemo(() => {
    if (wonDeals.length === 0) return 0;
    return wonDeals.reduce((s, d) => s + d.value, 0) / wonDeals.length;
  }, [wonDeals]);

  const wonRevenueCurrent = useMemo(
    () => wonDeals.filter((d) => inRange(d.created_at, periodStart)).reduce((s, d) => s + d.value, 0),
    [wonDeals, periodStart]
  );
  const wonRevenuePrevious = useMemo(
    () => wonDeals.filter((d) => inRange(d.created_at, prevStart, periodStart)).reduce((s, d) => s + d.value, 0),
    [wonDeals, prevStart, periodStart]
  );

  // ---------- leads ----------
  const activeLeads = leads.filter((l) => l.status !== 'Closed').length;
  const closedLeads = leads.filter((l) => l.status === 'Closed').length;

  const leadsCurrentCount = useMemo(
    () => leads.filter((l) => inRange(l.created_at, periodStart)).length,
    [leads, periodStart]
  );
  const leadsPreviousCount = useMemo(
    () => leads.filter((l) => inRange(l.created_at, prevStart, periodStart)).length,
    [leads, prevStart, periodStart]
  );

  // const leadStatusCounts = useMemo(() => ({
  //   New: leads.filter((l) => l.status === 'New').length,
  //   Contacted: leads.filter((l) => l.status === 'Contacted').length,
  //   Qualified: leads.filter((l) => l.status === 'Qualified').length,
  //   Closed: leads.filter((l) => l.status === 'Closed').length,
  // }), [leads]);

  // ---------- contacts ----------
  const contactsCurrentCount = useMemo(
    () => contacts.filter((c) => inRange(c.created_at, periodStart)).length,
    [contacts, periodStart]
  );
  const contactsPreviousCount = useMemo(
    () => contacts.filter((c) => inRange(c.created_at, prevStart, periodStart)).length,
    [contacts, prevStart, periodStart]
  );

  const coldContacts = contacts.filter((c) => c.status === 'Lost');

  // ---------- activities ----------
  // const activityTypeCounts = useMemo(() => ({
  //   call: activities.filter((a) => a.type === 'call').length,
  //   email: activities.filter((a) => a.type === 'email').length,
  //   meeting: activities.filter((a) => a.type === 'meeting').length,
  //   note: activities.filter((a) => a.type === 'note').length,
  //   sms: activities.filter((a) => a.type === 'sms').length,
  // }), [activities]);

  // const activitiesCurrentCount = useMemo(
  //   () => activities.filter((a) => inRange(a.created_at, periodStart)).length,
  //   [activities, periodStart]
  // );
  // const activitiesPreviousCount = useMemo(
  //   () => activities.filter((a) => inRange(a.created_at, prevStart, periodStart)).length,
  //   [activities, prevStart, periodStart]
  // );

  // const recentActivities = useMemo(
  //   () => [...activities]
  //     .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
  //     .slice(0, 8),
  //   [activities]
  // );

  // ---------- pipeline by stage (value) ----------
  const dealStageValues = useMemo(() => {
    const map: Record<string, number> = {};
    DEAL_STAGES.forEach((s) => { map[s] = 0; });
    deals.forEach((d) => { if (d.stage in map) map[d.stage] += d.value; });
    return map;
  }, [deals]);

  const dealStageCounts = useMemo(() => {
    const map: Record<string, number> = {};
    DEAL_STAGES.forEach((s) => { map[s] = 0; });
    deals.forEach((d) => { if (d.stage in map) map[d.stage] += 1; });
    return map;
  }, [deals]);

  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[key] = 0;
    }
    wonDeals.forEach((deal) => {
      if (!deal.created_at) return;
      const key = new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (key in months) months[key] += deal.value;
    });
    return months;
  }, [wonDeals]);

  // ---------- needs attention ----------
  // const coldContacts = useMemo(() => {
  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  //   return contacts.filter((contact) => {
  //     const lastActivity = activities
  //       .filter((a) => a.contact_name === contact.name)
  //       .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0];

  //     if (!lastActivity) return true;
  //     return new Date(lastActivity.created_at || '') < thirtyDaysAgo;
  //   }).slice(0, 8);
  // }, [contacts, activities]);

  const overdueDeals = useMemo(() => {
    const today = new Date();
    return deals
      .filter((d) => {
        if (d.stage === 'Closed Won' || d.stage === 'Closed Lost') return false;
        if (!d.close_date) return false;
        return new Date(d.close_date) < today;
      })
      .sort((a, b) => new Date(a.close_date!).getTime() - new Date(b.close_date!).getTime())
      .slice(0, 8);
  }, [deals]);

  const dealsThisWeek = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return deals
      .filter((d) => {
        if (!d.close_date) return false;
        if (d.stage === 'Closed Won' || d.stage === 'Closed Lost') return false;
        const closeDate = new Date(d.close_date);
        return closeDate >= today && closeDate <= nextWeek;
      })
      .slice(0, 8);
  }, [deals]);

  const recentContacts = contacts.slice(0, 5);

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(128,128,128,0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
};

  // const {
  //   result: aiSummary,
  //   loading: aiLoading,
  //   error: aiError,
  //   generate: generateSummary,
  //   clear: clearSummary,
  // } = useAI(aiApi.getDashboardSummary);

  // const handleGenerateSummary = useCallback(() => {
  //   generateSummary({
  //     totalContacts: contacts.length,
  //     totalLeads: leads.length,
  //     totalDeals: deals.length,
  //     wonRevenue: wonRevenueCurrent,
  //     winRate,
  //     recentActivities: activitiesCurrentCount,
  //     coldContacts: coldContacts.length,
  //     overdueDeals: overdueDeals.length,
  //     topCustomer: customers[0]?.name,
  //   });
  // }, [contacts, leads, deals, wonRevenueCurrent, winRate, activitiesCurrentCount, coldContacts, overdueDeals, customers, generateSummary]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {cE && <Alert severity="error" sx={{ mb: 2 }}>{cE}</Alert>}

      {/* header row: title + range filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          Dashboard
        </Typography>
        <ToggleButtonGroup
          value={range}
          exclusive
          size="small"
          onChange={(_, val) => val && setRange(val)}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="quarter">Quarter</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* quick actions */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 0.5 }}>
        <QuickActionButton label="New Contact" icon={<PersonAddAlt1Icon fontSize="small" />} onClick={() => navigate('/app/contacts')} />
        <QuickActionButton label="New Lead" icon={<FiberNewIcon fontSize="small" />} onClick={() => navigate('/app/leads')} />
        <QuickActionButton label="New Deal" icon={<HandshakeIcon fontSize="small" />} onClick={() => navigate('/app/deals')} />
        <QuickActionButton label="Log Activity" icon={<AddTaskIcon fontSize="small" />} onClick={() => navigate('/app/activities')} />
      </Stack>

      {/* <Box sx={{ mb: 3 }}>
        <AIInsightCard
          title="Daily CRM Summary"
          result={aiSummary}
          loading={aiLoading}
          error={aiError}
          onGenerate={handleGenerateSummary}
          onClear={clearSummary}
          buttonLabel="✨ Generate AI summary"
        />
      </Box> */}

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Total contacts"
            value={contacts.length}
            icon={<PeopleIcon />}
            color={CHART_COLORS.blue}
            subtitle={RANGE_LABELS[range]}
            trend={{ current: contactsCurrentCount, previous: contactsPreviousCount }}
            onClick={() => navigate('/app/contacts')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Active leads"
            value={activeLeads}
            icon={<TrendingUpIcon />}
            color={CHART_COLORS.purple}
            subtitle={`${closedLeads} closed all-time`}
            trend={{ current: leadsCurrentCount, previous: leadsPreviousCount }}
            onClick={() => navigate('/app/leads')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Win rate"
            value={`${winRate}%`}
            icon={<EmojiEventsIcon />}
            color={CHART_COLORS.amber}
            subtitle={`${wonDeals.length} won · ${lostDeals.length} lost`}
            onClick={() => navigate('/app/deals')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Open pipeline"
            value={formatCurrency(openPipelineValue)}
            icon={<AttachMoneyIcon />}
            color={CHART_COLORS.teal}
            subtitle={`${openDeals.length} active deals`}
            onClick={() => navigate('/app/deals')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title={`Won · ${RANGE_LABELS[range]}`}
            value={formatCurrency(wonRevenueCurrent)}
            icon={<CheckCircleIcon />}
            color={CHART_COLORS.green}
            trend={{ current: wonRevenueCurrent, previous: wonRevenuePrevious }}
            onClick={() => navigate('/app/deals')}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Avg deal size"
            value={formatCurrency(avgDealSize)}
            icon={<HandshakeIcon />}
            color={CHART_COLORS.purple}
            subtitle="Based on won deals"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Customers"
            value={customers.length}
            icon={<BusinessIcon />}
            color={CHART_COLORS.orange}
            onClick={() => navigate('/app/customers')}
          />
        </Grid>
        {/* <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <StatCard
            title="Unread messages"
            value={totalUnread}
            icon={<SmsIcon />}
            color={totalUnread > 0 ? CHART_COLORS.red : CHART_COLORS.blue}
            subtitle="From team members"
            onClick={() => navigate('/app/messages')}
          />
        </Grid> */}
      </Grid>

      {/* charts row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Pipeline by stage
              </Typography>
              <Box sx={{ height: 220 }}>
                <Bar
                  data={{
                    labels:[...DEAL_STAGES],
                    datasets: [{
                      label: 'Value',
                      data: DEAL_STAGES.map((s) => dealStageValues[s]),
                      backgroundColor: DEAL_STAGES.map((s) => STAGE_COLORS[s]),
                      borderRadius: 6,
                      borderSkipped: false,
                    }],
                  }}
                  options={{
                    ...baseOptions,
                    scales: {
                      ...baseOptions.scales,
                      y: {
                        ...baseOptions.scales.y,
                        ticks: {
                          callback: (val) => formatCurrency(Number(val)),
                        },
                      },
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx: TooltipItem<'bar'>) => {
                            const stage = DEAL_STAGES[ctx.dataIndex];
                            return ` ${formatCurrency(ctx.parsed.y as number)} · ${dealStageCounts[stage]} deal(s)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                {DEAL_STAGES.map((s) => (
                  <Chip
                    key={s}
                    label={`${s}: ${dealStageCounts[s]}`}
                    size="small"
                    sx={{ bgcolor: STAGE_COLORS[s], color: 'white', fontSize: 10 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Revenue (6 months)
              </Typography>
              <Box sx={{ height: 220 }}>
                <Line
                  data={{
                    labels: Object.keys(revenueByMonth),
                    datasets: [{
                      label: 'Revenue',
                      data: Object.values(revenueByMonth),
                      borderColor: CHART_COLORS.green,
                      backgroundColor: CHART_COLORS_ALPHA.green,
                      tension: 0.3,
                      fill: true,
                      pointRadius: 4,
                    }],
                  }}
                  options={{
                    ...baseOptions,
                    plugins: {
                      ...baseOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: (ctx: TooltipItem<'line'>) => ` ${formatCurrency(ctx.parsed.y as number)}`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Activity mix
              </Typography>
              {/* <Box sx={{ maxWidth: 200, mx: 'auto' }}>
                <Doughnut
                  data={{
                    labels: ['Call', 'Email', 'Meeting', 'Note', 'SMS'],
                    datasets: [{
                      data: Object.values(activityTypeCounts),
                      backgroundColor: Object.values(ACTIVITY_COLORS),
                      borderWidth: 0,
                      hoverOffset: 8,
                    }],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                        labels: { padding: 10, usePointStyle: true, font: { size: 10 } },
                      },
                    },
                    cutout: '60%',
                  }}
                />
              </Box> */}
              {/* <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                {activitiesCurrentCount} logged {RANGE_LABELS[range].toLowerCase()}
              </Typography> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* needs attention + recent activities */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle title="Needs attention" icon={<WarningIcon sx={{ color: 'warning.main' }} fontSize="small" />} />

              <Tabs
                value={attentionTab}
                onChange={(_, v) => setAttentionTab(v)}
                variant="fullWidth"
                sx={{ mb: 1, minHeight: 36, '& .MuiTab-root': { minHeight: 36, fontSize: 12, textTransform: 'none' } }}
              >
                <Tab label={`Overdue (${overdueDeals.length})`} icon={<EventBusyIcon fontSize="small" />} iconPosition="start" />
                {/* <Tab label={`Cold (${coldContacts.length})`} icon={<AcUnitIcon fontSize="small" />} iconPosition="start" /> */}
                <Tab label={`Closing soon (${dealsThisWeek.length})`} icon={<ScheduleIcon fontSize="small" />} iconPosition="start" />
              </Tabs>

              {attentionTab === 0 && (
                overdueDeals.length === 0 ? (
                  <EmptyState text="No overdue deals. Nice." />
                ) : (
                  <List disablePadding>
                    {overdueDeals.map((deal, i) => (
                      <Box key={deal.id}>
                        <ListItem
                          disablePadding
                          sx={{ py: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                          onClick={() => navigate('/app/deals')}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: CHART_COLORS.red, width: 36, height: 36 }}>
                              <EventBusyIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600} noWrap>{deal.title}</Typography>}
                            secondary={
                              <Typography variant="caption" color="error.main">
                                Was due {new Date(deal.close_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            }
                          />
                          <Typography variant="body2" fontWeight={700}>{formatCurrency(deal.value)}</Typography>
                        </ListItem>
                        {i < overdueDeals.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )
              )}

              {attentionTab === 1 && (
                coldContacts.length === 0 ? (
                  <EmptyState text="All contacts are warm. Great work." />
                ) : (
                  <List disablePadding>
                    {coldContacts.map((contact, i) => (
                      <Box key={contact.id}>
                        <ListItem
                          disablePadding
                          sx={{ py: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                          onClick={() => navigate(`/app/contacts/${contact.id}`)}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'warning.main', width: 36, height: 36, fontSize: 14 }}>
                              {formatName(contact.first_name, contact.last_name)} {contact.suffix}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600}>{formatName(contact.first_name, contact.last_name)} {contact.suffix}</Typography>}
                            secondary={<Typography variant="caption" color="text.secondary">{contact.email}</Typography>}
                          />
                        </ListItem>
                        {i < coldContacts.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )
              )}

              {attentionTab === 2 && (
                dealsThisWeek.length === 0 ? (
                  <EmptyState text="No deals closing in the next 7 days." />
                ) : (
                  <List disablePadding>
                    {dealsThisWeek.map((deal, i) => (
                      <Box key={deal.id}>
                        <ListItem
                          disablePadding
                          sx={{ py: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                          onClick={() => navigate('/app/deals')}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: CHART_COLORS.teal, width: 36, height: 36 }}>
                              <CalendarTodayIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="body2" fontWeight={600} noWrap>{deal.title}</Typography>}
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                Closes {new Date(deal.close_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            }
                          />
                          <Typography variant="body2" fontWeight={700} color="success.main">
                            {formatCurrency(deal.value)}
                          </Typography>
                        </ListItem>
                        {i < dealsThisWeek.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>

            meow meow
            {/* <CardContent>
              <SectionTitle title="Recent activities" action="View all" onAction={() => navigate('/app/activities')} />
              {recentActivities.length === 0 ? (
                <EmptyState text="No activities yet. Log your first one!" />
              ) : (
                <List disablePadding>
                  {recentActivities.map((activity, i) => (
                    <Box key={activity.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: ACTIVITY_COLORS[activity.type] || CHART_COLORS.blue }}>
                            {ACTIVITY_ICONS[activity.type]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={600} noWrap>{activity.subject}</Typography>}
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.contact_name && `${activity.contact_name} · `}
                              {activity.created_at
                                ? new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : '—'}
                            </Typography>
                          }
                        />
                        <Chip
                          label={activity.type}
                          size="small"
                          sx={{ bgcolor: ACTIVITY_COLORS[activity.type], color: 'white', fontSize: 10, height: 20 }}
                        />
                      </ListItem>
                      {i < recentActivities.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent> */}
          </Card>
        </Grid>
      </Grid>

      {/* recent contacts */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle title="Recent contacts" action="View all" onAction={() => navigate('/app/contacts')} />
              {recentContacts.length === 0 ? (
                <EmptyState text="No contacts yet. Add your first one!" />
              ) : (
                <Grid container spacing={1}>
                  {recentContacts.map((contact) => (
                    <Grid key={contact.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                      <Box
                        onClick={() => navigate(`/app/contacts/${contact.id}`)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: 1,
                          borderColor: 'divider',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Avatar sx={{ bgcolor: CHART_COLORS.blue, width: 36, height: 36, fontSize: 14 }}>
                          {formatName(contact.first_name, contact.last_name)} {contact.suffix}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>{formatName(contact.first_name, contact.last_name)} {contact.suffix}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                            {contact.email}
                          </Typography>
                        </Box>
                        <Chip
                          label={contact.status}
                          size="small"
                          color={contact.status === 'Customer' ? 'success' : contact.status === 'Lost' ? 'warning' : 'info'}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <CheckCircleIcon sx={{ fontSize: 36, color: 'success.main', mb: 1 }} />
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
  );
}