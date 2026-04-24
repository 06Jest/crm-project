import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchCustomers } from '../../../store/customersSlice';
import { fetchDeals } from '../../../store/dealsSlice';
import { fetchActivities } from '../../../store/activitiesSlice';

import {
  Box, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Avatar,
  CircularProgress,  MenuItem, TextField,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Bar, Line } from 'react-chartjs-2';
import type { ChartOptions, TooltipItem } from 'chart.js';


type SortMetric = 'revenue' | 'activities' | 'score';
type TimePeriod = '30' | '90' | '180' | '365' | 'all';

interface CustomerScore {
  id: string;
  name: string;
  industry?: string;
  status: string;
  revenue: number;
  activityCount: number;
  lastActivityDate: string | null;
  daysSinceLastActivity: number | null;
  engagementScore: number;
  trend: 'up' | 'down' | 'neutral';
  rank: number;
}

const formatCurrency = (value: number): string => 
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'Php',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  function Medal({ rank }: { rank: number }) {
    const colors: Record<number, string> = {
      1: '#FFD700',
      2: '#C0C0C0', 
      3: '#CD7F32',
    };

    if (rank > 3) {
      return (
        <Typography fontWeight={700} color="text.secondary">
          #{rank}
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <EmojiEventsIcon sx={{ color: colors[rank], fontSize: 20 }} />
        <Typography fontWeight={700} sx={{ color: colors[rank] }}>
          #{rank}
        </Typography>
      </Box>
    ); 
  }

  function getRowStatus(daysSince: number | null): {
      label: string;
      color: 'success' | 'warning' | 'error';
      bgcolor: string;
    } {
      if (daysSince === null || daysSince > 90) {
        return { label: 'Inactive', color: 'error', bgcolor: 'rgba(211,47,47,0.04)'};
      }
      if (daysSince > 30) {
        return { label: 'At risk', color: 'warning', bgcolor: 'rgba(237,108,2,0.04)'};
      }
      return { label: 'Active', color: 'success', bgcolor: 'rgba(46,125,50,0.04)' };
    }

    export default function CustomerLeaderboard() {
      const dispatch = useDispatch<AppDispatch>();
      const navigate = useNavigate();

      const { items: customers, loading: customersLoading } = useSelector(
        (state: RootState) => state.customers
      );

      const { items: deals, loading: dealsLoading } = useSelector(
        (state: RootState) => state.deals
      );

      const { items: activities, loading: activitiesLoading } = useSelector(
        (state: RootState) => state.activities
      )

      const [sortBy, setSortBy] = useState<SortMetric>('revenue');
      const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

      useEffect(() => {
        if (customers.length === 0) dispatch(fetchCustomers());
        if (deals.length === 0) dispatch(fetchDeals());
        if (activities.length === 0) dispatch(fetchActivities()); 
      }, [dispatch, customers.length, deals.length, activities.length]);

      const cutoffDate = useMemo(() => {
        if (timePeriod === 'all') return null;
        const date = new Date();
        date.setDate(date.getDate() - parseInt(timePeriod));
        return date;
      },[timePeriod]);

      const leaderboard = useMemo((): CustomerScore[] => {
        const now = new Date(); 

        return customers
          .map((customer) => {

            const customerDeals = deals.filter((d) => {
              const matchesCustomer = d.contact_name
                ?.toLowerCase()
                .includes(customer.name.toLowerCase());
              
              if (!matchesCustomer) return false;
              if (!cutoffDate) return true;
              return new Date(d.created_at || '') >= cutoffDate;
            });

            const customerActivities = activities.filter((a) => {
              const matchesCustomer = a.contact_name
                ?.toLowerCase()
                .includes(customer.name.toLowerCase());
              if (!matchesCustomer) return false;
              if (!cutoffDate) return true;
              return new Date(a.created_at || '') >= cutoffDate;
            });

            const revenue = customerDeals
              .filter((d) => d.stage === 'Closed Won')
              .reduce((sum, d) => sum + d.value, 0);

            const activityCount = customerActivities.length;

            const sortedActivities = [...customerActivities].sort(
            (a, b) => 
              new Date(b.created_at || '').getTime() -
              new Date(a.created_at || '').getTime()
            );

            const lastActivityDate = 
              sortedActivities[0]?.created_at || null;

            const daysSinceLastActivity = lastActivityDate
              ? Math.floor(
                  (now.getTime() - new Date(lastActivityDate).getTime()) /
                  (1000 * 60 * 60 * 24)
                )
              : null;

            const revenueScore = Math.min(revenue / 1000, 50);
            const activityScore = Math.min(activityCount * 3, 30);
            const recencyScore = 
                daysSinceLastActivity === null 
                  ? 0
                  : Math.max(0, 20 - daysSinceLastActivity * 0.2);
            
            const engagementScore = Math.round(
              revenueScore + activityScore + recencyScore
            );

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            const recentActivities = activities.filter(
              (a) => 
                a.contact_name?.toLowerCase().includes(customer.name.toLowerCase()) &&
                new Date(a.created_at || '') >= thirtyDaysAgo
            ).length;

            const olderActivities = activities.filter(
              (a) =>
                a.contact_name?.toLowerCase().includes(customer.name.toLowerCase()) &&
                new Date(a.created_at || '') >= sixtyDaysAgo &&
                new Date(a.created_at || '') < thirtyDaysAgo
            ).length;


            const trend: 'up' | 'down' | 'neutral' =
              recentActivities > olderActivities
                ? 'up'
                : recentActivities < olderActivities
                ? 'down'
                : 'neutral';
            
            return {
              id: customer.id,
              name: customer.name,
              industry: customer.industry,
              status: customer.status,
              revenue,
              activityCount,
              lastActivityDate,
              daysSinceLastActivity,
              engagementScore,
              trend,
              rank: 0,
            };
          })
          .sort((a, b) =>{
            if (sortBy === 'revenue') return b.revenue - a.revenue;
            if (sortBy === 'activities') return b.activityCount - a.activityCount;
            return b.engagementScore  - a.engagementScore;
          })
          .map((customer, index) => ({
            ...customer,
            rank: index + 1,
          }));
      }, [customers, deals, activities, sortBy, cutoffDate]);

      const top10 = leaderboard.slice(0, 10);

      const barChartData = {
        labels:top10.map((c) => c.name.length > 12
        ? c.name.slice(0, 12) + '...'
        : c.name
        ),
        datasets: [
          {
            label: 'Revenue',
            data: top10.map((c) => c.revenue),
            backgroundColor: top10.map((_, i) => 
              i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#1976d2' 
            ),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      };


      const barChartOptions:  ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false},
          tooltip:{
            callbacks:{
              label: (ctx: TooltipItem<'bar'>) => `${formatCurrency(ctx.parsed.y ?? 0)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(Number(value)),
            },
            grid: { color: 'rgba(128,128,128,0.1)' },
          },
          x: { grid: { display: false } },
        },
      };

      const lineChartData  = {
        labels: top10.map((c) => c.name.length > 12
          ? c.name.slice(0, 12) + '...'
          : c.name
        ),
        datasets: [
          {
            label: 'Activities',
            data: top10.map((c) => c.activityCount),
            borderColor: '#9c27b0',
            backgroundColor: 'rgba(156,39,176,0.1)',
            pointBackgroundColor: '#9c27b0',
            pointRadius: 5,
            tension: 0.3,
            fill: true,
          },
        ],
      };

      const lineChartOptions : ChartOptions<'line'>= {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<'line'>) => ` ${ctx.parsed.y} activities`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, precision: 0 },
            grid: { color: 'rgba(128,128,128,0.1)' },
          },
          x: { grid: { display: false } },
        },
      };

      const isLoading = customersLoading || dealsLoading || activitiesLoading;;

      if (isLoading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        );
      }

      return (
        <Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/app/customers')}
            >
              Back to customers
            </Button>
            <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
              🏆 Customer Leaderboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              label="Sort by"
              value={sortBy}
               SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              onChange={(e) => setSortBy(e.target.value as SortMetric)}
              select
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="revenue">Revenue</MenuItem>
              <MenuItem value="activities">Activity count</MenuItem>
              <MenuItem value="score">Engagement score</MenuItem>
            </TextField>

            <TextField
              label="Time period"
              value={timePeriod}
               SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              select
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="180">Last 6 months</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
              <MenuItem value="all">All time</MenuItem>
            </TextField>
          </Box>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total customers ranked
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {leaderboard.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total revenue
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="success.main">
                    {formatCurrency(leaderboard.reduce((s, c) => s + c.revenue, 0))}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Active customers
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="warning.main">
                    {leaderboard.filter((c) =>
                      c.daysSinceLastActivity !== null &&
                      c.daysSinceLastActivity <= 30
                    ).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {leaderboard.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid sx={{ xs: 12, md: 7 }}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Revenue by customer (top 10)
                    </Typography>
                    <Box sx={{ height: 240 }}>
                      <Bar data={barChartData} options={barChartOptions} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid sx={{ xs: 12, md: 5 }}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 1 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Activity by customer (top 10)
                    </Typography>
                    <Box sx={{ height: 240 }}>
                      <Line data={lineChartData} options={lineChartOptions} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {leaderboard.length === 0 ? (
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="text.secondary">
                  No customers yet. Add customers, deals, and activities
                  to see the leaderboard.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.paper' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Industry</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Activities</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last activity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trend</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.map((customer) => {
                    const rowStatus = getRowStatus(customer.daysSinceLastActivity);
                    return (
                      <TableRow
                        key={customer.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          bgcolor: rowStatus.bgcolor,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                        onClick={() => navigate(`/app/customers/${customer.id}`)}
                      >
                        <TableCell>
                          <Medal rank={customer.rank} />
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}
                            >
                              {customer.name[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {customer.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {customer.industry || '—'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="success.main"
                          >
                            {formatCurrency(customer.revenue)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {customer.activityCount}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {customer.lastActivityDate
                              ? `${customer.daysSinceLastActivity}d ago`
                              : 'Never'}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={700}>
                              {customer.engagementScore}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              / 100
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {customer.trend === 'up' && (
                            <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          )}
                          {customer.trend === 'down' && (
                            <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
                          )}
                          {customer.trend === 'neutral' && (
                            <Typography variant="caption" color="text.secondary">—</Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={rowStatus.label}
                            color={rowStatus.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      );
    }