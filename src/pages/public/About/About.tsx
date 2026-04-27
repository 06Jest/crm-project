import {
  Box, Container, Typography, Grid, Card,
  CardContent, Chip, Button, Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: <CodeIcon />,
    color: '#1976d2',
    items: [
      'React 18 + TypeScript',
      'Vite (build tool)',
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
      'Leaflet + OpenStreetMap',
      'Cloudinary (media)',
      'Stripe (billing)',
      'Twilio SMS (coming)',
      'SMTP Email (coming)',
      'AI Assistant (coming)',
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
      'Netlify (frontend)',
      'Azure Static Web Apps',
      'GitHub Actions CI/CD',
    ],
  },
];

const VALUES = [
  {
    title: 'Simple by design',
    description:
      'CRM tools are often bloated and complex. MiniCRM is built to do the essentials extremely well — contacts, leads, deals, and communication.',
  },
  {
    title: 'Built for real teams',
    description:
      'Designed for organizations with a clear admin/agent structure. Every record tracks who did what, giving your team full accountability.',
  },
  {
    title: 'Privacy first',
    description:
      'Your data is yours. Row-level security means each organization is completely isolated. We never share or sell your data.',
  },
  {
    title: 'Always improving',
    description:
      'MiniCRM is actively developed. AI features, advanced analytics, and integrations are being added with every milestone.',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="About uniThread"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
          >
            Built to help sales teams
            <Box component="span" color="primary.main"> close more deals</Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight={400}
            sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}
          >
            uniThread is a full-stack CRM application built with modern
            web technologies. Manage contacts, track leads, close deals,
            and communicate with your team — all in one place.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid sx={{xs:12, md: 6}}>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={700}
                letterSpacing={2}
              >
                What is MiniCRM?
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                A CRM that actually gets out of your way
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                lineHeight={1.8}
                sx={{ mb: 3 }}
              >
                Most CRM tools are built for enterprises with hundreds of
                features that get in the way of the basics. MiniCRM focuses
                on what matters — knowing who your customers are, where your
                deals stand, and how your team is performing.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                lineHeight={1.8}
              >
                Built with a single organization model — one admin manages
                a team of agents. Every record tracks who processed it,
                giving your organization full visibility and accountability.
              </Typography>
            </Grid>
            <Grid sx={{xs:12, md: 6}}>
              <Grid container spacing={2}>
                {VALUES.map((value) => (
                  <Grid sx={{xs:12, md: 6}} key={value.title}>
                    <Card
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
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
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              letterSpacing={2}
            >
              Tech stack
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
              Built with modern tools
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}
            >
              MiniCRM is built entirely with industry-standard technologies
              used by professional development teams worldwide.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {TECH_STACK.map((stack) => (
              <Grid sx={{xs:12, md: 3, sm: 6}} key={stack.category}>
                <Card
                  elevation={0}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <CardContent>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        color: stack.color,
                      }}
                    >
                      {stack.icon}
                      <Typography variant="body1" fontWeight={700}>
                        {stack.category}
                      </Typography>
                    </Box>

                    {/* Tech items */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {stack.items.map((item) => (
                        <Typography
                          key={item}
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              bgcolor: stack.color,
                              flexShrink: 0,
                              display: 'inline-block',
                            }}
                          />
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: 'background.default',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'text.primary',
              mx: 'auto',
              mb: 2,
            }}
          >
            <GitHubIcon sx={{ fontSize: 36 }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            View on GitHub
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.7 }}
          >
            MiniCRM is a portfolio project built to demonstrate
            full-stack development skills with React, TypeScript,
            and Supabase. The source code is available on GitHub.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GitHubIcon />}
            onClick={() =>
              window.open(
                'https://github.com/06Jest/crm-project',
                '_blank'
              )
            }
          >
            View source code
          </Button>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={6}>

            <Grid sx={{xs:12, md: 6}}>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={700}
                letterSpacing={2}
              >
                Get in touch
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                Questions or feedback?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                lineHeight={1.7}
                sx={{ mb: 3 }}
              >
                Have a question about uniThread? Found a bug?
                Want to request a feature? We'd love to hear from you.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  📧 uni.mailer1@gmail.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🐙 https://github.com/06Jest/crm-project
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  💼 https://www.linkedin.com/in/jestonyfrontenddev/
                </Typography>
              </Box>
            </Grid>

            <Grid sx={{xs:12, md: 6}}>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={700}
                letterSpacing={2}
              >
                What's coming
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1, mb: 2 }}>
                Roadmap highlights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { label: 'AI-powered contact insights', status: 'In progress' },
                  { label: 'Email sending via SMTP', status: 'In progress' },
                  { label: 'Twilio SMS integration', status: 'Planned' },
                  { label: 'Stripe billing', status: 'Planned' },
                  { label: 'Multi-agent workspaces', status: 'Planned' },
                  { label: 'Mobile app', status: 'Future' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      color={
                        item.status === 'In progress'
                          ? 'primary'
                          : item.status === 'Planned'
                          ? 'default'
                          : 'secondary'
                      }
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Ready to try MiniCRM?
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.9, mb: 4 }}
          >
            Get started for free today. No credit card required.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
              px: 5,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Create free account
          </Button>
        </Container>
      </Box>

    </Box>
  );
}