import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchContacts } from "../../../store/contactsSlice";
import { fetchLeads } from "../../../store/leadsSlice";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

import StatCard from '../../../components/StatCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const LEAD_STATUS_COLORS: Record<string, string> = {
  New: '#1976d2',
  Contacted: '#ed6c02',
  Qualified: '#9c27b0',
  Closed: '#2e7d32',
};


const CONTACT_STATUS_COLORS: Record<string, string> = {
  Active: '#2e7d32',
  Prospect: '#ed6c02',
  Lead: '#1976d2',
}

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    items: contacts,
    loading: contactsLoading,
    error: contactsError,
  } = useSelector((state: RootState) => state.contacts);

  const {
    items: leads,
    loading:leadsLoading,
    error:leadsError,
  } = useSelector((state: RootState) => state.leads);

  useEffect(() => {
    if (contacts.length === 0) dispatch(fetchContacts());
    if (leads.length === 0) dispatch(fetchLeads());
  }, [dispatch]);

  const totalContacts= contacts.length;
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => l.status !== 'Closed').length;
  const closedLeads = leads.filter((l) => l.status === 'Closed').length;

  const leadStatusCounts = {
    New: leads.filter((l) => l.status === 'New').length,
    Contacted: leads.filter((l) => l.status === 'Contacted').length,
    Qualified: leads.filter((l) => l.status === 'Qualified').length,
    Closed: leads.filter((l) => l.status === 'Closed').length,
  };

  const contactStatusCounts = {
    Active: contacts.filter((c) => c.status === 'Active').length,
    Prospect: contacts.filter((c) => c.status === 'Prospect').length,
    Lead: contacts.filter((c) => c.status === 'Lead').length,
  };

  const recentContacts = [...contacts].slice(0, 5);
  const recentLeads = [...leads].slice(0, 5);

  const barChartData = {
    labels: Object.keys(leadStatusCounts),
    datasets: [
      {
        label: 'Leads',
        data: Object.values(leadStatusCounts),
        backgroundColor: Object.keys(leadStatusCounts).map(
          (status) => LEAD_STATUS_COLORS[status]
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barChartOptions = {
    responsive : true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display : false },
      tooltip:  {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `${context.parsed.y} leads`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision :0,
        },
        grid: {
          color: 'rgba(128,128,128,0.1)',
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };


  const  doughnutChartData = {
    labels: Object.keys(contactStatusCounts),
    datasets: [
      {
        data: Object.values(contactStatusCounts),
        backgroundColor: Object.keys(contactStatusCounts).map((status) => CONTACT_STATUS_COLORS[status]),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) =>
             ` ${context.label}: ${context.parsed} contacts`,
        },
      },
    },
    cutout: '65%',
  };

  if ( contactsLoading || leadsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {contactsError && (
        <Alert severity="error" sx={{ mb: 2 }}>{contactsError}</Alert>
      )}
      {leadsError && (
        <Alert severity="error" sx={{ mb: 2 }}>{leadsError}</Alert>
      )}

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 , display: 'flex', justifyContent: 'center'}}>
        <Grid sx={{xs: 12, sm:6,  md:3 }}>
          <StatCard
            title="Total contacts"
            value={totalContacts}
            icon={<PeopleIcon />}
            color="#1976d2"
            subtitle="All time"
          />
        </Grid>
        <Grid sx={{xs: 12, sm:6,  md:3 }}>
          <StatCard
            title="Total leads"
            value={totalLeads}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
            subtitle="All time"
          />
        </Grid>
        <Grid sx={{xs: 12, sm:6,  md:3 }}>
          <StatCard
            title="Active leads"
            value={activeLeads}
            icon={<FiberNewIcon />}
            color="#ed6c02"
            subtitle="Not yet closed"
          />
        </Grid>
        <Grid sx={{xs: 12, sm:6,  md:3 }} >
          <StatCard
            title="Closed leads"
            value={closedLeads}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
            subtitle="Successfully closed"
          />
        </Grid>
      </Grid>


      <Grid container spacing={3} sx={{ mb: 4, display: 'flex', justifyContent: 'center'}}>
        <Grid sx={{xs: 12, md:7, width: 500}} >
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1, pb: 4 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Leads by status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Distribution of leads across pipeline stages
              </Typography>
              <Box sx={{ height: 260 }}>
                <Bar data={barChartData} options={barChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{xs: 12, md:5 ,display: 'flex', justifyContent: 'center'}} >
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1, width: 500}}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Contacts by status
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Breakdown of contact types
              </Typography>
              <Box sx={{ maxWidth: 280, mx: 'auto' }}>
                <Doughnut
                  data={doughnutChartData}
                  options={doughnutChartOptions}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'center'}}>
        <Grid sx={{xs: 12, md:6 }} >
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 3,  width: 500 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Recent contacts
              </Typography>

              {recentContacts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No contacts yet. Add your first one!
                </Typography>
              ) : (
                <List disablePadding>
                  {recentContacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      disablePadding
                      sx={{
                        py: 1,
                        cursor: 'pointer',
                        borderRadius: 2,
                        px: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => navigate(`/app/contacts/${contact.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {contact.name[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={contact.email}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={contact.status}
                        size="small"
                        color={
                          contact.status === 'Active'
                            ? 'success'
                            : contact.status === 'Prospect'
                            ? 'warning'
                            : 'info'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>


        <Grid sx={{xs: 12, md:6 }} >
          <Card
            elevation={0}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 3, width: 500 }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Recent leads
              </Typography>

              {recentLeads.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No leads yet. Add your first one!
                </Typography>
              ) : (
                <List disablePadding>
                  {recentLeads.map((lead) => (
                    <ListItem
                      key={lead.id}
                      disablePadding
                      sx={{
                        py: 1,
                        cursor: 'pointer',
                        borderRadius: 2,
                        px: 1,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => navigate('/app/leads')}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {lead.name[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={lead.title}
                        secondary={lead.name}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={lead.status}
                        size="small"
                        sx={{
                          bgcolor: LEAD_STATUS_COLORS[lead.status],
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
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