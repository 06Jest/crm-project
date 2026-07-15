import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchContacts } from '../../../store/contactsSlice';
import { fetchLeads } from '../../../store/leadsSlice';
import { fetchDeals } from '../../../store/dealsSlice';
import { fetchActivities } from '../../../store/activitiesSlice';
import { fetchCustomers } from '../../../store/customersSlice';

import {
  Box, Typography, Grid, Card, CardContent,
  Button, Avatar, Chip, Tabs, Tab, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress,
  Divider, 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import { formatCurrency } from '../../../utils/dateFilters';

const ACTIVITY_COLORS: Record<string, string> = {
  call: '#1976d2', email: '#9c27b0', meeting: '#ed6c02',
  note: '#2e7d32', sms: '#0097a7',
};

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState(0);

  const { items: customers, loading: custLoading } = useSelector(
    (s: RootState) => s.customers
  );
  const { items: contacts } = useSelector((s: RootState) => s.contacts);
  const { items: leads } = useSelector((s: RootState) => s.leads);
  const { items: deals } = useSelector((s: RootState) => s.deals);
  const { items: activities } = useSelector((s: RootState) => s.activities);

  useEffect(() => {
    if (customers.length === 0) dispatch(fetchCustomers());
    if (contacts.length === 0) dispatch(fetchContacts());
    if (leads.length === 0) dispatch(fetchLeads());
    if (deals.length === 0) dispatch(fetchDeals());
    if (activities.length === 0) dispatch(fetchActivities());
  }, [dispatch]);

  // Find this company
  const company = customers.find(c => c.id === id);

  // All records linked to this company
  const companyContacts = useMemo(
    () => contacts.filter(c => (c as any).company_id === id),
    [contacts, id]
  );
  const companyLeads = useMemo(
    () => leads.filter(l => (l as any).company_id === id),
    [leads, id]
  );
  const companyDeals = useMemo(
    () => deals.filter(d => (d as any).company_id === id),
    [deals, id]
  );
  const companyActivities = useMemo(
    () => activities.filter(a =>
      (a as any).company_id === id ||
      // Also include activities linked to this company's contacts by name
      companyContacts.some(c => c.name === a.contact_name)
    ).sort((a, b) =>
      new Date(b.created_at || '').getTime() -
      new Date(a.created_at || '').getTime()
    ),
    [activities, id, companyContacts]
  );

  // Revenue stats
  const totalRevenue = useMemo(
    () => companyDeals
      .filter(d => d.stage === 'Closed Won')
      .reduce((sum, d) => sum + d.value, 0),
    [companyDeals]
  );

  const pipelineValue = useMemo(
    () => companyDeals
      .filter(d => d.stage !== 'Closed Lost')
      .reduce((sum, d) => sum + d.value, 0),
    [companyDeals]
  );

  const winRate = companyDeals.length > 0
    ? Math.round(
        (companyDeals.filter(d => d.stage === 'Closed Won').length /
         companyDeals.length) * 100
      )
    : 0;

  if (custLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Company not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/customers')}
          sx={{ mt: 2 }}
        >
          Back to customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>

      {/* ── Navigation ───────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/customers')}
          size="small"
        >
          Customers
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          /
        </Typography>
        <Button
          size="small"
          onClick={() => navigate(`/app/customers/${id}`)}
        >
          {company.name}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          / Company Profile
        </Typography>
      </Box>

      {/* ── Company header ────────────────────────── */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}>
          {/* Company avatar */}
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: 'primary.main',
              fontSize: 28,
              borderRadius: 3,
              flexShrink: 0,
            }}
          >
            {company.name[0]?.toUpperCase()}
          </Avatar>

          {/* Company info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" fontWeight={800}>
                {company.name}
              </Typography>
              <Chip
                label={company.status}
                color={
                  company.status === 'active' ? 'success'
                  : company.status === 'inactive' ? 'error'
                  : 'warning'
                }
                size="small"
              />
            </Box>

            {company.industry && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {company.industry}
              </Typography>
            )}

            {/* Contact info row */}
            <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
              {company.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LanguageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography
                    variant="caption"
                    component="a"
                    href={company.website}
                    target="_blank"
                    rel="noopener"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    {company.website.replace(/^https?:\/\//, '')}
                  </Typography>
                </Box>
              )}
              {company.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {company.email}
                  </Typography>
                </Box>
              )}
              {company.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {company.phone}
                  </Typography>
                </Box>
              )}
              {(company.city || company.country) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {[company.city, company.country].filter(Boolean).join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNewIcon />}
              onClick={() => navigate(`/app/customers/${id}`)}
            >
              Full profile
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ── Stats bar ─────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: 'Contacts',
            value: companyContacts.length,
            icon: <PeopleIcon />,
            color: 'primary.main',
          },
          {
            label: 'Leads',
            value: companyLeads.length,
            icon: <TrendingUpIcon />,
            color: 'secondary.main',
          },
          {
            label: 'Deals',
            value: companyDeals.length,
            icon: <AttachMoneyIcon />,
            color: 'warning.main',
          },
          {
            label: 'Won revenue',
            value: formatCurrency(totalRevenue),
            icon: <AttachMoneyIcon />,
            color: 'success.main',
          },
          {
            label: 'Pipeline',
            value: formatCurrency(pipelineValue),
            icon: <TrendingUpIcon />,
            color: 'info.main',
          },
          {
            label: 'Win rate',
            value: `${winRate}%`,
            icon: <EventNoteIcon />,
            color: winRate >= 50 ? 'success.main' : 'warning.main',
          },
        ].map(stat => (
          <Grid size={{xs: 6, sm: 4, md: 2}}  key={stat.label}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="h5" fontWeight={800} color={stat.color}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Content tabs ──────────────────────────── */}
      <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab
              icon={<PeopleIcon fontSize="small" />}
              iconPosition="start"
              label={`Contacts (${companyContacts.length})`}
            />
            <Tab
              icon={<TrendingUpIcon fontSize="small" />}
              iconPosition="start"
              label={`Leads (${companyLeads.length})`}
            />
            <Tab
              icon={<AttachMoneyIcon fontSize="small" />}
              iconPosition="start"
              label={`Deals (${companyDeals.length})`}
            />
            <Tab
              icon={<EventNoteIcon fontSize="small" />}
              iconPosition="start"
              label={`Activities (${companyActivities.length})`}
            />
          </Tabs>
        </Box>

        {/* ── Contacts tab ──────────────────────── */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Contacts linked to {company.name}
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => navigate('/app/contacts')}
              >
                Add contact
              </Button>
            </Box>
            {companyContacts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No contacts linked to this company yet.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  When adding or editing a contact, select this company.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyContacts.map(contact => (
                      <TableRow
                        key={contact.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/app/contacts/${contact.id}`)}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12 }}>
                              {contact.name[0]?.toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {contact.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={contact.status}
                            size="small"
                            color={contact.status === 'Active' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* ── Leads tab ─────────────────────────── */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Leads linked to {company.name}
              </Typography>
            </Box>
            {companyLeads.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No leads linked to this company yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Added</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyLeads.map(lead => (
                      <TableRow
                        key={lead.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/app/leads')}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{lead.title}</Typography>
                        </TableCell>
                        <TableCell>{lead.name}</TableCell>
                        <TableCell><Chip label={lead.status} size="small" /></TableCell>
                        <TableCell>
                          {lead.created_at
                            ? new Date(lead.created_at).toLocaleDateString()
                            : '—'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* ── Deals tab ─────────────────────────── */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Deals linked to {company.name}
              </Typography>
            </Box>
            {companyDeals.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No deals linked to this company yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Deal</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Stage</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Close date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyDeals.map(deal => (
                      <TableRow
                        key={deal.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/app/deals')}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{deal.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            {formatCurrency(deal.value)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={deal.stage}
                            size="small"
                            color={
                              deal.stage === 'Closed Won' ? 'success'
                              : deal.stage === 'Closed Lost' ? 'error'
                              : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {deal.close_date
                            ? new Date(deal.close_date).toLocaleDateString()
                            : '—'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* ── Activities tab ────────────────────── */}
        {activeTab === 3 && (
          <Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                All activities related to {company.name} and its contacts
              </Typography>
            </Box>
            {companyActivities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <EventNoteIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No activities recorded for this company yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {companyActivities.map((activity, i) => (
                  <Box key={activity.id}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: ACTIVITY_COLORS[activity.type] || '#1976d2',
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {activity.type[0].toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {activity.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.25 }}>
                          <Chip label={activity.type} size="small" sx={{ height: 18, fontSize: 10 }} />
                          {activity.contact_name && (
                            <Typography variant="caption" color="text.secondary">
                              {activity.contact_name}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {activity.created_at
                              ? new Date(activity.created_at).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric',
                                })
                              : '—'
                            }
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={activity.completed ? 'Done' : 'Pending'}
                        size="small"
                        color={activity.completed ? 'success' : 'default'}
                      />
                    </Box>
                    {i < companyActivities.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}