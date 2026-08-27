import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Stack,
  Grid,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';


const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
    .ut-mono { font-family: "IBM Plex Mono", monospace; }
  `}</style>
);

interface ResourceLimit {
  active: number;
  stored: number;
}

interface PlanLimits {
  members: ResourceLimit;
  leads: ResourceLimit;
  contacts: ResourceLimit;
  deals: ResourceLimit;
  customers: ResourceLimit;
  notes: ResourceLimit;
  tasks: ResourceLimit;
  activities: ResourceLimit | null;
  messages: ResourceLimit | null;
  emails: ResourceLimit;
  sms: ResourceLimit;
  calls: ResourceLimit;
}

interface PlanRetention {
  activities: string;
  messages: string;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  cta: string;
  ctaEnabled: boolean;
  statusLabel: 'Available now' | 'Planned';
  highlight?: 'primary' | 'accent';
  icon: React.ReactNode;
  limits: PlanLimits;
  retention: PlanRetention;
}


const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Core CRM functionality for individuals and small teams getting started.',
    cta: 'Get Started',
    ctaEnabled: true,
    statusLabel: 'Available now',
    highlight: 'primary',
    icon: <RocketLaunchRoundedIcon fontSize="small" />,
    limits: {
      members: { active: 3, stored: 5 },
      leads: { active: 100, stored: 200 },
      contacts: { active: 100, stored: 200 },
      deals: { active: 50, stored: 100 },
      customers: { active: 100, stored: 200 },
      notes: { active: 500, stored: 1000 },
      tasks: { active: 500, stored: 1000 },
      activities: null,
      messages: null,
      emails: { active: 1000, stored: 2000 },
      sms: { active: 500, stored: 1000 },
      calls: { active: 500, stored: 1000 },
    },
    retention: { activities: '3 months', messages: '3 months' },
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'More capacity for growing teams and expanding customer data.',
    cta: 'Coming Soon',
    ctaEnabled: false,
    statusLabel: 'Planned',
    icon: <BoltRoundedIcon fontSize="small" />,
    limits: {
      members: { active: 10, stored: 20 },
      leads: { active: 1000, stored: 2000 },
      contacts: { active: 1000, stored: 2000 },
      deals: { active: 500, stored: 1000 },
      customers: { active: 1000, stored: 2000 },
      notes: { active: 3000, stored: 6000 },
      tasks: { active: 3000, stored: 6000 },
      activities: null,
      messages: null,
      emails: { active: 5000, stored: 10000 },
      sms: { active: 2500, stored: 5000 },
      calls: { active: 2500, stored: 5000 },
    },
    retention: { activities: '12 months', messages: '12 months' },
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Higher limits for collaborative CRM teams managing larger pipelines.',
    cta: 'Coming Soon',
    ctaEnabled: false,
    statusLabel: 'Planned',
    icon: <GroupsRoundedIcon fontSize="small" />,
    limits: {
      members: { active: 50, stored: 100 },
      leads: { active: 5000, stored: 10000 },
      contacts: { active: 5000, stored: 10000 },
      deals: { active: 2000, stored: 5000 },
      customers: { active: 5000, stored: 10000 },
      notes: { active: 10000, stored: 20000 },
      tasks: { active: 10000, stored: 20000 },
      activities: null,
      messages: null,
      emails: { active: 20000, stored: 50000 },
      sms: { active: 10000, stored: 20000 },
      calls: { active: 10000, stored: 20000 },
    },
    retention: { activities: '36 months', messages: '36 months' },
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Large-scale CRM capacity for established organizations.',
    cta: 'Coming Soon',
    ctaEnabled: false,
    statusLabel: 'Planned',
    icon: <ApartmentRoundedIcon fontSize="small" />,
    limits: {
      members: { active: 200, stored: 400 },
      leads: { active: 20000, stored: 40000 },
      contacts: { active: 20000, stored: 40000 },
      deals: { active: 10000, stored: 20000 },
      customers: { active: 20000, stored: 40000 },
      notes: { active: 50000, stored: 100000 },
      tasks: { active: 50000, stored: 100000 },
      activities: null,
      messages: null,
      emails: { active: 50000, stored: 100000 },
      sms: { active: 25000, stored: 50000 },
      calls: { active: 25000, stored: 50000 },
    },
    retention: { activities: '60 months', messages: '60 months' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Maximum capacity for organizations operating at significant scale.',
    cta: 'Contact Us',
    ctaEnabled: false,
    statusLabel: 'Planned',
    highlight: 'accent',
    icon: <WorkspacePremiumRoundedIcon fontSize="small" />,
    limits: {
      members: { active: 500, stored: 1000 },
      leads: { active: 100000, stored: 200000 },
      contacts: { active: 100000, stored: 200000 },
      deals: { active: 50000, stored: 100000 },
      customers: { active: 100000, stored: 200000 },
      notes: { active: 200000, stored: 400000 },
      tasks: { active: 200000, stored: 400000 },
      activities: null,
      messages: null,
      emails: { active: 200000, stored: 400000 },
      sms: { active: 100000, stored: 200000 },
      calls: { active: 100000, stored: 200000 },
    },
    retention: { activities: 'Unlimited', messages: 'Unlimited' },
  },
];

type LimitKey = keyof PlanLimits;

const CRM_RECORDS_FIELDS: { key: LimitKey; label: string }[] = [
  { key: 'members', label: 'Members' },
  { key: 'leads', label: 'Leads' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'deals', label: 'Deals' },
  { key: 'customers', label: 'Customers' },
];

const PRODUCTIVITY_FIELDS: { key: LimitKey; label: string }[] = [
  { key: 'tasks', label: 'Tasks' },
  { key: 'notes', label: 'Notes' },
  { key: 'activities', label: 'Activities' },
  { key: 'messages', label: 'Messages' },
];

const COMMUNICATIONS_FIELDS: { key: LimitKey; label: string }[] = [
  { key: 'emails', label: 'Emails' },
  { key: 'sms', label: 'SMS' },
  { key: 'calls', label: 'Calls' },
];

const HIGHLIGHT_FIELDS: { key: LimitKey; label: string }[] = [
  { key: 'members', label: 'Members' },
  { key: 'leads', label: 'Leads' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'deals', label: 'Deals' },
  { key: 'customers', label: 'Customers' },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  { q: 'Is the Free plan available?', a: 'Yes. The Free plan is currently available during Beta.' },
  { q: 'Are paid plans available?', a: 'Not yet. Starter, Team, Business, and Enterprise are planned paid tiers.' },
  { q: 'Can I upgrade now?', a: 'Paid upgrades are not currently available if billing has not been activated.' },
  { q: 'Will pricing change?', a: 'Paid pricing has not been finalized and may change before the paid plans launch.' },
  { q: 'Is there monthly billing?', a: 'Monthly billing is part of the planned subscription model.' },
  { q: 'Is there yearly billing?', a: 'Yearly billing is part of the planned subscription model.' },
  {
    q: 'What happens when I reach a resource limit?',
    a: 'Resource limits are designed to prevent an organization from exceeding its plan capacity. The specific in-app experience for reaching a limit depends on the resource and is not detailed here.',
  },
  {
    q: 'What does retention mean?',
    a: 'Activities and messages have plan-specific retention periods, meaning historical records of these types are kept for a defined length of time before aging out.',
  },
  {
    q: 'Does Enterprise have unlimited storage?',
    a: 'No. Enterprise has defined storage limits for CRM resources, but activity and message retention are unlimited.',
  },
];


const fmt = (n: number): string => n.toLocaleString('en-US');

const fmtLimit = (limit: ResourceLimit | null): string =>
  limit ? `${fmt(limit.active)} / ${fmt(limit.stored)}` : 'Not itemized on this plan';

const scrollToComparison = () => {
  document.getElementById('plan-comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ThreadScale: React.FC = () => {
  const sizes = [7, 9, 11, 14, 18];
  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        
        gap: { xs: 1, sm: 2 },
        px: 2,
        mb: { xs: 3, md: 4 },
      }}
    >
      {sizes.map((size, i) => (
        <React.Fragment key={i}>
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: i === sizes.length - 1 ? 'secondary.main' : 'primary.main',
              opacity: 0.35 + i * 0.16,
            }}
          />
          {i < sizes.length - 1 && (
            <Box
              sx={{
                flex: 1,
                maxWidth: { xs: 28, sm: 56 },
                height: '2px',
                bgcolor: 'primary.main',
                opacity: 0.25,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

const PlanCard: React.FC<{ plan: Plan; billingCycle: 'monthly' | 'yearly' }> = ({ plan }) => {
  const isFree = plan.id === 'free';
  const borderColor = plan.highlight === 'primary' ? 'primary.main' : plan.highlight === 'accent' ? 'secondary.main' : 'divider';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderWidth: plan.highlight ? 2 : 1,
        borderRadius: 5,
        borderColor,
        boxShadow: plan.highlight === 'primary' ? '0 12px 32px -16px rgba(47,75,158,0.35)' : 'none',
        position: 'relative',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>
        <Stack direction="row" spacing={0} sx={{ mb: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: plan.highlight === 'accent' ? 'secondary.main' : 'primary.main',
                color: '#fff',
              }}
            >
              {plan.icon}
            </Box>
            <Typography variant="h6">{plan.name}</Typography>
          </Stack>
          <Chip
            size="small"
            label={plan.statusLabel}
            color={plan.statusLabel === 'Available now' ? 'success' : 'default'}
            variant={plan.statusLabel === 'Available now' ? 'filled' : 'outlined'}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {plan.tagline}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {isFree ? (
            <Typography variant="h4">Free</Typography>
          ) : (
            <Typography variant="h6" color="text.secondary">
              Pricing coming soon
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1} sx={{ mb: 2 }}>
          {HIGHLIGHT_FIELDS.map((field) => (
            <Stack key={field.key} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography variant="body2" color="text.secondary">
                {field.label}
              </Typography>
              <Typography variant="body2" className="ut-mono">
                {fmtLimit(plan.limits[field.key])}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          size="small"
          onClick={scrollToComparison}
          sx={{ alignSelf: 'flex-start', px: 0, minWidth: 0, mb: 2 }}
        >
          Compare all limits ↓
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {plan.ctaEnabled ? (
          <Button variant="contained" color="primary" fullWidth size="large" onClick={() => {}}>
            {plan.cta}
          </Button>
        ) : (
          <Tooltip
            title={
              plan.id === 'enterprise'
                ? 'Enterprise is a planned tier. Contact details have not been published yet.'
                : 'Paid plans are not yet available during Beta.'
            }
          >
            <span>
              <Button
                variant="outlined"
                color={plan.highlight === 'accent' ? 'secondary' : 'primary'}
                fullWidth
                size="large"
                disabled
              >
                {plan.cta}
              </Button>
            </span>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};


const ComparisonTable: React.FC<{
  fields: { key: LimitKey; label: string }[];
}> = ({ fields }) => (
  <Box sx={{ overflowX: 'auto' }}>
    <TableContainer>
      <Table size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Resource</TableCell>
            {PLANS.map((plan) => (
              <TableCell key={plan.id} sx={{ fontWeight: 700 }}>
                {plan.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.key}>
              <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>
                {field.label}
              </TableCell>
              {PLANS.map((plan) => (
                <TableCell key={plan.id} className="ut-mono">
                  {fmtLimit(plan.limits[field.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

const RetentionTable: React.FC = () => (
  <Box sx={{ overflowX: 'auto' }}>
    <TableContainer>
      <Table size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Retention</TableCell>
            {PLANS.map((plan) => (
              <TableCell key={plan.id} sx={{ fontWeight: 700 }}>
                {plan.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>
              Activity retention
            </TableCell>
            {PLANS.map((plan) => (
              <TableCell key={plan.id} className="ut-mono">
                {plan.retention.activities}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" sx={{ color: 'text.secondary' }}>
              Message retention
            </TableCell>
            {PLANS.map((plan) => (
              <TableCell key={plan.id} className="ut-mono">
                {plan.retention.messages}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);


const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleBillingChange = (_: React.MouseEvent<HTMLElement>, value: 'monthly' | 'yearly' | null) => {
    if (value) setBillingCycle(value);
  };

  return (
    <Box >
      <FontImports />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 6, md: 10 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, sm: 3, md: 5 } }}>
          <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Chip
              icon={<ScienceRoundedIcon />}
              label="Beta"
              color="primary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
              Simple plans that scale with you.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 620, fontWeight: 400 }}>
              Start with the essentials, then scale your workspace as your team, customers, and business grow.
            </Typography>

            <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mt: 2, maxWidth: 640, textAlign: 'left' }}>
              uniThread CRM is currently in Beta. The Free plan is available while paid plans and billing
              infrastructure are being prepared.
            </Alert>
          </Stack>

          <Stack spacing={1} sx={{ alignItems: 'center', mb: { xs: 4, md: 5 } }}>
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={handleBillingChange}
              size="small"
              color="primary"
              aria-label="Billing cycle"
            >
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary">
              {billingCycle === 'yearly'
                ? 'Yearly billing is part of the planned subscription model and is not yet available for purchase.'
                : 'Pricing for paid plans has not been finalized yet.'}
            </Typography>
          </Stack>

          <ThreadScale />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: 3,
              mb: { xs: 6, md: 8 },
            }}
          >
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billingCycle={billingCycle} />
            ))}
          </Box>

          <Box id="plan-comparison" sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Compare plans in detail
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
              Every plan defines limits for CRM records, productivity tools, and communications, plus how long
              certain data is retained.
            </Typography>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, mb: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                How to read these limits
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Active limit
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The maximum number of currently active records allowed by the plan.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Store limit
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        The maximum number of records that can be retained in the organization&rsquo;s stored
                        dataset. Store limits are separate from, and generally higher than, active limits.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Retention
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        How long certain historical activity and message data is retained.
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Accordion defaultExpanded variant="outlined">
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <PeopleAltRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1">CRM Records</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <ComparisonTable fields={CRM_RECORDS_FIELDS} />
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" sx={{ mt: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <TaskAltRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1">Productivity</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Activity and message counts are not itemized separately on the Free plan; only their retention
                  periods are defined.
                </Typography>
                <ComparisonTable fields={PRODUCTIVITY_FIELDS} />
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" sx={{ mt: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <ForumRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1">Communications</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <ComparisonTable fields={COMMUNICATIONS_FIELDS} />
              </AccordionDetails>
            </Accordion>

            <Accordion variant="outlined" sx={{ mt: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <HistoryRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1">Retention</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <RetentionTable />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Billing &amp; payment
            </Typography>
            <Alert severity="warning" icon={<PaymentsRoundedIcon />} sx={{ mb: 3 }}>
              Paid subscription billing is not yet available in the Beta.
            </Alert>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                    Planned payment providers
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5, rowGap: 1 }}>
                    {['Stripe', 'PayPal', 'GCash', 'Maya'].map((provider) => (
                      <Chip key={provider} label={`${provider} · Planned`} variant="outlined" />
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    These providers are planned for the subscription system. None are currently connected, and no
                    payments can be made through them today.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                    Billing cycles
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5, rowGap: 1 }}>
                    {['None', 'Monthly', 'Yearly'].map((cycle) => (
                      <Chip key={cycle} label={cycle} variant="outlined" />
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Monthly and yearly cycles are part of the subscription architecture, but paid checkout is not
                    currently active for either cycle.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Subscription status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
              Not every state below can currently occur, since paid billing has not launched yet.
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Active', icon: <CheckCircleRoundedIcon fontSize="small" />, color: 'success' as const, desc: 'The subscription is currently active.' },
                { label: 'Cancelled', icon: <CancelRoundedIcon fontSize="small" />, color: 'default' as const, desc: 'The subscription has been cancelled.' },
                { label: 'Expired', icon: <EventBusyRoundedIcon fontSize="small" />, color: 'default' as const, desc: 'The subscription period has ended.' },
                { label: 'Past Due', icon: <WarningAmberRoundedIcon fontSize="small" />, color: 'warning' as const, desc: 'A payment or billing issue requires attention.' },
              ].map((state) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={state.label}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
                    <Chip icon={state.icon} label={state.label} color={state.color} size="small" sx={{ mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {state.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Cancellation
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <AutorenewRoundedIcon color="primary" sx={{ mt: 0.3 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    Cancel at period end
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The subscription architecture supports cancelling at period end, meaning a subscription can
                    remain active until the current billing period finishes rather than ending immediately. Paid
                    cancellation functionality will depend on the availability of paid billing.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <HelpOutlineRoundedIcon color="primary" />
              <Typography variant="h4">Frequently asked questions</Typography>
            </Stack>
            {FAQ_ITEMS.map((item, idx) => (
              <Accordion key={idx} variant="outlined" sx={{ mt: idx === 0 ? 0 : 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                  <Typography variant="subtitle1">{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />
          <Typography variant="caption" color="text.secondary" component="p" sx={{ textAlign: 'center' }}>
            Limits and features reflect the current Beta subscription architecture and may change before general
            availability.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;