import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchContacts } from '../../../store/contactsSlice';
import type { Deal } from '../../../types/deal'
import type { Activity } from '../../../types/activity'
import type { Lead } from '../../../types/lead'
import type { Contact } from '../../../types/contact'


import {
  Box, Typography, Grid, Card, CardContent,
  Button, MenuItem, TextField, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress,
  LinearProgress, Avatar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, type TooltipItem, Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

import {
  type DateRange, getDateBounds,
  filterByDateRange, groupByMonth, formatCurrency,
} from '../../../utils/dateFilters';
import { exportToCSV } from '../../../utils/exportCSV';
import {
  CHART_COLORS, CHART_COLORS_ALPHA, ACTIVITY_TYPE_COLORS,
} from '../../../utils/chartColors';


ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend
);

const baseOptions = {
  responsive: true, 
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
  scales : {
    y: {
      beginAtZero: true,
      ticks: { precision: 0, stepSize: 1},
      grid: { color: 'rgba(128,128,128,0.1)'},
    },
    x: { grid: {display: false} },
  },
};

function StatCard({
  label, value, sub, color = 'primary.main',
}: {
  label: string; value: string | number;
  sub?: string; color?: string;
}) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={800} color={color}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">{sub}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

 function SectionHeader({
  title, subtitle, onExport,
 } : {
  title: string; subtitle: string; onExport?: () => void;
 }) {
     return (
        <Box sx={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 1,
          }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          </Box>
          {onExport && (
            <Button size="small" startIcon={<DownloadIcon />} variant="outlined" onClick={onExport}>
              Export CSV
            </Button>
          )}
        </Box>
      );
    }

function Medal({ rank }: { rank: number }) {
  const colors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
  if (rank > 3) return <Typography fontWeight={700} color="text.secondary">#{rank}</Typography>;
   return (
      <Box sx={{ display: 'flex', alignItems: 'center',  gap: 0.5 }}>
        <EmojiEventsIcon sx={{ color: colors[rank], fontSize: 18 }} />
        <Typography fontWeight={700} sx={{ color: colors[rank] }}>#{rank}</Typography>
      </Box>
    );
}

