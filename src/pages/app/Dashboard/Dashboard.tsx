import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchContacts } from '../../../store/contactsSlice';
import { fetchLeads } from '../../../store/leadsSlice';
import { fetchDeals } from '../../../store/dealsSlice';
import { fetchActivities } from '../../../store/activitiesSlice';
import { fetchCustomers } from '../../../store/customersSlice';

import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Chip, Avatar,
  List, ListItem, ListItemAvatar, ListItemText,
  Divider,  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import SmsIcon from '@mui/icons-material/Sms';
import WarningIcon from '@mui/icons-material/Warning';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


import { Bar, Line, Doughnut } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import { formatCurrency } from '../../../utils/dateFilters';
import { CHART_COLORS, CHART_COLORS_ALPHA } from '../../../utils/chartColors';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  call: <PhoneIcon fontSize='small'/>,
  email: <EmailIcon fontSize='small'/>,
  meeting: <EventIcon fontSize="small" />,
  note: <NoteIcon fontSize="small" />,
  sms: <SmsIcon fontSize="small" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: CHART_COLORS. blue,
  email: CHART_COLORS.purple,
  meeting: CHART_COLORS.orange,
  note: CHART_COLORS.green,
  sms: CHART_COLORS.teal,
};

function StatCard({
  title, value, icon, color, subtitle, onClick,
}: {
  title: string;
  value: string | number; 
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
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
        transition: 'box-shadow 0.2s',
        '&:hover': onClick ? { boxShadow: 3 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: '50%',
              width: 48,
              height: 48,
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
  title, action, onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" fontWeight={700}>{title}</Typography>
      {action && onAction && (
        <Button size="small" onClick={onAction}>{action}</Button>
      )}
    </Box>
  );  
}
export default  function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: contacts, loading: cL, error: cE } = useSelector(
    (s: RootState) => s.contacts
  );
  const { items: leads, loading: lL } = useSelector(
    (s: RootState) => s.leads
  );
  const { items: deals, loading: dL } = useSelector(
    (s: RootState) => s.deals
  );
  const { items: activities, loading: aL } = useSelector(
    (s: RootState) => s.activities
  );
  const { items: customers, loading: cuL } = useSelector(
    (s: RootState) => s.customers
  );
  const { unreadCounts } = useSelector(
    (s: RootState) => s.messaging
  );


  useEffect(() => {
    if (contacts.length === 0) dispatch(fetchContacts());
    if (leads.length === 0) dispatch(fetchLeads());
    if (deals.length === 0) dispatch(fetchDeals());
    if (activities.length === 0) dispatch(fetchActivities());
    if (customers.length === 0) dispatch(fetchCustomers());
  }, [
    dispatch,
    contacts.length,
    leads.length,
    deals.length,
    activities.length,
    customers.length
  ]);

  const isLoading = cL || lL || dL || aL || cuL;

  const totalUnread = Object.values(unreadCounts). reduce(
    (a, b) => a + b, 0
  );

  const wonDeals = useMemo(
    () => deals.filter(d => d.stage === 'Closed Won'),
    [deals]
  );

  const totalRevenue = useMemo(
    () => deals
      .filter(d => d.stage !== 'Closed Lost')
      .reduce((s, d) => s + d.value, 0),
    [deals]
  );

  const activeLeads = leads.filter(l => l.status !== 'Closed').length;
  const closedLeads = leads.filter(l => l.status === 'Closed').length;

  
  const wonThisMonth = useMemo(
    () => wonDeals
      .filter(d => {
        const thisMonth = new Date()
        if (!d.created_at) return false;
        const date = new Date (d.created_at);
        return (
          date.getMonth() === thisMonth.getMonth() && 
          date.getFullYear() === thisMonth.getFullYear()
        );
      })
      .reduce((s, d) => s + d.value, 0),
    [wonDeals]
  );

  const leadStatusCounts = useMemo(() => ({
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    Qualified: leads.filter(l => l.status === 'Qualified').length,
    Closed: leads.filter(l => l.status === 'Closed').length,
  }), [leads]);

  // const contactStatusCounts = useMemo(() => ({
  //   active: contacts.filter(c => c.status === 'Active').length,
  //   Prospect: contacts.filter(c => c.status === 'Prospect').length,
  //   Lead: contacts.filter(c => c.status === 'Lead').length,
  // }), [contacts]);

  // const dealStageCounts = useMemo(() => ({
  //   Prospecting: deals.filter(d => d.stage === 'Prospecting').length,
  //   Proposal: deals.filter(d => d.stage === 'Proposal').length,
  //   Negotiation: deals.filter(d => d.stage === 'Negotiation').length,
  //   'Closed Won': wonDeals.length,
  //   'Closed Lost': deals.filter(d => d.stage === 'Closed Lost').length,
  // }), [deals, wonDeals]);

  const activityTypeCounts = useMemo(() => ({
    call: activities.filter(a => a.type === 'call').length,
    email: activities.filter(a => a.type === 'email').length,
    meeting: activities.filter(a => a.type === 'meeting').length,
    note: activities.filter(a => a.type === 'note').length,
    sms: activities.filter(a => a.type === 'sms').length,
  }), [activities]);

  const revenueByMonth = useMemo(() => {
    const months: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() -i);
      const key = d.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' });
      months[key] = 0;
    }
    wonDeals.forEach(deal => {
      if (!deal.created_at) return;
      const key = new Date(deal.created_at).toLocaleDateString('en-US', {
        month: 'short', year: 'numeric',
      });
      if (key in months) months[key] += deal.value;
    });
    return months;
  }, [wonDeals]);

  const coldContacts = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return contacts.filter(contact => {
      const lastActivity = activities
        .filter(a => a.contact_name === contact.name)
        .sort((a, b) =>
          new Date(b.created_at || '').getTime() -
          new Date(a.created_at || '').getTime()
        )[0];

      if (!lastActivity) return true; // never contacted
      return new Date(lastActivity.created_at || '') < thirtyDaysAgo;
    }).slice(0, 5); // show max 5
  }, [contacts, activities]);

  const dealsThisWeek = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return deals
      .filter(d => {
        if (!d.close_date) return false;
        if (d.stage === 'Closed Won' || d.stage === 'Closed Lost') return false;
        const closeDate = new Date(d.close_date);
        return closeDate >= today && closeDate <= nextWeek;
      })
      .slice(0, 5);
  }, [deals]);

  const recentActivities = useMemo(
    () => [...activities]
      .sort((a, b) =>
        new Date(b.created_at || '').getTime() -
        new Date(a.created_at || '').getTime()
      )
      .slice(0, 8),
    [activities]
  );


  const recentContacts = contacts.slice(0, 5);

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, stepSize: 1 },
        grid: { color: 'rgba(128,128,128,0.1)' },
      },
      x: { grid: { display: false } },
    },
  };

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

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>


      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Total contacts"
            value={contacts.length}
            icon={<PeopleIcon />}
            color={CHART_COLORS.blue}
            subtitle="All time"
            onClick={() => navigate('/app/contacts')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Total leads"
            value={leads.length}
            icon={<TrendingUpIcon />}
            color={CHART_COLORS.purple}
            subtitle="All time"
            onClick={() => navigate('/app/leads')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Active leads"
            value={activeLeads}
            icon={<FiberNewIcon />}
            color={CHART_COLORS.orange}
            subtitle="Not yet closed"
            onClick={() => navigate('/app/leads')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Leads closed"
            value={closedLeads}
            icon={<CheckCircleIcon />}
            color={CHART_COLORS.green}
            subtitle="Successfully closed"
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<AttachMoneyIcon />}
            color={CHART_COLORS.teal}
            subtitle="Open deals"
            onClick={() => navigate('/app/deals')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Won this month"
            value={formatCurrency(wonThisMonth)}
            icon={<CheckCircleIcon />}
            color={CHART_COLORS.green}
            subtitle={`${wonDeals.length} deals total`}
            onClick={() => navigate('/app/deals')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Customers"
            value={customers.length}
            icon={<BusinessIcon />}
            color={CHART_COLORS.amber}
            subtitle="Companies"
            onClick={() => navigate('/app/customers')}
          />
        </Grid>
        <Grid sx={{xs: 6, sm: 4, md:3}}>
          <StatCard
            title="Unread messages"
            value={totalUnread}
            icon={<SmsIcon />}
            color={totalUnread > 0 ? CHART_COLORS.red : CHART_COLORS.blue}
            subtitle="From team members"
            onClick={() => navigate('/app/messages')}
          />
        </Grid>
      </Grid>


      <Grid container spacing={3} sx={{ mb: 4 }}>

        <Grid sx={{xs: 12, md: 4}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Leads by status
              </Typography>
              <Box sx={{ height: 220 }}>
                <Bar
                  data={{
                    labels: Object.keys(leadStatusCounts),
                    datasets: [{
                      label: 'Leads',
                      data: Object.values(leadStatusCounts),
                      backgroundColor: [
                        CHART_COLORS.blue, CHART_COLORS.orange,
                        CHART_COLORS.purple, CHART_COLORS.green,
                      ],
                      borderRadius: 6,
                      borderSkipped: false,
                    }],
                  }}
                  options={baseOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by month line chart */}
        <Grid sx={{xs: 12, md: 4}}>
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
                          label: (ctx: TooltipItem<'line'>) =>
                            ` ${formatCurrency(ctx.parsed.y as number)}`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activities by type doughnut */}
        <Grid sx={{xs: 12, md: 3}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Activity types
              </Typography>
              <Box sx={{ maxWidth: 200, mx: 'auto' }}>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>

        {/* Recent activities feed */}
        <Grid sx={{xs: 12, md: 7}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle
                title="Recent activities"
                action="View all"
                onAction={() => navigate('/app/activities')}
              />
              {recentActivities.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No activities yet. Log your first one!
                </Typography>
              ) : (
                <List disablePadding>
                  {recentActivities.map((activity, i) => (
                    <Box key={activity.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: ACTIVITY_COLORS[activity.type] || CHART_COLORS.blue,
                            }}
                          >
                            {ACTIVITY_ICONS[activity.type]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {activity.subject}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.contact_name && `${activity.contact_name} · `}
                              {activity.created_at
                                ? new Date(activity.created_at).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric',
                                  })
                                : '—'}
                            </Typography>
                          }
                        />
                        <Chip
                          label={activity.type}
                          size="small"
                          sx={{
                            bgcolor: ACTIVITY_COLORS[activity.type],
                            color: 'white',
                            fontSize: 10,
                            height: 20,
                          }}
                        />
                      </ListItem>
                      {i < recentActivities.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{xs: 12, md: 5}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle
                title="Cold contacts"
                action="View all"
                onAction={() => navigate('/app/contacts')}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No activity in the last 30+ days
              </Typography>
              {coldContacts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    All contacts are warm! Great work.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {coldContacts.map((contact, i) => (
                    <Box key={contact.id}>
                      <ListItem
                        disablePadding
                        sx={{
                          py: 1,
                          cursor: 'pointer',
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate(`/app/contacts/${contact.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: 'warning.main',
                              fontSize: 14,
                            }}
                          >
                            {contact.name[0]?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              {contact.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {contact.email}
                            </Typography>
                          }
                        />
                        <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                      </ListItem>
                      {i < coldContacts.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>

        {/* Deals closing this week */}
        <Grid sx={{xs: 12, md: 6}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle
                title="Closing this week"
                action="View deals"
                onAction={() => navigate('/app/deals')}
              />
              {dealsThisWeek.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No deals closing this week.
                </Typography>
              ) : (
                <List disablePadding>
                  {dealsThisWeek.map((deal, i) => (
                    <Box key={deal.id}>
                      <ListItem disablePadding sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: CHART_COLORS.teal, width: 36, height: 36 }}>
                            <CalendarTodayIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {deal.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {deal.contact_name && `${deal.contact_name} · `}
                              Closes {deal.close_date
                                ? new Date(deal.close_date).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric',
                                  })
                                : '—'}
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
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent contacts */}
        <Grid sx={{xs: 12, md: 6}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <SectionTitle
                title="Recent contacts"
                action="View all"
                onAction={() => navigate('/app/contacts')}
              />
              {recentContacts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No contacts yet. Add your first one!
                </Typography>
              ) : (
                <List disablePadding>
                  {recentContacts.map((contact, i) => (
                    <Box key={contact.id}>
                      <ListItem
                        disablePadding
                        sx={{
                          py: 1,
                          cursor: 'pointer',
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate(`/app/contacts/${contact.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: CHART_COLORS.blue, width: 36, height: 36, fontSize: 14 }}>
                            {contact.name[0]?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              {contact.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {contact.email}
                            </Typography>
                          }
                        />
                        <Chip
                          label={contact.status}
                          size="small"
                          color={
                            contact.status === 'Active' ? 'success'
                            : contact.status === 'Prospect' ? 'warning'
                            : 'info'
                          }
                        />
                      </ListItem>
                      {i < recentContacts.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}