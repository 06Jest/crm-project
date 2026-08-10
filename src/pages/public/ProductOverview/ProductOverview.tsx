
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import CallIcon from '@mui/icons-material/Call';
import ForumIcon from '@mui/icons-material/Forum';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import HistoryIcon from '@mui/icons-material/History';
import GroupsIcon from '@mui/icons-material/Groups';
import MailIcon from '@mui/icons-material/Mail';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HubIcon from '@mui/icons-material/Hub';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PaymentIcon from '@mui/icons-material/Payment';



const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

const kanbanGlide = keyframes`
  0% {
    transform: translateX(0);
    opacity: 0;
  }

  8% {
    opacity: 1;
  }

  /* Prospecting */
  24% {
    transform: translateX(0);
    opacity: 1;
  }

  /* Proposal */
  40% {
    transform: translateX(170px);
    opacity: 1;
  }

  /* Negotiation */
  56% {
    transform: translateX(330px);
    opacity: 1;
  }

  /* Won */
  72% {
    transform: translateX(500px);
    opacity: 1;
  }

  90% {
    transform: translateX(450px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 0;
  }
`;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (event) => setReduced(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function Reveal({ children, delay = 0, sx = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}


function SectionHeader({ eyebrow, title, description, align = 'left', maxWidth = 640 }) {
  return (
    <Box sx={{ textAlign: align, mb: 4 }}>
      <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
        {eyebrow}
      </Typography>
      <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: description ? 1.5 : 0 }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          lineHeight={1.7}
          sx={{ maxWidth, ...(align === 'center' && { mx: 'auto' }) }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

function ChipGroup({ items, color = 'default' }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          size="small"
          variant="outlined"
          color={color}
          sx={{
            transition: 'transform 0.15s ease, background-color 0.15s ease',
            '&:hover': { transform: 'translateY(-1px)', bgcolor: 'action.hover' },
            p: '3px 8px'
          }}
        />
      ))}
    </Box>
  );
}

