import  { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  ShowChart as ShowChartIcon,
  SsidChart as ActivityIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { trackEvent } from '../../../services/googleAnalyticsService';
import type { Organization } from '../../../types/organization';
import type { Profile } from '../../../types/profile';

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalAdmins: number;
  totalAgents: number;
  totalUsers: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  systemHealth: {
    messageCount: number;
    contactCount: number;
    dealCount: number;
    activityCount: number;
  };
  recentLogins: Profile[]
  organizationData: Organization[];
  userGrowth: [];
  revenueGrowth: [] ;
  topOrganizations: [];
  userDistribution: [];
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

export default function SuperAdminDashboard() {
  
  const superAdmin = useSelector((state: RootState) => state.superAdmin.user);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  
  useEffect(() => {
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        trackEvent('super_admin_dashboard_viewed');
        
        const response = await fetch('/api/admin/dashboard-stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('super_admin_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data.data);

        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        trackEvent('super_admin_dashboard_error', { error: String(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load dashboard data</Alert>
      </Box>
    );
  }

  const activationRate = stats.activeOrganizations / stats.totalOrganizations || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back, {superAdmin?.name}. Platform Overview.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {
                trackEvent('super_admin_export_report');

              }}
            >
              Export Report
            </Button>
            <Button
              variant="contained"
              startIcon={<ShowChartIcon />}
              onClick={() => {
                setOpenAnalytics(true);
                trackEvent('super_admin_open_analytics');
              }}
            >
              View Analytics
            </Button>
          </Box>
        </Box>
      </Box>


      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{xs: 12, sm: 6, md: 3}} >
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BusinessIcon />
                <Typography variant="caption">Organizations</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {stats.totalOrganizations}
              </Typography>
              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={activationRate * 100}
                    sx={{
                      flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4ade80',
                      },
                    }}
                  />
                  <Typography variant="caption">{Math.round(activationRate * 100)}%</Typography>
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {stats.activeOrganizations} active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon />
                <Typography variant="caption">Tier 2: Admins</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {stats.totalAdmins}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Organization Owners
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PeopleIcon />
                <Typography variant="caption">Tier 1: Agents</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {stats.totalAgents}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Team Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MoneyIcon />
                <Typography variant="caption">Monthly Revenue</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                ${(stats.monthlyRevenue / 100).toFixed(0)}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255,255,255,0.9)' }}>
                +${(stats.weeklyRevenue / 100).toFixed(0)} this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SecurityIcon />
                <Typography variant="caption">Total Users</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Across all tiers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab icon={<ShowChartIcon />} iconPosition="start" label="Analytics & Growth" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Organizations" />
          <Tab icon={<ActivityIcon />} iconPosition="start" label="System Activity" />
          <Tab icon={<SecurityIcon />} iconPosition="start" label="Security & Logs" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid size={{xs: 12, md: 6}}>
            <Card elevation={2}>
              <TrendingUpIcon/>
              <CardHeader
                title="User Growth Trend (7 Days)"
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.userGrowth}>
                    <defs>
                      <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="agents"
                      stroke="#667eea"
                      fillOpacity={1}
                      fill="url(#colorAgents)"
                      name="Agents"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Card elevation={2}>
              <CardHeader
                title="💰 Revenue Growth (Monthly)"
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.revenueGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip formatter={(value: number) => `$${(value / 100).toFixed(2)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#43e97b"
                      strokeWidth={3}
                      dot={{ fill: '#43e97b', r: 6 }}
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, md: 3}}>
            <Card elevation={2}>
              <CardHeader
                title="👥 User Distribution by Tier"
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.userDistribution.map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Card elevation={2}>
              <CardHeader
                title="🏆 Top 5 Organizations by Revenue"
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
              />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topOrganizations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <ChartTooltip formatter={(value: number) => `$${(value / 100).toFixed(2)}`} />
                    <Bar dataKey="revenue" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Card elevation={2}>
          <CardHeader
            title="📊 All Organizations"
            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Organization</TableCell>
                  <TableCell align="right">Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Monthly Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.organizationData.slice(0, 10).map(org => (
                  <TableRow key={org.name} hover>
                    <TableCell sx={{ fontWeight: 600 }} >{org.name}</TableCell>
                    <TableCell align="right">--</TableCell>
                    <TableCell>
                      <Chip
                        label={org.subscription_status}
                        size="small"
                        color={org.subscription_status === 'active' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">${(org.revenue / 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {tab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="primary">
                  {stats.systemHealth.messageCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {stats.systemHealth.contactCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Contacts
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="warning.main">
                  {stats.systemHealth.dealCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Deals
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{xs: 12, sm: 6, md: 3}}>
            <Card>
              <CardContent>
                <Typography variant="h3" fontWeight={700} color="info.main">
                  {stats.systemHealth.activityCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Activities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tab === 3 && (
        <Card elevation={2}>
          <CardHeader
            title="🔒 Recent Super Admin Login Activity"
            titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Super Admin</TableCell>
                  <TableCell>Login Time</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentLogins.map(login => (
                  <TableRow key={login.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {(login as Profile)?.name || 'Unknown'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {login.created_at && new Date(login.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip label="Success" size="small" color="success" variant="filled" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <Dialog open={openAnalytics} onClose={() => setOpenAnalytics(false)} maxWidth="md" fullWidth>
        <DialogTitle>Google Analytics Integration</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Google Analytics 4 is connected and tracking all platform events in real-time.
          </Alert>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Frontend Tracked Events:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>✅</ListItemIcon>
              <ListItemText
                primary="Page Views"
                secondary="All navigation tracked automatically"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>✅</ListItemIcon>
              <ListItemText
                primary="Super Admin Login Attempt"
                secondary="Email tracked when form submitted"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>✅</ListItemIcon>
              <ListItemText
                primary="User Management Actions"
                secondary="Ban/delete button clicks tracked"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>✅</ListItemIcon>
              <ListItemText
                primary="Organization Actions"
                secondary="Pause/delete button clicks tracked"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>✅</ListItemIcon>
              <ListItemText
                primary="Dashboard Views"
                secondary="Tab navigation and exports tracked"
              />
            </ListItem>
          </List>

          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            View detailed analytics at:{' '}
            <Button
              size="small"
              onClick={() => {
                window.open('https://analytics.google.com', '_blank');
                trackEvent('super_admin_open_ga');
              }}
            >
              Google Analytics Dashboard
            </Button>
          </Typography>

          <Alert severity="success" sx={{ mt: 2 }}>
            Backend also tracks and logs all actual operations (ban, delete, pause) with detailed metadata.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnalytics(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}