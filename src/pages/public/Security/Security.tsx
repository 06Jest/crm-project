import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Divider,
  Button,
  useMediaQuery,
  alpha,
  type SxProps,
  type Theme,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import RuleIcon from '@mui/icons-material/Rule';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EastIcon from '@mui/icons-material/East';


const LAST_UPDATED = 'August 10, 2026';
const OPERATOR_NAME = 'Jestony Silvano';
const SECURITY_EMAIL = 'silvanojestony27@gmail.com';

const subject = 'Security issue report UniThread CRM';

const gmailHref =
  `https://mail.google.com/mail/?view=cm&fs=1` +
  `&to=${encodeURIComponent(SECURITY_EMAIL)}` +
  `&su=${encodeURIComponent(subject)}`;

const HEADER_OFFSET = 64; 

const SECURITY_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'authorization', label: 'Authorization' },
  { id: 'isolation', label: 'Data Isolation' },
  { id: 'database', label: 'Database Security' },
  { id: 'backend', label: 'Backend Security' },
  { id: 'validation', label: 'Validation' },
  { id: 'activity', label: 'Activity' },
  { id: 'communications', label: 'Communications' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'beta', label: 'Beta' },
  { id: 'report', label: 'Report Issue' },
];


function Reveal({
  children,
  sx,
  delay = 0,
}: React.PropsWithChildren<{ sx?: SxProps<Theme>; delay?: number }>) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  React.useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: reduceMotion ? 1 : visible ? 1 : 0,
        transform: reduceMotion ? 'none' : visible ? 'translateY(0)' : 'translateY(16px)',
        transition: reduceMotion ? 'none' : `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <Box sx={{ mb: 5, textAlign: align, maxWidth: align === 'center' ? 720 : 640, mx: align === 'center' ? 'auto' : 0 }}>
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{ display: 'block', color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, mb: 1 }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: description ? 1.5 : 0, fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

function Section({
  id,
  children,
  sx,
}: React.PropsWithChildren<{ id?: string; sx?: SxProps<Theme> }>) {
  return (
    <Box
      component="section"
      id={id}
      sx={{ py: { xs: 7, sm: 9 }, scrollMarginTop: HEADER_OFFSET + 16, ...sx }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
}


function SecurityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 3,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (t) => `0 8px 24px ${alpha(t.palette.common.black, t.palette.mode === 'dark' ? 0.4 : 0.08)}`,
          borderColor: (t) => alpha(t.palette.primary.main, 0.4),
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
            color: 'primary.main',
            mb: 2,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}


function SecuritySectionNav() {
  const [activeId, setActiveId] = React.useState<string>(SECURITY_SECTIONS[0].id);

  React.useEffect(() => {
    const elements = SECURITY_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: `-${HEADER_OFFSET + 8}px 0px -70% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <Box
      component="nav"
      aria-label="Security page sections"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (t) => t.zIndex.appBar - 1,
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            overflowX: 'auto',
            py: 1,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {SECURITY_SECTIONS.map((s) => {
            const active = s.id === activeId;
            return (
              <Button
                key={s.id}
                href={`#${s.id}`}
                onClick={handleClick(s.id)}
                size="small"
                sx={{
                  flexShrink: 0,
                  textTransform: 'none',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.82rem',
                  color: active ? 'primary.main' : 'text.secondary',
                  bgcolor: active ? (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.16 : 0.08) : 'transparent',
                  borderRadius: 2,
                  px: 1.5,
                  '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.1) },
                }}
              >
                {s.label}
              </Button>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}


function IsolationDiagram() {
  const orgColumn = (label: string) => (
    <Box
      sx={{
        flex: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
        p: { xs: 2.5, sm: 3 },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        {label}
      </Typography>
      <Stack spacing={0.75}>
        {['Leads', 'Contacts', 'Deals', 'Customers', 'Members'].map((item) => (
          <Typography key={item} variant="body2" color="text.secondary">
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
      }}
    >
      {orgColumn('Organization A')}

      <Box
        aria-hidden
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
          px: { sm: 1 },
        }}
      >
        <Box sx={{ width: { xs: 40, sm: 2 }, height: { xs: 2, sm: 40 }, bgcolor: 'divider' }} />
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
            color: 'primary.main',
          }}
        >
          <ShieldIcon fontSize="small" />
        </Avatar>
        <Box sx={{ width: { xs: 40, sm: 2 }, height: { xs: 2, sm: 40 }, bgcolor: 'divider' }} />
      </Box>

      {orgColumn('Organization B')}
    </Box>
  );
}

function BackendFlowDiagram() {
  const steps = [
    'User',
    'Authentication',
    'Backend request',
    'Authorization check',
    'Organization check',
    'Permission check',
    'Database',
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: { xs: 1, md: 1.5 },
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {step}
            </Typography>
          </Box>
          {i < steps.length - 1 && (
            <EastIcon
              aria-hidden
              sx={{
                color: 'text.secondary',
                opacity: 0.5,
                fontSize: 18,
                transform: { xs: 'rotate(90deg)', md: 'none' },
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
}

const ACTIVITY_EVENTS = [
  'Lead created',
  'Contact updated',
  'Deal stage changed',
  'Customer created',
  'Email sent',
  'Call recorded',
  'SMS activity',
  'Member invited',
  'Member role changed',
  'Member removed',
];

function SecurityTimeline() {
  return (
    <Box
      component="ul"
      sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}
    >
      {ACTIVITY_EVENTS.map((event) => (
        <Box
          component="li"
          key={event}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
            px: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} aria-hidden />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {event}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
const ROLES = [
  {
    role: 'Owner',
    icon: <SupervisorAccountIcon />,
    permissions: [
      'Full workspace access',
      'Organization settings',
      'Member management',
      'Subscription and billing management',
      'CRM data management',
    ],
  },
  {
    role: 'Manager',
    icon: <AdminPanelSettingsIcon />,
    permissions: [
      'Team management',
      'CRM management',
      'Member invitations',
      'Deal and contact management',
    ],
  },
  {
    role: 'Agent',
    icon: <PersonIcon />,
    permissions: [
      'Daily CRM operations',
      'Manage assigned leads',
      'Manage assigned contacts and deals',
      'Manage assigned customers',
    ],
  },
];

const WORKSPACE_RESOURCES = ['Leads', 'Contacts', 'Deals', 'Customers', 'Activities', 'Tasks', 'Notes', 'Messages', 'Members'];

const COMMUNICATION_FEATURES = [
  {
    label: 'Email',
    icon: <MailOutlineIcon />,
    status: 'Live',
    description: "Sent through UniThread's email infrastructure.",
  },
  {
    label: 'Internal chat',
    icon: <ChatBubbleOutlineIcon />,
    status: 'Live',
    description:
      'Messaging between organization members within the platform.',
  },
  {
    label: 'SMS',
    icon: <SmsOutlinedIcon />,
    status: 'Simulated',
    description:
      'Currently simulated within the platform, not delivered via a real carrier.',
  },
  {
    label: 'Calls',
    icon: <CallOutlinedIcon />,
    status: 'Simulated',
    description:
      'Currently simulated within the platform, not connected to a real telephony provider.',
  },
];

const INFRASTRUCTURE_CATEGORIES = [
  'Database hosting',
  'Authentication',
  'Realtime functionality',
  'Email delivery',
  'Media storage',
  'Payments',
  'Communication services',
  'AI functionality',
  'Application hosting',
];

const SECURE_DEV_CHECKLIST = [
  'Backend authorization',
  'Database access policies',
  'Input validation',
  'Authentication controls',
  'Organization-level data isolation',
  'Permission checks',
  'Error handling',
  'Testing',
  'Security improvements',
];


export default function Security() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <SecuritySectionNav />

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            background: (t) =>
              `radial-gradient(circle at 20% 20%, ${alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.12 : 0.06)}, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 8, sm: 10, md: 12 }, pb: { xs: 6, sm: 8 } }}>
          <Reveal sx={{ maxWidth: 720 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <Chip
                icon={<SecurityIcon fontSize="small" />}
                label="Security"
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label="Currently in Beta"
                size="small"
                variant="outlined"
                sx={{ color: 'text.secondary', borderColor: 'divider', fontWeight: 600 }}
              />
            </Stack>

            <Typography
              variant="h2"
              component="h1"
              sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 2.5, fontSize: { xs: '2rem', sm: '2.75rem', md: '3rem' } }}
            >
              Security built into every layer
            </Typography>

            <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              UniThread CRM is designed with authentication, authorization,
              database-level isolation, and organization-scoped access
              controls working together to protect workspace data.
            </Typography>
          </Reveal>

          <Reveal delay={0.1}>
            <Stack direction="row" spacing={2} sx={{ mt: 5, flexWrap: 'wrap', gap: 2 }} aria-hidden>
              {[ShieldIcon, LockIcon, VerifiedUserIcon, SecurityIcon].map((Icon, i) => (
                <Avatar
                  key={i}
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.16 : 0.08),
                    color: 'primary.main',
                  }}
                >
                  <Icon />
                </Avatar>
              ))}
            </Stack>
          </Reveal>
        </Container>
      </Box>

      <Section id="overview">
        <Reveal>
          <SectionHeader
            eyebrow="Architecture"
            title="Security by design"
            description="Security is built into the platform's architecture rather than treated as an afterthought."
          />
        </Reveal>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          <Reveal delay={0}>
            <SecurityCard
              icon={<VerifiedUserIcon />}
              title="Authentication"
              description="JWT-based authentication, secure login flows, email verification, password reset, and protected application routes."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <SecurityCard
              icon={<AdminPanelSettingsIcon />}
              title="Authorization"
              description="Role-based authorization, backend permission checks, protected REST APIs, and organization-scoped requests."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SecurityCard
              icon={<StorageIcon />}
              title="Data isolation"
              description="PostgreSQL Row Level Security, organization-scoped queries, and multi-tenant boundaries."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <SecurityCard
              icon={<RuleIcon />}
              title="Input validation"
              description="Schema-based request validation using Zod, helping prevent malformed or unexpected data from entering application workflows."
            />
          </Reveal>
        </Box>
      </Section>

      <Divider />

      <Section id="authentication">
        <Reveal>
          <SectionHeader eyebrow="Access" title="Authentication" />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2, maxWidth: 700 }}>
            UniThread uses authenticated access to protect user accounts and
            workspace resources. Before a user can reach protected CRM
            functionality, they must establish a valid session.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 700 }}>
            UniThread currently uses:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {['JWT-based authentication', 'Email verification', 'Secure login flows', 'Password reset functionality', 'Protected application routes', 'Authenticated API requests'].map(
              (item) => (
                <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              )
            )}
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="authorization">
        <Reveal>
          <SectionHeader
            eyebrow="Permissions"
            title="Role-based access control"
            description="UniThread uses role-based authorization to control what members can do within an organization."
          />
        </Reveal>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {ROLES.map((r, i) => (
            <Reveal key={r.role} delay={i * 0.05}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
                        color: 'primary.main',
                      }}
                    >
                      {r.icon}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {r.role}
                    </Typography>
                  </Stack>
                  <Stack spacing={0.75}>
                    {r.permissions.map((p) => (
                      <Typography key={p} variant="body2" color="text.secondary">
                        {p}
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Box>

        <Reveal>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, fontStyle: 'italic', borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}>
            Permissions are enforced by application and backend logic. They
            are not intended to rely solely on what is hidden or shown in the
            interface.
          </Typography>
        </Reveal>
      </Section>

      <Divider />

      <Section id="isolation">
        <Reveal>
          <SectionHeader
            eyebrow="Multi-tenancy"
            title="Multi-tenant data isolation"
            description="UniThread is built around a multi-tenant architecture. Each organization has its own workspace and organization-scoped data."
          />
        </Reveal>

        <Reveal>
          <IsolationDiagram />
        </Reveal>

        <Reveal>
          <Box sx={{ mt: 4, maxWidth: 760 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
              Organizations should not be able to access another
              organization's leads, contacts, deals, customers, members,
              activities, or communications.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1 }}>
              Organization boundaries are enforced at both the:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label="Application / backend layer" variant="outlined" sx={{ fontWeight: 600 }} />
              <Chip label="Database layer" variant="outlined" sx={{ fontWeight: 600 }} />
            </Box>
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="database">
        <Reveal>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
                color: 'primary.main',
                display: { xs: 'none', sm: 'flex' },
              }}
              aria-hidden
            >
              <StorageIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <SectionHeader eyebrow="Data layer" title="Database-level security" />
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2, maxWidth: 700 }}>
                UniThread uses PostgreSQL Row Level Security (RLS) to enforce
                organization-level data access policies. RLS helps restrict
                database operations according to authenticated user context
                and organization membership.
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, lineHeight: 1.7, maxWidth: 700, borderLeft: '3px solid', borderColor: 'primary.main', pl: 2 }}
              >
                Security does not depend solely on hiding records in the user
                interface, the database participates in enforcing access
                boundaries.
              </Typography>
            </Box>
          </Stack>
        </Reveal>
      </Section>

      <Divider />

      <Section id="backend">
        <Reveal>
          <SectionHeader
            eyebrow="Request handling"
            title="Backend authorization"
            description="Protected requests are validated by backend logic before sensitive operations are performed."
          />
        </Reveal>

        <Reveal>
          <Box sx={{ p: { xs: 2.5, sm: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
            <BackendFlowDiagram />
          </Box>
        </Reveal>

        <Reveal>
          <Box sx={{ mt: 3, maxWidth: 700 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1 }}>
              Protected requests help verify that:
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {[
                'The user is authenticated',
                'The organization context is valid',
                'The user has the required role or permission',
                'The requested resource belongs to the correct organization',
                'The requested operation is permitted',
              ].map((item) => (
                <Typography component="li" key={item} variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 0.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="validation">
        <Reveal>
          <SectionHeader eyebrow="Data integrity" title="Input validation" />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1, maxWidth: 700 }}>
            UniThread uses schema-based validation, powered by{' '}
            <Typography component="span" sx={{ fontWeight: 700 }}>
              Zod
            </Typography>
            , for appropriate application requests. Validation helps:
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 5 }}>
            {[
              'Reject malformed data',
              'Enforce expected data structures',
              'Reduce unexpected application behavior',
              'Add an additional protection layer around user-provided input',
            ].map((item) => (
              <Typography component="li" key={item} variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Box>
        </Reveal>

        <Reveal>
          <SectionHeader
            eyebrow="Scope"
            title="Protected workspaces"
            description="Organization members operate within their assigned organization. Organization context is used when performing operations involving CRM resources such as:"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            {WORKSPACE_RESOURCES.map((r) => (
              <Chip key={r} label={r} size="small" sx={{ fontWeight: 600 }} />
            ))}
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="activity">
        <Reveal>
          <SectionHeader
            eyebrow="Visibility"
            title="Activity and audit visibility"
            description="Important CRM and organizational actions can be recorded through UniThread's activity system, helping organizations understand what happened within their workspace."
          />
        </Reveal>

        <Reveal>
          <SecurityTimeline />
        </Reveal>

        <Reveal>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, maxWidth: 700, fontStyle: 'italic' }}>
            Activity tracking should not be interpreted as a guarantee that
            every possible system event is recorded.
          </Typography>
        </Reveal>
      </Section>

      <Divider />

      <Section id="communications">
        <Reveal>
          <SectionHeader eyebrow="Messaging" title="Communication security" />
        </Reveal>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mb: 4 }}>
          {COMMUNICATION_FEATURES.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  height: '100%',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {f.label}
                    </Typography>
                    <Chip
                      label={f.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: f.status === 'Live' ? 'success.main' : 'text.secondary',
                        borderColor: f.status === 'Live' ? 'success.main' : 'divider',
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {f.description}
                  </Typography>
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>

        <Reveal>
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
              Communication features may depend on third-party infrastructure
              and integrations. Some communication features are currently
              simulated or experimental because UniThread is in beta.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontStyle: 'italic' }}>
              Users are responsible for ensuring information communicated
              through UniThread is handled according to applicable privacy,
              communications, and data-protection requirements.
            </Typography>
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="infrastructure">
        <Reveal>
          <SectionHeader
            eyebrow="Ecosystem"
            title="Third-party infrastructure"
            description="UniThread relies on third-party infrastructure and services for portions of the platform. Not every category below is necessarily active at a given time."
          />
        </Reveal>

        <Reveal>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 3 }}>
            {INFRASTRUCTURE_CATEGORIES.map((c) => (
              <Chip key={c} icon={<CloudOutlinedIcon />} label={c} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            ))}
          </Box>
        </Reveal>

        <Reveal>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 1.8, mb: 6 }}>
            Third-party providers operate under their own security practices,
            terms, and privacy policies. UniThread does not take
            responsibility for the independent security practices or
            availability of third-party services.
          </Typography>
        </Reveal>

        <Reveal>
          <SectionHeader eyebrow="Ongoing work" title="Security is an ongoing process" />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 700 }}>
            UniThread is actively developed, and security controls continue
            to evolve alongside the platform.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25, mb: 2, maxWidth: 700 }}>
            {SECURE_DEV_CHECKLIST.map((item) => (
              <Stack key={item} direction="row" spacing={1} alignItems="center">
                <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'primary.main' }} aria-hidden />
                <Typography variant="body2" color="text.secondary">
                  {item}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: 700 }}>
            As the platform evolves, additional security controls may be
            introduced.
          </Typography>
        </Reveal>
      </Section>

      <Divider />

      <Section id="beta">
        <Reveal>
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.06 : 0.03),
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <InfoOutlinedIcon sx={{ color: 'primary.main' }} aria-hidden />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                UniThread is currently in Beta
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2, maxWidth: 700 }}>
              While reasonable measures are implemented to protect the
              platform and its users, no online service can guarantee
              absolute security.
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1, maxWidth: 700 }}>
              During beta, the platform may experience:
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
              {[
                'Bugs',
                'Unexpected behavior',
                'Security vulnerabilities',
                'Service interruptions',
                'Changes to security architecture',
                'Changes to third-party infrastructure',
              ].map((item) => (
                <Typography component="li" key={item} variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 0.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: 700 }}>
              Users should avoid storing information in UniThread that they
              are not authorized to store, or that they cannot reasonably
              protect through appropriate organizational safeguards. Keeping
              backups of important business information is recommended.
            </Typography>
          </Box>
        </Reveal>
      </Section>

      <Divider />

      <Section id="report">
        <Reveal>
          <SectionHeader eyebrow="Coordinated disclosure" title="Found a security issue?" />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2, maxWidth: 700 }}>
            If you believe you've found a security vulnerability, please
            report it responsibly instead of attempting to exploit it or
            access another user's data.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1, maxWidth: 700 }}>
            When reporting, please include:
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0, mb: 3 }}>
            {[
              'A description of the vulnerability',
              'The affected feature or endpoint',
              'Steps to reproduce it',
              'Relevant screenshots or logs that do not contain unnecessary personal information',
            ].map((item) => (
              <Typography component="li" key={item} variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 0.5 }}>
                {item}
              </Typography>
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3, maxWidth: 700, fontStyle: 'italic' }}>
            Please do not publicly disclose a security vulnerability before
            giving the Operator a reasonable opportunity to investigate and
            address it.
          </Typography>

          <Button
            component="a"
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            disableElevation
            size="large"
            startIcon={<SecurityIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            Report a security issue
          </Button>
        </Reveal>
      </Section>

      <Divider />

      <Section>
        <Reveal>
          <SectionHeader eyebrow="Related" title="Security and privacy" />
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1.5, maxWidth: 700 }}>
            This page explains how UniThread approaches the technical and
            organizational security of the platform.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 700 }}>
            For information about what personal information UniThread
            collects, how it is used, how it is retained, and applicable user
            rights, please see the Privacy Policy.
          </Typography>
          <Button
            component={RouterLink}
            to="/privacy"
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            View Privacy Policy
          </Button>
        </Reveal>
      </Section>

      <Box sx={{ bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.08 : 0.04), py: { xs: 8, sm: 10 } }}>
        <Container maxWidth="md">
          <Reveal sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 3,
                bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
                color: 'primary.main',
              }}
              aria-hidden
            >
              <ShieldIcon />
            </Avatar>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1 }}>
              Built around a simple principle
            </Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.4rem', sm: '1.75rem' } }}>
              Your organization's data should remain accessible to the people
              who are authorized to access it and protected from those who
              are not.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.75 }}>
              Security is an ongoing process, and UniThread will continue
              improving its architecture as the platform grows.
            </Typography>
          </Reveal>
        </Container>
      </Box>
      <Box sx={{ py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.9 }}>
            UniThread CRM
            <br />
            Operated by: {OPERATOR_NAME}
            <br />
            Country: Philippines
            <br />
            Contact:{' '}
            <Typography
              component="a"
              href={`mailto:${SECURITY_EMAIL}`}
              variant="caption"
              color="text.secondary"
              sx={{ wordBreak: 'break-word' }}
            >
              {SECURITY_EMAIL}
            </Typography>
            <br />
            Last Updated: {LAST_UPDATED}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}