function BulletList({ items }) {
  return (
    <Stack spacing={1.25}>
      {items.map((item: string) => (
        <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ color: 'primary.main', mt: 0.3, display: 'flex' }}>
            { <CheckCircleIcon fontSize="small" />}
          </Box>
          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {item}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function StageFlow({ steps, branches }) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={step}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Chip
              label={step}
              sx={{
                fontWeight: 700,
                px: 1.5,
                py: 2.5,
                fontSize: '0.9rem',
                border: 1,
                borderColor: 'primary.main',
                bgcolor: 'transparent',
                color: 'primary.main',
                transition: 'transform 0.25s ease, background-color 0.25s ease, color 0.25s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  transform: 'translateY(-2px)',
                },
              }}
            />
            {index < steps.length - 1 && (
              <>
                <ArrowDownwardIcon sx={{ color: 'text.disabled', display: { xs: 'block', sm: 'none' } }} />
                <ArrowForwardIcon sx={{ color: 'text.disabled', display: { xs: 'none', sm: 'block' } }} />
              </>
            )}
          </Box>
        ))}
      </Box>

      {branches && (
        <Grid container spacing={2} sx={{ mt: 3 }} justifyContent="center">
          {branches.map((branch) => (
            <Grid size={{ xs: 12, sm: 6 }} key={branch.label} sx={{ maxWidth: 320, mx: 'auto' }}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: branch.tone === 'positive' ? 'success.main' : 'divider',
                  borderRadius: 3,
                  textAlign: 'center',
                  py: 2,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
                }}
              >
                <Typography fontWeight={700} color={branch.tone === 'positive' ? 'success.main' : 'text.secondary'}>
                  {branch.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, mt: 0.5 }}>
                  {branch.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}


const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Journey' },
  { id: 'leads', label: 'Leads' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'deals', label: 'Deals' },
  { id: 'customers', label: 'Customers' },
  { id: 'communications', label: 'Communications' },
  { id: 'activities', label: 'Activities' },
  { id: 'team', label: 'Team' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'security', label: 'Security' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'subscription', label: 'Plans' },
  { id: 'stack', label: 'Tech stack' },
  { id: 'roadmap', label: 'Roadmap' },
];

const VALUES = [
  {
    title: 'Simple by design',
    description:
      'CRM tools are often bloated and complex. uniThread CRM is built to do the essentials extremely well: contacts, leads, deals, and communication.',
  },
  {
    title: 'Built for real teams',
    description:
      'Designed around a clear owner, manager, and agent structure. Every record tracks who did what, giving your organization full visibility.',
  },
  {
    title: 'Privacy first',
    description:
      'Your data is yours. Row level security means each organization is completely isolated. Data is never shared or sold.',
  },
  {
    title: 'Always improving',
    description:
      'uniThread is actively developed. Analytics and new integrations are added with every milestone.',
  },
];

const LIFECYCLE_STAGES = [
  {
    id: 'lead',
    label: 'Lead',
    icon: <PersonSearchIcon />,
    description: 'A potential customer came from an inquiry, referral or ads response',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <ContactPageIcon />,
    description: 'A qualified lead with a complete profile, ready for ongoing communication.',
  },
  {
    id: 'deal',
    label: 'Deal',
    icon: <HandshakeIcon />,
    description: 'An active sales opportunity moving through customizable pipeline stages.',
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: <CheckCircleIcon />,
    description: 'A won deal that becomes a managed, long-term client relationship.',
  },
];

const COMMUNICATION_CHANNELS = [
  {
    id: 'email',
    title: 'Email',
    status: 'Live',
    icon: <EmailIcon />,
    description:
      'Built-in email lets a user send a message directly from a contact record, with the full history kept alongside every other interaction.',
    features: ['Rich text editor', 'Subject and body composition', 'Full email history per contact', 'Automatic activity logging'],
  },
  {
    id: 'sms',
    title: 'SMS',
    status: 'Simulated',
    icon: <SmsIcon />,
    description:
      'SMS is currently implemented as a simulation. Messages are stored inside the CRM to demonstrate the complete workflow without requiring a paid provider.',
    features: ['Messages stored inside the CRM', 'Demonstrates the full messaging workflow', 'Twilio integration planned for a future release'],
  },
  {
    id: 'calls',
    title: 'Calls',
    status: 'Simulated',
    icon: <CallIcon />,
    description: 'Phone calls are currently simulated. Users log the outcome, notes and duration of a call directly on the contact record.',
    features: ['Log call outcome', 'Record call duration', 'Attach call notes', 'VoIP provider integration planned'],
  },
  {
    id: 'chat',
    title: 'Chat',
    status: 'Live',
    icon: <ForumIcon />,
    description:
      'Team members message each other directly inside the CRM, with the option to attach a contact or customer to the conversation.',
    features: ['Real time team messaging', 'Full conversation history', 'Attach a contact or customer to a conversation'],
  },
  {
    id: 'tasks',
    title: 'Tasks',
    status: 'Live',
    icon: <TaskAltIcon />,
    description: 'Tasks keep follow-ups on schedule, whether assigned to a teammate or kept as a personal reminder.',
    features: ['Assign a task to a team member', 'Add personal tasks', 'Set deadlines', 'Mark a task public or private'],
  },
  {
    id: 'notes',
    title: 'Notes',
    status: 'Live',
    icon: <StickyNote2Icon />,
    description: 'Notes capture context on a lead or contact that would otherwise get lost between conversations.',
    features: ['Attach notes to leads and contacts', 'Keep personal notes', 'Mark a note public or private'],
  },
];

const ACTIVITY_EXAMPLES = [
  'Lead created',
  'Contact updated',
  'Deal won',
  'Customer created',
  'Email sent',
  'SMS sent',
  'Call completed',
  'Member invited',
  'Member promoted to Manager',
  'Member removed',
];

const ROLES = [
  {
    role: 'Owner',
    icon: <WorkspacePremiumIcon />,
    permissions: ['Full workspace access', 'Billing and subscription management', 'Organization settings', 'Member management'],
  },
  {
    role: 'Manager',
    icon: <GroupsIcon />,
    permissions: ['Team management', 'CRM management', 'Invite new members', 'Manage deals and contacts'],
  },
  {
    role: 'Agent',
    icon: <PersonSearchIcon />,
    permissions: ['Daily CRM operations', 'Manage leads', 'Manag contacts and deals', 'Managed customers'],
  },
];

const DASHBOARD_WIDGETS = [
  'Total leads',
  'Total contacts',
  'Total deals',
  'Total customers',
  'Pipeline summary',
  'Recent activity',
  'Business statistics',
  'Visual charts',
];

const SECURITY_FEATURES = [
  {
    title: 'Authentication',
    icon: <LockIcon />,
    items: ['JWT based authentication', 'Secure login', 'Email verification', 'Password reset flow'],
  },
  {
    title: 'Authorization',
    icon: <VerifiedUserIcon />,
    items: ['Role based authorization', 'Backend authorization on every request', 'Protected REST APIs', 'Request validation with Zod'],
  },
  {
    title: 'Data isolation',
    icon: <HubIcon />,
    items: ['Row level security in PostgreSQL', 'Organization scoped queries', 'Complete multi tenant isolation', 'Role based tenant permissions'],
  },
];

const SUBSCRIPTION_PLANS = [
  { name: 'Free', status: 'Available' },
  { name: 'Starter', status: 'Coming soon' },
  { name: 'Team', status: 'Coming soon' },
  { name: 'Business', status: 'Coming soon' },
  { name: 'Enterprise', status: 'Coming soon' },
];

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: <CodeIcon />,
    color: '#1976d2',
    items: [
      'React 18 + TypeScript',
      'Material UI v5',
      'Redux Toolkit',
      'React Router v6',
      'Chart.js + react-chartjs-2',
      '@hello-pangea/dnd',
    ],
  },
  {
    category: 'Backend & Database',
    icon: <StorageIcon />,
    color: '#2e7d32',
    items: [
      'Supabase (PostgreSQL)',
      'Supabase Auth',
      'Supabase Realtime',
      'Row Level Security',
      'Node.js + Express (coming)',
      'RESTful API',
    ],
  },
  {
    category: 'Integrations',
    icon: <SpeedIcon />,
    color: '#ed6c02',
    items: [
      'Resend',
      'Gcash(coming soon)',
      'Stripe (coming soon)',
      'Twilio SMS and Calls (coming soon)',
      'AI Assistant (coming)',
      'Leaflet (coming)',
    ],
  },
  {
    category: 'Security & Deployment',
    icon: <SecurityIcon />,
    color: '#9c27b0',
    items: [
      'Supabase RLS policies',
      'Supabase Auth sessions',
      '3-tier role system',
      'Vercel (frontend)',
      'Railway (backend)',
      'GitHub Actions CI/CD',
    ],
  },
];

