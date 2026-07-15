import { useEffect, useState } from 'react';
import { analyticsApi } from '../../../services/backendApi';

import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Chip, Table,
  TableBody, TableCell, TableContainer,
  TableHead, TableRow,  LinearProgress, Divider
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import StorageIcon from '@mui/icons-material/Storage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { CHART_COLORS, CHART_COLORS_ALPHA } from '../../../utils/chartColors';

ChartJS.register(
  CategoryScale, LinearScale,
  LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend
);


const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatGADate = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
};

type AnalyticsData = Awaited<ReturnType<typeof analyticsApi.getAll>>;

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



  useEffect(() => {
    analyticsApi.getAll()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error} — Make sure your Node.js backend is running.
      </Alert>
    );
  }

  const { overview, activeUsers, topPages, devices, dailyViews, featureAdoption, systemStats, subscriptionStats } = data!;
  const isMock = (data)?.mock;


  const pageViewsChartData = {
    labels: dailyViews.map(d => formatGADate(d.date)),
    datasets: [{
      label: 'Page views',
      data: dailyViews.map(d => d.views),
      borderColor: CHART_COLORS.blue,
      backgroundColor: CHART_COLORS_ALPHA.blue,
      tension: 0.3,
      fill: true,
      pointRadius: 2,
    }],
  };

  const deviceLabels = Object.keys(devices);
  const deviceData = Object.values(devices);
  const deviceColors = [CHART_COLORS.blue, CHART_COLORS.orange, CHART_COLORS.purple];

  const featureEntries = Object.entries(featureAdoption)
    .filter(([key]) => !['page_view', 'session_start', 'first_visit'].includes(key))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const maxFeatureCount = featureEntries[0]?.[1] || 1;

  return (
    <Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <SecurityIcon color="error" />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              App Analytics
            </Typography>
            <Chip label="Super Admin Only" color="error" size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Google Analytics data, system health, and subscription stats
          </Typography>
        </Box>
      </Box>

      {isMock && (
        <Alert severity="info" sx={{ mb: 3 }}>
          GA4 not configured — showing system stats only.
          Add GA4_PROPERTY_ID and service account credentials to backend .env
          to see Google Analytics data.
        </Alert>
      )}


      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VisibilityIcon fontSize="small" /> Google Analytics (Last 30 days)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid sx={{xs: 6, sm: 3}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Page views
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {overview.pageViews.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{xs: 6, sm: 3}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active users
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {overview.activeUsers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{xs: 6, sm: 3}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Sessions
              </Typography>
              <Typography variant="h4" fontWeight={800} color="secondary.main">
                {overview.sessions.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{xs: 6, sm: 3}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg. session
              </Typography>
              <Typography variant="h4" fontWeight={800} color="warning.main">
                {formatDuration(overview.avgSessionDuration)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Active today', value: activeUsers.today },
          { label: 'Active this week', value: activeUsers.week },
          { label: 'Active this month', value: activeUsers.month },
        ].map(stat => (
          <Grid sx={{xs: 6, sm: 4}} key={stat.label}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
   
        <Grid sx={{xs: 6, md: 7}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Daily page views
              </Typography>
              <Box sx={{ height: 220 }}>
                <Line
                  data={pageViewsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                        grid: { color: 'rgba(128,128,128,0.1)' },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 10 },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{xs: 6, md: 5}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                <DevicesIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Device breakdown
              </Typography>
              {deviceLabels.length > 0 ? (
                <Box sx={{ maxWidth: 220, mx: 'auto' }}>
                  <Doughnut
                    data={{
                      labels: deviceLabels.map(d => d.charAt(0).toUpperCase() + d.slice(1)),
                      datasets: [{
                        data: deviceData,
                        backgroundColor: deviceColors,
                        borderWidth: 0,
                        hoverOffset: 8,
                      }],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: { padding: 12, usePointStyle: true },
                        },
                      },
                      cutout: '60%',
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No device data yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Most visited pages
          </Typography>
          {topPages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No page view data yet. GA4 data appears after users visit your deployed app.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Page</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Views</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                    <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Relative traffic</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topPages.map((page, i) => {
                    const maxViews = topPages[0]?.views || 1;
                    const pct = Math.round((page.views / maxViews) * 100);
                    return (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {page.path}
                          </Typography>
                        </TableCell>
                        <TableCell>{page.views.toLocaleString()}</TableCell>
                        <TableCell>{page.users.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={pct}
                              sx={{ flex: 1, height: 6, borderRadius: 2 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {pct}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon fontSize="small" color="secondary" /> Feature Adoption
      </Typography>

      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, mb: 4 }}>
        <CardContent>
          {featureEntries.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No custom events yet. Add trackFeature() calls throughout your app
              to see which features are used most.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {featureEntries.map(([name, count]) => {
                const pct = Math.round((count / maxFeatureCount) * 100);
                const label = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <Box key={name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{count.toLocaleString()}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      color="secondary"
                      sx={{ height: 8, borderRadius: 2 }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>


      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon fontSize="small" /> System Health
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{xs: 6, md: 6}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Database records
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Table</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Rows</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(systemStats).map(([table, count]) => (
                      <TableRow key={table} hover>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {table}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {(count as number).toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>


        <Grid sx={{xs: 6, md: 6}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                <PeopleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Subscription stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total users</Typography>
                  <Typography variant="body2" fontWeight={700}>{subscriptionStats.totalUsers}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Pro users</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {subscriptionStats.proUsers}
                    </Typography>
                    <Chip label="Pro" size="small" color="primary" sx={{ height: 18, fontSize: 10 }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Free users</Typography>
                  <Typography variant="body2" fontWeight={700}>{subscriptionStats.freeUsers}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="body2" color="text.secondary">Conversion rate</Typography>
                    <Typography variant="body2" fontWeight={700} color="success.main">
                      {subscriptionStats.conversionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={subscriptionStats.conversionRate}
                    color="success"
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