export default function Reports () {
  const dispatch = useDispatch<AppDispatch>();
  
  const [mainTab, setMainTab] = useState(0);
  const [reportsSubTab, setReportsSubTab] = useState(0);
  const [analyticsSubTab, setAnalyticsSubTab] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const { items: contacts, loading: cL } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loading: lL } = useSelector((s: RootState) => s.leads);
  const { items: deals, loading: dL } = useSelector((s: RootState) => s.deals);
  const { items: activities, loading: aL } = useSelector((s: RootState) => s.activities);
  const { profiles } = useSelector((s: RootState) => s.messaging);


  useEffect(() => {
    if (contacts.length === 0) dispatch(fetchContacts());
    if (leads.length === 0) dispatch(fetchContacts());
    if (deals.length === 0) dispatch(fetchContacts());
    if (activities.length === 0) dispatch(fetchContacts());
    if (profiles.length === 0) dispatch(fetchContacts());
  }, [
    dispatch,
    contacts.length,
    leads.length,
    deals.length,
    activities.length,
    profiles.length
    ]);

  const isLoading = cL || lL || dL || aL;

  const bounds = useMemo(() => getDateBounds(dateRange), [dateRange]);

  const fC = useMemo(() => filterByDateRange(contacts, bounds), [contacts, bounds]);
  const fL = useMemo(() => filterByDateRange(leads, bounds), [leads, bounds]);
  const fD = useMemo(() => filterByDateRange(deals, bounds), [deals, bounds]);
  const fA = useMemo(() => filterByDateRange(activities, bounds), [activities, bounds]);
  
  const contactsByMonth = useMemo(() => groupByMonth(fC), [fC]);
  const contactStatus = useMemo(() => ({
    Active: fC.filter(c => c.status === 'Active').length,
    Prospect: fC.filter(c => c.status === 'Prospect').length,
    Lead: fC.filter(c => c.status === 'Lead').length,
  }), [fC]);


  const leadsByStage = useMemo(() => ({
    New: fL.filter(l => l.status === 'New').length,
    Contacted: fL.filter(l => l.status === 'Contacted').length,
    Qualified: fL.filter(l => l.status === 'Qualified').length,
    Closed: fL.filter(l => l.status === 'Closed').length,
  }), [fL]);

  const leadConvRate = fL.length > 0
    ? Math.round((leadsByStage.Closed / fL.length) * 100)
    : 0;

  const wonDeals = useMemo(() => fD.filter(d => d.stage === 'Closed Won'), [fD]);
  const lostDeals = useMemo(() => fD.filter(d => d.stage === 'Closed Lost'), [fD]);
  const totalRevenue = useMemo(() => wonDeals.reduce((s, d) => s + d.value, 0), [wonDeals]);
  const winRate = fD.length > 0 ? Math.round((wonDeals.length / fD.length) * 100): 0;
  const dealsByMonth = useMemo(() => groupByMonth(wonDeals), [wonDeals]);
  const dealsByStage = useMemo(() => ({
    Prospecting: fD.filter(d => d.stage === 'Prospecting').length,
    Proposal: fD.filter(d => d.stage === 'Proposal').length,
    Negotiation: fD.filter(d => d.stage === 'Negotiation').length,
    'Closed Won': wonDeals.length,
    'Closed Lost': lostDeals.length,
  }), [fD, wonDeals, lostDeals]);

  const actByType = useMemo(() => ({
    call: fA.filter(a => a.type === 'call').length,
    email: fA.filter(a => a.type === 'email').length,
    meeting: fA.filter(a => a.type === 'meeting').length,
    note: fA.filter(a => a.type === 'note').length,
    sms: fA.filter(a => a.type === 'sms').length,
  }), [fA]);

  const completionRate = fA.length > 0
    ? Math.round((fA.filter(a => a.completed).length / fA.length) * 100)
    : 0;

  
  const agentStats = useMemo(() => {
    return profiles
      .map((profile) => {
        const agentDeals = fD.filter(d => (d as Deal).owned_by === profile.id);
        const agentWon = agentDeals.filter(d => d.stage === 'Closed Won');
        const revenue = agentWon.reduce((s, d) => s + d.value, 0);
        const agentActivities = fA.filter(a => (a as Activity).logged_by === profile.id);
        const agentLeads = fL.filter(l => (l as Lead).assigned_to === profile.id);
        const agentContacts = fC.filter(c => (c as Contact).assigned_to === profile.id);
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url,
          revenue,
          dealsWon: agentWon.length,
          activities: agentActivities.length,
          leads: agentLeads.length,
          contacts: agentContacts.length,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .map((a, i) => ({ ...a, rank: i + 1 }));
  }, [profiles, fD, fA, fL, fC]);

  const maxActivities = Math.max(...agentStats.map(a => a.activities), 1);

  // ── Activity by hour ──────────────────────────────────
  const actByHour = useMemo(() => {
    const hours: Record<number, number> = {};
    fA.forEach(a => {
      if (!a.created_at) return;
      const h = new Date(a.created_at).getHours();
      hours[h] = (hours[h] || 0) + 1;
    });
    return Array.from({ length: 24 }, (_, i) => hours[i] || 0);
  }, [fA]);

  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    if (i === 0) return '12am';
    if (i < 12) return `${i}am`;
    if (i === 12) return '12pm';
    return `${i - 12}pm`;
  });

  const peakHour = actByHour.indexOf(Math.max(...actByHour));
  const inbound = fA.filter(a => a.direction === 'inbound').length;
  const outbound = fA.filter(a => a.direction === 'outbound').length;

  // ── CSV exports ───────────────────────────────────────
  const exportContacts = () => exportToCSV(
    fC.map(c => ({
      name: c.name, email: c.email,
      phone: c.phone || '', status: c.status,
      created_at: c.created_at || '',
    })), 'contacts'
  );

  const exportLeads = () => exportToCSV(
    fL.map(l => ({
      title: l.title, name: l.name,
      status: l.status, created_at: l.created_at || '',
    })), 'leads'
  );

  const exportDeals = () => exportToCSV(
    fD.map(d => ({
      title: d.title, value: d.value, stage: d.stage,
      contact: d.contact_name || '', created_at: d.created_at || '',
    })), 'deals'
  );

  const exportActivities = () => exportToCSV(
    fA.map(a => ({
      type: a.type, subject: a.subject,
      contact: a.contact_name || '',
      completed: a.completed ? 'Yes' : 'No',
      created_at: a.created_at || '',
    })), 'activities'
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Page header ──────────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">
            {bounds.label}
          </Typography>
        </Box>
        <TextField
          select size="small" value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          label="Date range" sx={{ minWidth: 160 }}
        >
          <MenuItem value="7d">Last 7 days</MenuItem>
          <MenuItem value="30d">Last 30 days</MenuItem>
          <MenuItem value="90d">Last 90 days</MenuItem>
          <MenuItem value="180d">Last 6 months</MenuItem>
          <MenuItem value="365d">Last 12 months</MenuItem>
          <MenuItem value="all">All time</MenuItem>
        </TextField>
      </Box>

      {/* ── Summary stat cards — always visible ──────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{xs: 6,  sm: 3 }}>
          <StatCard label="Contacts" value={fC.length} color="primary.main" sub={bounds.label} />
        </Grid>
        <Grid sx={{xs: 6,  sm: 3 }}>
          <StatCard label="Leads" value={fL.length} color="secondary.main" sub={bounds.label} />
        </Grid>
        <Grid sx={{xs: 6,  sm: 3 }}>
          <StatCard label="Revenue" value={formatCurrency(totalRevenue)} color="success.main" sub={`${wonDeals.length} deals won`} />
        </Grid>
        <Grid sx={{xs: 6,  sm: 3 }}>
          <StatCard label="Activities" value={fA.length} color="warning.main" sub={bounds.label} />
        </Grid>
      </Grid>

      {/* ── Main tabs: Reports / Analytics ───────────── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)}>
          <Tab
            icon={<DownloadIcon fontSize="small" />}
            iconPosition="start"
            label="Reports"
          />
          <Tab
            icon={<BarChartIcon fontSize="small" />}
            iconPosition="start"
            label="Analytics"
          />
        </Tabs>
      </Box>

      {/* ════════════════════════════════════════════════ */}
      {/* MAIN TAB 0 — REPORTS                            */}
      {/* ════════════════════════════════════════════════ */}
      {mainTab === 0 && (
        <Box>
          {/* Sub-tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={reportsSubTab} onChange={(_, v) => setReportsSubTab(v)} variant="scrollable">
              <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="Contacts" />
              <Tab icon={<TrendingUpIcon fontSize="small" />} iconPosition="start" label="Leads" />
              <Tab icon={<AttachMoneyIcon fontSize="small" />} iconPosition="start" label="Deals" />
              <Tab icon={<EventNoteIcon fontSize="small" />} iconPosition="start" label="Activities" />
            </Tabs>
          </Box>

          {/* ── Contacts report ──────────────────────── */}
          {reportsSubTab === 0 && (
            <Box>
              <SectionHeader
                title="Contacts report"
                subtitle={`${fC.length} contacts — ${bounds.label}`}
                onExport={exportContacts}
              />
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  md: 7 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        Growth over time
                      </Typography>
                      <Box sx={{ height: 200 }}>
                        <Line
                          data={{
                            labels: Object.keys(contactsByMonth),
                            datasets: [{
                              label: 'Contacts',
                              data: Object.values(contactsByMonth),
                              borderColor: CHART_COLORS.blue,
                              backgroundColor: CHART_COLORS_ALPHA.blue,
                              tension: 0.3, fill: true, pointRadius: 4,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        Status breakdown
                      </Typography>
                      <Box sx={{ maxWidth: 200, mx: 'auto' }}>
                        <Doughnut
                          data={{
                            labels: ['Active', 'Prospect', 'Lead'],
                            datasets: [{
                              data: Object.values(contactStatus),
                              backgroundColor: [CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.blue],
                              borderWidth: 0, hoverOffset: 8,
                            }],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: 'bottom' as const, labels: { padding: 12, usePointStyle: true } },
                            },
                            cutout: '65%',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Added</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fC.slice(0, 20).map(c => (
                      <TableRow key={c.id} hover>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>
                          <Chip label={c.status} size="small"
                            color={c.status === 'Active' ? 'success' : c.status === 'Prospect' ? 'warning' : 'info'} />
                        </TableCell>
                        <TableCell>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {fC.length > 20 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Showing 20 of {fC.length}. Export CSV to see all.
                </Typography>
              )}
            </Box>
          )}

          {/* ── Leads report ─────────────────────────── */}
          {reportsSubTab === 1 && (
            <Box>
              <SectionHeader
                title="Leads report"
                subtitle={`${fL.length} leads — ${bounds.label}`}
                onExport={exportLeads}
              />
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  md: 7 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Pipeline funnel</Typography>
                      <Box sx={{ height: 200 }}>
                        <Bar
                          data={{
                            labels: Object.keys(leadsByStage),
                            datasets: [{
                              label: 'Leads',
                              data: Object.values(leadsByStage),
                              backgroundColor: [CHART_COLORS.blue, CHART_COLORS.orange, CHART_COLORS.purple, CHART_COLORS.green],
                              borderRadius: 6, borderSkipped: false,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <StatCard label="Total leads" value={fL.length} color="secondary.main" />
                    <StatCard label="Qualified" value={leadsByStage.Qualified + leadsByStage.Closed} sub="Qualified + Closed" color="success.main" />
                    <StatCard label="Conversion rate" value={`${leadConvRate}%`} sub="New → Closed" color="warning.main" />
                  </Box>
                </Grid>
              </Grid>
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Added</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fL.slice(0, 20).map(l => (
                      <TableRow key={l.id} hover>
                        <TableCell>{l.title}</TableCell>
                        <TableCell>{l.name}</TableCell>
                        <TableCell><Chip label={l.status} size="small" /></TableCell>
                        <TableCell>{l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* ── Deals report ─────────────────────────── */}
          {reportsSubTab === 2 && (
            <Box>
              <SectionHeader
                title="Deals report"
                subtitle={`${fD.length} deals — ${bounds.label}`}
                onExport={exportDeals}
              />
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Total deals" value={fD.length} />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Won revenue" value={formatCurrency(totalRevenue)} color="success.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Win rate" value={`${winRate}%`} sub={`${wonDeals.length} won / ${lostDeals.length} lost`} color="warning.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Avg deal value"
                    value={wonDeals.length > 0 ? formatCurrency(totalRevenue / wonDeals.length) : '$0'}
                    color="primary.main"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  md: 7 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Deals won over time</Typography>
                      <Box sx={{ height: 200 }}>
                        <Bar
                          data={{
                            labels: Object.keys(dealsByMonth),
                            datasets: [{
                              label: 'Deals won',
                              data: Object.values(dealsByMonth),
                              backgroundColor: CHART_COLORS.green,
                              borderRadius: 6, borderSkipped: false,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Win vs loss</Typography>
                      <Box sx={{ maxWidth: 180, mx: 'auto' }}>
                        <Doughnut
                          data={{
                            labels: ['Won', 'Lost', 'Open'],
                            datasets: [{
                              data: [wonDeals.length, lostDeals.length, fD.length - wonDeals.length - lostDeals.length],
                              backgroundColor: [CHART_COLORS.green, CHART_COLORS.red, CHART_COLORS.blue],
                              borderWidth: 0,
                            }],
                          }}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: 'bottom' as const, labels: { padding: 12, usePointStyle: true } } },
                            cutout: '60%',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Deal</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Stage</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fD.slice(0, 20).map(d => (
                      <TableRow key={d.id} hover>
                        <TableCell>{d.title}</TableCell>
                        <TableCell>{d.contact_name || '—'}</TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>{formatCurrency(d.value)}</TableCell>
                        <TableCell>
                          <Chip label={d.stage} size="small"
                            color={d.stage === 'Closed Won' ? 'success' : d.stage === 'Closed Lost' ? 'error' : 'default'} />
                        </TableCell>
                        <TableCell>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* ── Activities report ─────────────────────── */}
          {reportsSubTab === 3 && (
            <Box>
              <SectionHeader
                title="Activities report"
                subtitle={`${fA.length} activities — ${bounds.label}`}
                onExport={exportActivities}
              />
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  md: 7 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Activities by type</Typography>
                      <Box sx={{ height: 200 }}>
                        <Bar
                          data={{
                            labels: ['Call', 'Email', 'Meeting', 'Note', 'SMS'],
                            datasets: [{
                              label: 'Activities',
                              data: Object.values(actByType),
                              backgroundColor: Object.values(ACTIVITY_TYPE_COLORS),
                              borderRadius: 6, borderSkipped: false,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <StatCard label="Total activities" value={fA.length} />
                    <StatCard label="Completed" value={fA.filter(a => a.completed).length} sub={`${completionRate}% completion rate`} color="success.main" />
                    <StatCard label="Most used type"
                      value={Object.entries(actByType).sort(([, a], [, b]) => b - a)[0]?.[0] || '—'}
                      color="warning.main"
                    />
                  </Box>
                </Grid>
              </Grid>
              <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Done</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fA.slice(0, 20).map(a => (
                      <TableRow key={a.id} hover>
                        <TableCell><Chip label={a.type} size="small" sx={{ bgcolor: ACTIVITY_TYPE_COLORS[a.type], color: 'white' }} /></TableCell>
                        <TableCell>{a.subject}</TableCell>
                        <TableCell>{a.contact_name || '—'}</TableCell>
                        <TableCell>
                          <Chip label={a.completed ? 'Yes' : 'No'} size="small" color={a.completed ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* MAIN TAB 1 — ANALYTICS                          */}
      {/* ════════════════════════════════════════════════ */}
      {mainTab === 1 && (
        <Box>
          {/* Analytics sub-tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={analyticsSubTab} onChange={(_, v) => setAnalyticsSubTab(v)} variant="scrollable">
              <Tab label="Customer Behavior" />
              <Tab label="Agent Performance" />
              <Tab label="Pipeline Health" />
              <Tab label="Communication" />
            </Tabs>
          </Box>

          {/* ── Customer behavior ────────────────────── */}
          {analyticsSubTab === 0 && (
            <Box>
              <SectionHeader title="Customer Behavior" subtitle="Engagement patterns and status trends" />
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  sm: 8 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Contact growth over time</Typography>
                      <Box sx={{ height: 220 }}>
                        <Line
                          data={{
                            labels: Object.keys(contactsByMonth),
                            datasets: [{
                              label: 'New contacts',
                              data: Object.values(contactsByMonth),
                              borderColor: CHART_COLORS.blue,
                              backgroundColor: CHART_COLORS_ALPHA.blue,
                              tension: 0.3, fill: true, pointRadius: 4,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 4 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Status mix</Typography>
                      <Box sx={{ maxWidth: 180, mx: 'auto' }}>
                        <Doughnut
                          data={{
                            labels: ['Active', 'Prospect', 'Lead'],
                            datasets: [{
                              data: Object.values(contactStatus),
                              backgroundColor: [CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.blue],
                              borderWidth: 0, hoverOffset: 8,
                            }],
                          }}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: 'bottom' as const, labels: { padding: 12, usePointStyle: true } } },
                            cutout: '65%',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard label="Active customers" value={contactStatus.Active} color="success.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard label="Most used channel"
                    value={Object.entries(actByType).sort(([, a], [, b]) => b - a)[0]?.[0] || '—'}
                    sub="By activity count" color="primary.main"
                  />
                </Grid>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard label="Activity completion" value={`${completionRate}%`} color="warning.main" />
                </Grid>
              </Grid>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>Activity by channel</Typography>
                  <Box sx={{ height: 180 }}>
                    <Bar
                      data={{
                        labels: ['Call', 'Email', 'Meeting', 'Note', 'SMS'],
                        datasets: [{
                          label: 'Activities',
                          data: Object.values(actByType),
                          backgroundColor: Object.values(ACTIVITY_TYPE_COLORS),
                          borderRadius: 6, borderSkipped: false,
                        }],
                      }}
                      options={baseOptions}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* ── Agent performance ─────────────────────── */}
          {analyticsSubTab === 1 && (
            <Box>
              <SectionHeader
                title="Agent Performance"
                subtitle="Rankings by revenue, deals, and activities. Full data available after attribution fields added (Milestone 4)."
              />
              {agentStats.length === 0 ? (
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary">
                      No agents yet. Agents appear here once they have records assigned to them.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1, mb: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Revenue by agent</Typography>
                      <Box sx={{ height: 200 }}>
                        <Bar
                          data={{
                            labels: agentStats.map(a => a.name),
                            datasets: [{
                              label: 'Revenue',
                              data: agentStats.map(a => a.revenue),
                              backgroundColor: agentStats.map((_, i) =>
                                i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : CHART_COLORS.blue
                              ),
                              borderRadius: 6, borderSkipped: false,
                            }],
                          }}
                          options={{
                            ...baseOptions,
                            plugins: {
                              ...baseOptions.plugins,
                              tooltip: { callbacks: { label: (ctx: TooltipItem<'bar'>) => ` ${formatCurrency(ctx.parsed.y as number)}` } },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                  <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Deals</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Activities</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Contacts</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Activity score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {agentStats.map((agent) => (
                          <TableRow key={agent.id} hover>
                            <TableCell><Medal rank={agent.rank} /></TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar src={agent.avatar} sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                                  {agent.name[0]?.toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>{agent.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{agent.email}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                {formatCurrency(agent.revenue)}
                              </Typography>
                            </TableCell>
                            <TableCell>{agent.dealsWon}</TableCell>
                            <TableCell>{agent.activities}</TableCell>
                            <TableCell>{agent.contacts}</TableCell>
                            <TableCell sx={{ minWidth: 140 }}>
                              <LinearProgress
                                variant="determinate"
                                value={maxActivities > 0 ? (agent.activities / maxActivities) * 100 : 0}
                                sx={{ borderRadius: 2, height: 6, mb: 0.5 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {maxActivities > 0 ? Math.round((agent.activities / maxActivities) * 100) : 0}% of top
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}

          {/* ── Pipeline health ───────────────────────── */}
          {analyticsSubTab === 2 && (
            <Box>
              <SectionHeader title="Pipeline Health" subtitle="Conversion rates, win rate trends, and deal stage analysis" />
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Win rate" value={`${winRate}%`} sub={`${wonDeals.length} won / ${lostDeals.length} lost`} color="success.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Lead conversion" value={`${leadConvRate}%`} sub="Leads → Closed" color="primary.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} color="success.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 3 }}>
                  <StatCard label="Avg deal size"
                    value={wonDeals.length > 0 ? formatCurrency(totalRevenue / wonDeals.length) : '$0'}
                    color="warning.main"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  md: 7 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Revenue won over time</Typography>
                      <Box sx={{ height: 220 }}>
                        <Line
                          data={{
                            labels: Object.keys(dealsByMonth),
                            datasets: [{
                              label: 'Deals won',
                              data: Object.values(dealsByMonth),
                              borderColor: CHART_COLORS.green,
                              backgroundColor: CHART_COLORS_ALPHA.green,
                              tension: 0.3, fill: true, pointRadius: 4,
                            }],
                          }}
                          options={baseOptions}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Deals by stage</Typography>
                      <Box sx={{ height: 220 }}>
                        <Doughnut
                          data={{
                            labels: Object.keys(dealsByStage),
                            datasets: [{
                              data: Object.values(dealsByStage),
                              backgroundColor: [
                                CHART_COLORS.blue, CHART_COLORS.orange, CHART_COLORS.purple,
                                CHART_COLORS.green, CHART_COLORS.red,
                              ],
                              borderWidth: 0, hoverOffset: 8,
                            }],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: 'bottom' as const, labels: { padding: 10, usePointStyle: true, font: { size: 11 } } },
                            },
                            cutout: '55%',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* Lead-to-deal funnel */}
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>Lead-to-deal funnel</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { label: 'Total leads', value: fL.length, color: CHART_COLORS.blue },
                      { label: 'Contacted', value: fL.filter(l => l.status !== 'New').length, color: CHART_COLORS.orange },
                      { label: 'Qualified', value: fL.filter(l => l.status === 'Qualified' || l.status === 'Closed').length, color: CHART_COLORS.purple },
                      { label: 'Converted to deals', value: fD.length, color: CHART_COLORS.green },
                      { label: 'Won', value: wonDeals.length, color: CHART_COLORS.green },
                    ].map((stage) => {
                      const pct = Math.round((stage.value / Math.max(fL.length, 1)) * 100);
                      return (
                        <Box key={stage.label}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">{stage.label}</Typography>
                            <Typography variant="body2" fontWeight={700}>{stage.value}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              height: 10, borderRadius: 2, bgcolor: 'action.hover',
                              '& .MuiLinearProgress-bar': { bgcolor: stage.color },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* ── Communication patterns ────────────────── */}
          {analyticsSubTab === 3 && (
            <Box>
              <SectionHeader title="Communication Patterns" subtitle="Best channels, peak hours, inbound vs outbound" />
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard
                    label="Peak contact hour"
                    value={actByHour.every(h => h === 0) ? '—' : hourLabels[peakHour]}
                    sub="Most active time of day"
                    color="primary.main"
                  />
                </Grid>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard label="Completion rate" value={`${completionRate}%`} sub="Activities marked done" color="success.main" />
                </Grid>
                <Grid sx={{xs: 12,  sm: 4 }}>
                  <StatCard label="Inbound / Outbound" value={`${inbound} / ${outbound}`} color="secondary.main" />
                </Grid>
              </Grid>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1, mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>Activity by hour of day</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Best hours to contact customers — peak hour highlighted in orange
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    <Bar
                      data={{
                        labels: hourLabels,
                        datasets: [{
                          label: 'Activities',
                          data: actByHour,
                          backgroundColor: actByHour.map(v =>
                            v === Math.max(...actByHour) ? CHART_COLORS.orange : CHART_COLORS_ALPHA.blue
                          ),
                          borderRadius: 4, borderSkipped: false,
                        }],
                      }}
                      options={{
                        ...baseOptions,
                        scales: {
                          ...baseOptions.scales,
                          x: { ...baseOptions.scales.x, ticks: { maxTicksLimit: 12, maxRotation: 0 } },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
              <Grid container spacing={3}>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Inbound vs outbound</Typography>
                      <Box sx={{ maxWidth: 200, mx: 'auto' }}>
                        <Doughnut
                          data={{
                            labels: ['Inbound', 'Outbound'],
                            datasets: [{
                              data: [inbound, outbound],
                              backgroundColor: [CHART_COLORS.purple, CHART_COLORS.blue],
                              borderWidth: 0, hoverOffset: 8,
                            }],
                          }}
                          options={{
                            responsive: true,
                            plugins: { legend: { position: 'bottom' as const, labels: { padding: 16, usePointStyle: true } } },
                            cutout: '65%',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid sx={{xs: 12,  md: 5 }}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>Channel completion rate</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {Object.entries(actByType).map(([type, count]) => {
                          const done = fA.filter(a => a.type === type && a.completed).length;
                          const rate = count > 0 ? Math.round((done / count) * 100) : 0;
                          return (
                            <Box key={type}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label={type} size="small" sx={{ bgcolor: ACTIVITY_TYPE_COLORS[type], color: 'white', height: 20, fontSize: 11 }} />
                                  <Typography variant="caption" color="text.secondary">{count} total</Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={700}>{rate}%</Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={rate}
                                sx={{
                                  height: 8, borderRadius: 2, bgcolor: 'action.hover',
                                  '& .MuiLinearProgress-bar': { bgcolor: ACTIVITY_TYPE_COLORS[type] },
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