const ROADMAP_GROUPS = [
  {
    category: 'Core data',
    items: [
      'Company records', 'Address fields', 'Archiving', 'Notifications', 'Time zone support',
      'Multi currency support', 'International phone numbers', 'Leaderboard', 'Advanced analytics',
      'Bulk data migration', 'Calendar view', 'Avatar uploads',
    ],
  },
  {
    category: 'Experience',
    items: ['Mute conversations', 'Typing indicators', 'Online presence', 'Email templates', 'Unread Counts'],
  },
  {
    category: 'AI',
    items: ['Contact insights', 'Deal summaries', 'Predictive scoring', 'AI chat assistant', 'Reply templates', 'Retrieval augmented answers'],
  },
  {
    category: 'Performance',
    items: ['Realtime updates over WebSocket', 'Response caching', 'Paginated data tables', 'Search Optimization'],
  },
  {
    category: 'Polish',
    items: ['Loading states', 'Micro animations', 'Data placeholders', 'Guided tutorials'],
  },
  {
    category: 'Administration',
    items: ['Super admin console'],
  },
];


function CommunicationsPanel() {
  const [tab, setTab] = useState(COMMUNICATION_CHANNELS[0].id);
  const active = COMMUNICATION_CHANNELS.find((c) => c.id === tab);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <Tabs
        value={tab}
        onChange={(_, val) => setTab(val)}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",

          "& .MuiTabs-scroller": {
            display: "flex",
            justifyContent: "center",
          },

          "& .MuiTabs-flexContainer": {
            justifyContent: "center",
          },

          "& .MuiTab-root": {
            flex: "0 0 auto",
            textTransform: "none",
            fontWeight: 600,
            minHeight: 48,
            minWidth: 0,
            px: 2,
          },
        }}
      >
        {COMMUNICATION_CHANNELS.map((c) => (
          <Tab
            key={c.id}
            value={c.id}
            icon={c.icon}
            iconPosition="start"
            label={c.title}
          />
        ))}
      </Tabs>

      <Box
        sx={{
          width: "100%",
          minHeight: 180,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          key={active?.id}
          sx={{
            width: '100%',
            animation: `${fadeInUp} 0.4s ease`,
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              mx: 7,
              justifyContent: 'space-between'
            }}
          >
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {active?.icon}
                </Avatar>

                <Box>
                  <Typography fontWeight={700}>
                    {active?.title}
                  </Typography>

                  <Chip
                    label={active?.status}
                    size="small"
                    color={
                      active?.status === "Live"
                        ? "success"
                        : "default"
                    }
                    variant="outlined"
                    sx={{ mt: 0.3 }}
                  />
                </Box>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.7}
              >
                {active?.description}
              </Typography>
            </Grid>

            <Grid
              size={{ xs: 12, md: 5 }}
            >
              <BulletList items={active?.features} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}


