import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
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
  Paper,
} from '@mui/material';

import {
  People as PeopleIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { supabase } from '../../../services/supabase';

interface RecentLogin {
  id: string;
  super_admin_id: string;
  created_at: string;
  ip_address: string;
  super_admin?: {
    name: string;
    email: string;
  };
}

interface OrganizationData {
  id: string;
  name: string;
  revenue: number;
  subscription_status?: string;
}

interface DashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalAdmins: number;
  totalAgents: number;
  totalUsers: number;
  monthlyRevenue: number;
  recentLogins: RecentLogin[];
  organizationData: OrganizationData[];
}

export default function SuperAdminDashboard() {
  const superAdmin = useSelector((state: RootState) => state.superAdmin.user);

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const { data: orgs } = await supabase
          .from('organizations')
          .select('*');

        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .neq('role', 'super_admin');

        const admins = profiles?.filter(p => p.role === 'admin') || [];
        const agents = profiles?.filter(p => p.role === 'agent') || [];

        const { data: recentLogins } = await supabase
          .from('super_admin_sessions')
          .select('id, created_at, ip_address, super_admin_id, super_admin:super_admin_id(name, email)')
          .order('created_at', { ascending: false })
          .limit(5);

        const revenueData: OrganizationData[] = [];

        for (const org of orgs || []) {
          const { data: invoices } = await supabase
            .from('stripe_invoices')
            .select('amount_paid')
            .eq('org_id', org.id)
            .gte(
              'created',
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            );

          const revenue =
            invoices?.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0) ||
            0;

          revenueData.push({
            id: org.id,
            name: org.name,
            revenue,
            subscription_status: org.subscription_status,
          });
        }

        const monthlyRevenue = revenueData.reduce(
          (sum, org) => sum + org.revenue,
          0
        );

        setStats({
          totalOrganizations: orgs?.length || 0,
          activeOrganizations:
            orgs?.filter(o => o.subscription_status === 'active').length || 0,
          totalAdmins: admins.length,
          totalAgents: agents.length,
          totalUsers: profiles?.length || 0,
          monthlyRevenue,
          recentLogins: (recentLogins as unknown as RecentLogin[]) || [],
          organizationData: revenueData,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform Overview
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip icon={<SecurityIcon />} label="Super Admin" />
            <Chip label={superAdmin?.name || 'Admin'} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{xs: 12, sm: 6, md: 3}} >
          <Card>
            <CardContent>
              <BusinessIcon />
              <Typography>{stats.totalOrganizations}</Typography>
              <Typography variant="caption">Organizations</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card>
            <CardContent>
              <PeopleIcon />
              <Typography>{stats.totalAdmins}</Typography>
              <Typography variant="caption">Admins</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card>
            <CardContent>
              <PeopleIcon />
              <Typography>{stats.totalAgents}</Typography>
              <Typography variant="caption">Agents</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs: 12, sm: 6, md: 3}}>
          <Card>
            <CardContent>
              <MoneyIcon />
              <Typography>
                ${(stats.monthlyRevenue / 100).toFixed(0)}
              </Typography>
              <Typography variant="caption">Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Revenue" />
        <Tab label="Organizations" />
        <Tab label="Security" />
      </Tabs>

      {tab === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.organizationData.map(org => (
                  <TableRow key={org.id}>
                    <TableCell>{org.name}</TableCell>
                    <TableCell>{org.subscription_status || 'N/A'}</TableCell>
                    <TableCell align="right">
                      ${(org.revenue / 100).toFixed(0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Logins
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Admin</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>IP</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stats.recentLogins.map(login => (
                <TableRow key={login.id}>
                  <TableCell>
                    {login.super_admin?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {new Date(login.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{login.ip_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}