function KanbanPreview() {
  return (
    <Box sx={{ position: 'relative', display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {['Prospecting', 'Proposal', 'Negotiation', 'Won'].map((col) => (
        <Box
          key={col}
          sx={{
            minWidth: 150,
            flex: '0 0 150px',
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Typography variant="caption" fontWeight={700} color="text.secondary">
            {col.toUpperCase()}
          </Typography>
          <Box sx={{ mt: 1, height: 56, borderRadius: 1.5, border: 1, borderColor: 'divider', borderStyle: 'dashed' }} />
        </Box>
      ))}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 50,
          left: 14,
          width: 110,
          height: 44,
          borderRadius: 1.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          boxShadow: 3,
          animation: `${kanbanGlide} 8s ease-in-out infinite`,
        }}
      >
        Deal card
      </Box>
    </Box>
  );
}


export default function ProductOverview() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(NAV_SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box>
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.06,
            animation: `${floatSlow} 7s ease-in-out infinite`,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: -80,
            right: -40,
            width: 240,
            height: 240,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            opacity: 0.05,
            animation: `${floatSlow} 9s ease-in-out infinite`,
            animationDelay: '1.5s',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Reveal>
            <Chip label="Product Overview" color="primary" variant="outlined" sx={{ mb: 2, fontWeight: 600 }} />
          </Reveal>
          <Reveal delay={0.08}>
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              One workspace for the entire
              <Box component="span" color="primary.main"> customer lifecycle</Box>
            </Typography>
          </Reveal>
          <Reveal delay={0.16}>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7, mb: 4 }}>
              uniThread CRM is a multi-tenant CRM platform for managing leads, contacts, deals, and customers,
              with communication and team collaboration built directly into the workflow.
            </Typography>
          </Reveal>
          <Reveal delay={0.24}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => scrollToSection('journey')}
                sx={{ fontWeight: 700, px: 4, transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}
              >
                See how it works
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 700, px: 4, transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}
              >
                Create free account
              </Button>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={activeSection}
            onChange={(event, val) => scrollToSection(val)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 48 }}
          >
            {NAV_SECTIONS.map((s) => (
              <Tab key={s.id} value={s.id} label={s.label} sx={{ minHeight: 48, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }} />
            ))}
          </Tabs>
        </Container>
      </Box>

 
      <Box id="overview" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <SectionHeader eyebrow="Overview" title="Built for organizations, not just individuals" />
                <Typography variant="body1" color="text.secondary" lineHeight={1.8} sx={{ mb: 2 }}>
                  uniThread CRM is a multi-tenant software-as-a-service CRM. Every organization that signs up
                  receives its own workspace, with isolated leads, contacts, deals, customer records,
                  and team members, all running on a single shared deployment.
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8} sx={{ mb: 2 }}>
                  Because isolation is enforced at the database level, one organization can never see or
                  query another organization's data, even though they share the same infrastructure.
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                  The platform is designed for startups, small businesses, and growing sales teams that
                  need a system built around scalability, security, and day to day productivity.
                </Typography>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {VALUES.map((value, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={value.title}>
                    <Reveal delay={i * 0.08}>
                      <Card
                        elevation={0}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 3,
                          height: '100%',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" fontWeight={700} gutterBottom>
                            {value.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                            {value.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="journey" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Customer journey"
              title="The complete CRM workflow"
              description="Every record in uniThread CRM moves through the same lifecycle, from first contact to a long-term customer relationship."
              align="center"
              maxWidth={620}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <StageFlow steps={['Lead', 'Contact', 'Deal', 'Customer']} />
          </Reveal>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {LIFECYCLE_STAGES.map((stage, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stage.id}>
                <Reveal delay={0.15 + i * 0.08}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 1.5 }}>{stage.icon}</Avatar>
                      <Typography fontWeight={700} gutterBottom>
                        {stage.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                        {stage.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box id="leads" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal>
                <SectionHeader
                  eyebrow="01 · Leads"
                  title="Lead management"
                  description="A lead represents a potential customer. Leads are usually imported or created manually after an inquiry, referral, advertisement response, or cold outreach."
                />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Available actions
                </Typography>
                <ChipGroup  items={['Create', 'Edit', 'Delete', 'Search', 'Filter', 'Assign tags', 'Record notes', 'Track activities', 'Convert to contact']} />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal delay={0.1}>
                <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: { xs: 2, md: 4 } }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>
                    EXAMPLE LEAD PIPELINE
                  </Typography>
                  <StageFlow
                    steps={['New', 'Contacted']}
                    branches={[
                      { label: 'Qualified', description: 'Converted into a Contact for ongoing communication.', tone: 'positive' },
                      { label: 'Not qualified', description: 'Closed and kept on record for future reference.', tone: 'neutral' },
                    ]}
                  />
                </Card>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box id="contacts" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <SectionHeader
                  eyebrow="02 · Contacts"
                  title="Contact management"
                  description="Once a lead is qualified, it converts into a Contact. Contacts store detailed customer information and become the central record for every future communication."
                />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Stored information
                </Typography>
                <ChipGroup items={['Name', 'Email', 'Phone number', 'Company', 'Position', 'Address', 'Website', 'Notes', 'Tags', 'Status', 'Connected accounts']} />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal delay={0.1}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Supported actions
                </Typography>
                <BulletList
                  items={[
                    'Create, update, delete, search, and filter contacts',
                    'Send an email directly from the contact record',
                    'Send a simulated SMS message',
                    'Log a simulated phone call',
                    'Create a deal directly from a contact',
                  ]}
                />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box id="deals" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="03 · Deals"
              title="Deal management"
              description="Deals represent active sales opportunities. Every deal moves through customizable pipeline stages until it is won or lost."
              align="center"
              maxWidth={640}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Card
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                mb: 5,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                textAlign={'center'}
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                DRAG AND DROP KANBAN BOARD
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <KanbanPreview />
              </Box>
            </Card>
          </Reveal>

          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Each deal stores
                </Typography>
                <ChipGroup items={['Deal title', 'Deal value', 'Owner', 'Stage', 'Contact', 'Notes', 'Activities']} />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal delay={0.1}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Pipeline features
                </Typography>
                <BulletList
                  items={[
                    'Drag and drop Kanban board',
                    'Full stage history per deal',
                    'Automatic activity logging on every created, won and lost',
                    'Deal statistics across the pipeline',
                  ]}
                />
              </Reveal>
            </Grid>
          </Grid>

          <Reveal delay={0.15}>
            <Box sx={{ mt: 6 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 3, textAlign: 'center' }}>
                EXAMPLE DEAL PIPELINE
              </Typography>
              <StageFlow
                steps={['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']}
                branches={[
                  { label: 'Won', description: 'Converted into a Customer record.', tone: 'positive' },
                  { label: 'Lost', description: 'Closed and archived with full history.', tone: 'neutral' },
                ]}
              />
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Box id="customers" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="md">
          <Reveal>
            <SectionHeader
              eyebrow="04 · Customers"
              title="Customer management"
              description="Once a deal is marked Won, it can be converted into a Customer. Customer records let organizations manage the relationship after the sale is complete."
              align="center"
              maxWidth={640}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ChipGroup items={['Contact details', 'Customer status', 'Purchase history', 'Activities', 'Notes']} />
            </Box>
          </Reveal>
        </Container>
      </Box>

      <Box id="communications" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Communications"
              title="Every conversation, in one place"
              description="Each contact supports multiple communication channels, all logged automatically to the activity timeline."
              align="center"
              maxWidth={620}
            />
          </Reveal>
          <Reveal delay={0.1}>
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
              p: { xs: 2, md: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CommunicationsPanel />
            </Box>
          </Card>
        </Reveal>
        </Container>
      </Box>

      <Box id="activities" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="md">
          <Reveal>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <HistoryIcon />
              </Avatar>
              <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                Activities
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 1.5 }}>
                A complete audit trail
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
                Important actions are recorded automatically, giving every organization full visibility
                into who did what and when.
              </Typography>
            </Box>
          </Reveal>
          <Reveal delay={0.1}>
            <Card elevation={0} sx={{ p: { xs: 2, md: 3, display: 'flex', justifyContent:'center' } }}>
              <Stack spacing={0} sx={{ display: 'flex', justifyContent: 'center', pl: 7}}>
                {ACTIVITY_EXAMPLES.map((label, i) => (
                  <Box key={label} sx={{ display: 'flex', gap: 2}}>
                    <Box sx={{display: 'flex', gap: 2}}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: 0.6 }} />
                        {i < ACTIVITY_EXAMPLES.length - 1 && (
                          <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 22 }} />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pb: 2 }}>
                        {label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Reveal>
        </Container>
      </Box>

      <Box id="team" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Team"
              title="Role-based collaboration"
              description="Every organization can invite members and assign one of three roles, each with a clear set of permissions enforced on both the API and the database."
              align="center"
              maxWidth={640}
            />
          </Reveal>
          <Grid container spacing={3}>
            {ROLES.map((r, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={r.role}>
                <Reveal delay={i * 0.08}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 1.5 }}>{r.icon}</Avatar>
                      <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                        {r.role}
                      </Typography>
                      <BulletList items={r.permissions} />
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>

          <Reveal delay={0.2}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                <MailIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Member invitations
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 560, mx: 'auto' }}>
                Owners and managers generate invitation links to bring new members into the workspace.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ChipGroup items={['Role assignment', 'Optional email restriction', 'Maximum usage count', 'Expiration date', 'Revoke at any time']} />
              </Box>
            </Box>
          </Reveal>
        </Container>
      </Box>


      <Box id="workspace" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="md">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
                  <ApartmentIcon />
                </Avatar>
                <SectionHeader
                  eyebrow="Workspace"
                  title="One home for the organization"
                  description="Each organization manages its own workspace, separate from every other tenant on the platform."
                />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal delay={0.1}>
                <BulletList
                  items={[
                    'Organization profile and logo',
                    'Industry and company information',
                    'Website',
                    'Subscription details',
                    'Team member roster',
                    'Invitation management',
                  ]}
                />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

 
      <Box id="dashboard" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Dashboard"
              title="A quick read on the business"
              description="The dashboard summarizes performance across the entire pipeline the moment an organization logs in."
              align="center"
              maxWidth={600}
            />
          </Reveal>
          <Grid container spacing={2}>
            {DASHBOARD_WIDGETS.map((w, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={w}>
                <Reveal delay={i * 0.05}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      textAlign: 'center',
                      py: 2.5,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
                    }}
                  >
                    <DashboardIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {w}
                    </Typography>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

  
      <Box id="security" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Security"
              title="Security built into every layer"
              description="Protection is applied at the request level, the role level, and the database level, not bolted on afterward."
              align="center"
              maxWidth={620}
            />
          </Reveal>
          <Grid container spacing={3}>
            {SECURITY_FEATURES.map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={f.title}>
                <Reveal delay={i * 0.08}>
                  <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: 'primary.main', mb: 1.5 }}>{f.icon}</Avatar>
                      <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                        {f.title}
                      </Typography>
                      <BulletList items={f.items} />
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

 
      <Box id="architecture" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="md">
          <Reveal>
            <SectionHeader
              eyebrow="Architecture"
              title="Multi-tenant by design"
              description="The platform runs as a single deployment, but every organization operates inside a fully isolated boundary."
              align="center"
              maxWidth={620}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
              <Card
                elevation={0}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 3, width: 220, p: 2, transition: 'transform 0.25s ease', '&:hover': { transform: 'translateY(-3px)' } }}
              >
                <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                  Organization A
                </Typography>
                <ChipGroup items={['Leads', 'Contacts', 'Deals', 'Customers', 'Members']} />
              </Card>
              <Avatar sx={{ bgcolor: 'text.primary', width: 48, height: 48, flexShrink: 0 }}>
                <LockIcon fontSize="small" />
              </Avatar>
              <Card
                elevation={0}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 3, width: 220, p: 2, transition: 'transform 0.25s ease', '&:hover': { transform: 'translateY(-3px)' } }}
              >
                <Typography fontWeight={700} sx={{ mb: 1.5 }}>
                  Organization B
                </Typography>
                <ChipGroup items={['Leads', 'Contacts', 'Deals', 'Customers', 'Members']} />
              </Card>
            </Box>
          </Reveal>
          <Reveal delay={0.18}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, maxWidth: 620, mx: 'auto', lineHeight: 1.7 }}>
              Organizations can never access another organization's leads, contacts, deals, customers,
              members, communications, or activities. Isolation is enforced twice: once in backend
              authorization, and again through PostgreSQL row level security policies at the database
              itself.
            </Typography>
          </Reveal>
        </Container>
      </Box>

      <Box id="subscription" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Plans"
              title="A subscription system built to grow with you"
              description="Every organization is assigned a subscription plan that defines its resource limits, retention policy, and billing cycle."
              align="center"
              maxWidth={640}
            />
          </Reveal>

          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, mb: 5, justifyContent: 'center' }}>
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.06} sx={{ flex: '0 0 160px' }}>
                <Card
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: plan.status === 'Available' ? 'primary.main' : 'divider',
                    borderRadius: 3,
                    textAlign: 'center',
                    py: 3,
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: 3 },
                  }}
                >
                  <PaymentIcon color={plan.status === 'Available' ? 'primary' : 'disabled'} sx={{ mb: 1 }} />
                  <Typography fontWeight={700}>{plan.name}</Typography>
                  <Chip
                    label={plan.status}
                    size="small"
                    sx={{ mt: 1 }}
                    color={plan.status === 'Available' ? 'primary' : 'default'}
                    variant={plan.status === 'Available' ? 'filled' : 'outlined'}
                  />
                </Card>
              </Reveal>
            ))}
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Billing
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7} sx={{ mb: 2 }}>
                  Plans can be billed monthly, yearly, or offered for free, with support for Stripe,
                  PayPal, GCash, and Maya.
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Subscription status
                </Typography>
                <ChipGroup items={['Active', 'Cancelled', 'Expired', 'Past due']} />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal delay={0.1}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Resource limits and retention
                </Typography>
                <BulletList
                  items={[
                    'Each plan defines active and storage limits for members, leads, contacts, deals, customers, tasks, notes, emails, SMS, and calls',
                    'Activities and messages are retained based on the subscription plan',
                    'Enterprise plans offer unlimited retention',
                    'Billing periods, renewals, cancellations, and access are managed automatically based on the current subscription',
                  ]}
                />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="stack" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="lg">
          <Reveal>
            <SectionHeader
              eyebrow="Tech stack"
              title="Built with modern tools"
              description="uniThread CRM is built entirely with industry standard technologies used by professional development teams."
              align="center"
              maxWidth={520}
            />
          </Reveal>
          <Grid container spacing={3}>
            {TECH_STACK.map((stack, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stack.category}>
                <Reveal delay={i * 0.08}>
                  <Card
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: stack.color }}>
                        {stack.icon}
                        <Typography variant="body1" fontWeight={700}>
                          {stack.category}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {stack.items.map((item) => (
                          <Typography key={item} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box component="span" sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: stack.color, flexShrink: 0, display: 'inline-block' }} />
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Reveal>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'text.primary',
                mx: 'auto',
                mb: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(-8deg) scale(1.05)' },
              }}
            >
              <GitHubIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              View on GitHub
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              uniThread CRM is a portfolio project built to demonstrate full-stack development skills with
              React, TypeScript, and Supabase. The source code is available on GitHub.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              onClick={() => window.open('https://github.com/06Jest/crm-project', '_blank')}
              sx={{ fontWeight: 700, transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-2px)' } }}
            >
              View source code
            </Button>
          </Reveal>
        </Container>
      </Box>

      <Box id="roadmap" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '88px' }}>
        <Container maxWidth="md">
          <Reveal>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Chip label="Current version: Beta" color="primary" sx={{ fontWeight: 700, mb: 2 }} />
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5 }}>
                Actively developed, always improving
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.7, mb: 2 }}>
                The Beta release includes the complete core CRM functionality. Development is currently
                focused on:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ChipGroup items={['UI improvements', 'Bug fixing', 'Performance optimization', 'Responsive design', 'Comprehensive testing']} />
              </Box>
            </Box>
          </Reveal>

          <Reveal delay={0.1}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <RocketLaunchIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>
                Roadmap
              </Typography>
            </Stack>
            {ROADMAP_GROUPS.map((group) => (
              <Accordion
                key={group.category}
                elevation={0}
                disableGutters
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 1.5,
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  transition: 'border-color 0.2s ease',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={700}>{group.category}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ChipGroup items={group.items} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Reveal>
        </Container>
      </Box>


      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal>
                <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                  Get in touch
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                  Questions or feedback?
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7} sx={{ mb: 3 }}>
                  Have a question about uniThread CRM? Found a bug? Want to request a feature? 
                </Typography>
                
                <Button variant="outlined" onClick={()=> navigate("/feedback")} sx={{ fontWeight: 600 }}>
                    Add Feedback
                </Button>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal delay={0.1}>
                <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
                  Explore
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                  Want the full picture?
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7} sx={{ mb: 3 }}>
                  Jump back to any section of the Product Overview, or see what is planned next.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
                  <Button variant="outlined" onClick={() => scrollToSection('journey')} sx={{ fontWeight: 600 }}>
                    Customer journey
                  </Button>
                  <Button variant="outlined" onClick={() => scrollToSection('roadmap')} sx={{ fontWeight: 600 }}>
                    Roadmap
                  </Button>
                </Stack>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: 'common.white',
            opacity: 0.08,
            animation: `${floatSlow} 8s ease-in-out infinite`,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -30,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'common.white',
            opacity: 0.06,
            animation: `${floatSlow} 10s ease-in-out infinite`,
            animationDelay: '1s',
          }}
        />
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Reveal>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              Ready to try uniThread CRM?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
              Get started for free today. No credit card required.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'common.white',
                color: 'primary.main',
                fontWeight: 700,
                px: 5,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-2px)', boxShadow: 6 },
              }}
            >
              Create free account
            </Button>
          </Reveal>
        </Container>
      </Box>
    </Box>
  );
}