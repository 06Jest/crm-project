import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Container, Grid,
  Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import { useInView } from '../../../hooks/useInView';
import AnimatedNumber from '../../../components/AnimatedNumber';
import type { RootState } from '../../../store/store';
import {  useSelector } from 'react-redux';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useEffect } from 'react';
import LandingBackground from '../../../assets/landing-background.jpg';

const displayFont = { fontFamily: '"Playfair Display", Georgia, serif' };
const bodyFont = { fontFamily: '"Outfit", system-ui, sans-serif' };


const BROWN = '#AD7450';
const BLUE = 'blue'
const LIGHTBROWN = '#cfa082'
const DARK = '#3f3f3fee';
const CARD_BG = 'rgba(255,255,255,0.04)';



const fadeUp = (inView: boolean, delay = 0): object => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(40px)',
  transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s,
               transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
});


function Reveal({
  children, delay = 0, sx = {},
}: {
  children: React.ReactNode;
  delay?: number;
  sx?: object;
}) {
  const { ref, inView } = useInView();
  return (
    <Box ref={ref} sx={{ ...fadeUp(inView, delay), ...sx }}>
      {children}
    </Box>
  );
}


const FEATURES = [
  {
    num: '01',
    title: 'Contacts & Kanban Leads',
    body: 'Full contact management, drag-and-drop Kanban boards, and deal pipelines with win/loss tracking.',
  },
  {
    num: '02',
    title: 'AI-Powered Insights',
    body: 'Floating AI assistant, contact intelligence, deal win predictions, and smart email drafting.',
  },
  {
    num: '03',
    title: 'Real-time Collaboration',
    body: 'WebSocket messaging between team members with read receipts, unread badges, and contact linking.',
  },
  {
    num: '04',
    title: 'Advanced Analytics',
    body: 'Org-scoped reports, agent performance leaderboards, pipeline health, and CSV export.',
  },
  {
    num: '05',
    title: 'Role-Based Access',
    body: 'Three-tier system: super admin, org admin, and agents — each with Employee ID login.',
  },
  {
    num: '06',
    title: 'Maps & Integrations',
    body: 'Leaflet customer maps, Cloudinary avatars, Stripe billing, SMTP email, and Google Analytics.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Register your org',
    desc: 'Create an admin account, name your organization, and you\'re live instantly.',
  },
  {
    n: '2',
    title: 'Invite your agents',
    desc: 'Generate Employee IDs, send invite emails, and your team logs in without needing to know their email.',
  },
  {
    n: '3',
    title: 'Close more deals',
    desc: 'Add contacts, move leads through your pipeline, and let the AI handle the insights.',
  },
];

const STATS = [
  { to: 15, suffix: '+', label: 'Pages built' },
  { to: 3, suffix: '', label: 'User role tiers' },
  { to: 5, suffix: '', label: 'AI features' },
  { to: 100, suffix: '%', label: 'Free to start' },
];

export default function Landing() {
  const navigate = useNavigate();

  const { user, loading } = useAuthContext();
  const { ref: heroRef, inView: heroInView } = useInView();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const BORDER = themeMode === 'light' ? 'rgba(197, 197, 197, 0.47)' : 'rgba(170, 170, 170, 0.19)';
  const COLOR = themeMode === 'light' ? 'black' : 'white';
  const BACKGROUND = themeMode === 'light' ? 'rgba(177, 177, 177, 0.82)' : 'rgba(63, 63, 63, 0.78)';
  const SUBTEXTCOLOR = themeMode === 'light' ? 'rgba(87, 87, 87, 0.92)' : 'rgba(190, 190, 190, 0.9)';
  
  useEffect(() => {
    if (!loading && user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);


  return (
    <Box sx={{ bgcolor: {themeMode} , color: {COLOR}, overflow: 'hidden', ...bodyFont }}>

      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',

          backgroundImage: [
            'linear-gradient(to bottom, rgba(11,15,26,0.75) 0%, rgba(11,15,26,0.65) 60%, rgba(11,15,26,1) 100%)',
            `url(${LandingBackground})`,
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 14, md: 20 } }}>
          <Box ref={heroRef} sx={{ maxWidth: 780 }}>
          
            <Box sx={{ ...fadeUp(heroInView, 0), display: 'inline-flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)', animation: 'blink 2s ease-in-out infinite', '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              <Typography sx={{ ...bodyFont, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Now live — free to use
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                ...displayFont,
                fontSize: { xs: '2.6rem', sm: '3.8rem', md: '5.2rem' },
                fontWeight: 900,
                lineHeight: 1.02,
                color: 'white',
                mb: 3,
                ...fadeUp(heroInView, 0.08),
              }}
            >
              The CRM that works
              <br />
              as hard as{' '}
              <Box
                component="span"
                sx={{
                  color: BROWN,
                  textShadow: `0 0 60px ${BROWN}66`,
                  fontStyle: 'italic',
                }}
              >
                your team.
              </Box>
            </Typography>

            <Typography
              sx={{
                ...bodyFont,
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 540,
                lineHeight: 1.75,
                mb: 5,
                fontWeight: 300,
                ...fadeUp(heroInView, 0.16),
              }}
            >
              Contacts, leads, deals, AI insights, real-time messaging,
              and agent leaderboards — all in one place, for free.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ...fadeUp(heroInView, 0.24) }}>
              <Button
                onClick={() => !user ? navigate('/register') : navigate('/app/dashboard')}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  ...bodyFont,
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.75,
                  borderRadius: 2,
                  bgcolor: BROWN,
                  color: 'white',
                  boxShadow: `0 0 40px ${BROWN}44`,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: `${BROWN}`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 40px ${BROWN}66`,
                  },
                }}
              >
                Start for free
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outlined"
                size="large"
                sx={{
                  ...bodyFont,
                  fontWeight: 500,
                  fontSize: '1rem',
                  px: 4,
                  py: 1.75,
                  borderRadius: 2,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.75)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                See pricing
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mt: 4, flexWrap: 'wrap', ...fadeUp(heroInView, 0.32) }}>
              {['No credit card required', 'Free tier forever', 'Up in minutes'].map(t => (
                <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckIcon sx={{ fontSize: 14, color: BROWN }} />
                  <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', ...bodyFont }}>
                    {t}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>

        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,   background: `linear-gradient(to top, ${DARK}, transparent)` }} />
        </Box>


      <Box sx={{ border: `1px solid ${BORDER}`, py: 6, bgcolor: {BACKGROUND} }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {STATS.map((s, i) => (
              <Grid size={{xs: 6, sm: 3}} key={s.label}>
                <Reveal delay={i * 0.08}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      sx={{
                        ...displayFont,
                        fontSize: { xs: '2.2rem', md: '3rem' },
                        fontWeight: 900,
                        color: BROWN,
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      <AnimatedNumber to={s.to} suffix={s.suffix} />
                    </Typography>
                    <Typography sx={{ ...bodyFont, fontSize: 12, color: {COLOR}, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', mt: 2  }}>
                      {s.label}
                    </Typography> 
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      <Box sx={{ 
        py: { xs: 12, md: 20 },
        position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',

          backgroundImage: [
            'linear-gradient(to bottom, rgba(11,15,26,0.75) 0%, rgba(11,15,26,0.65) 60%, rgba(11,15,26,1) 100%)',
            'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80)',
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
         }}>
        <Container >
          <Reveal>
            <Box sx={{ mb: { xs: 8, md: 14 } }}>
              <Typography
                sx={{
                  ...bodyFont,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: BROWN,
                  mb: 2,
                }}
              >
                What's included
              </Typography>
              <Typography
                component="h2"
                sx={{
                  ...displayFont,
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  maxWidth: 800,
                  color: 'white'
                }}
              >
                Everything a sales team
                <br />
                actually needs.
              </Typography>
            </Box>
          </Reveal>

          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'md', justifySelf: 'center' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.num} delay={i * 0.06}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 3, md: 6 },
                    alignItems: 'flex-start',
                    py: { xs: 4, md: 5 },
                    borderBottom: `1px solid ${BORDER}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      pl: { md: 2 },
                      '& .feat-num': { color: BROWN },
                    },
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography
                    className="feat-num"
                    sx={{
                      ...displayFont,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.12)',
                      flexShrink: 0,
                      width: { xs: 36, md: 60 },
                      transition: 'color 0.3s ease',
                      lineHeight: 1.2,
                      pt: 0.25,
                    }}
                  >
                    {f.num}
                  </Typography>

                  <Box sx={{ flex: 1, textAlign: 'center', maxWidth: 'lg' }}>
                    <Typography
                      sx={{
                        ...displayFont,
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                        color: 'white'
                      }}
                    >
                      {f.title}
                    </Typography>
                    <Typography
                      sx={{
                        ...bodyFont,
                        color: 'rgba(167, 167, 167, 0.5)',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.7,
                        maxWidth: 'lg',
                        fontWeight: 300,
                      }}
                    >
                      {f.body}
                    </Typography>
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Container>
      </Box>

      <Box sx={{ my: 20 }}
      >
        <Container maxWidth="lg" sx={{ color: {COLOR}}} >
          <Reveal>
            <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 14 } }}>
              <Typography
                sx={{
                  ...bodyFont,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: BROWN,
                  mb: 2,
                }}
              >
                Getting started
              </Typography>
              <Typography
                component="h2"
                sx={{
                  ...displayFont,
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                Up and running in minutes.
              </Typography>
            </Box>
          </Reveal>

          <Grid container spacing={3}>
            {STEPS.map((s, i) => (
              <Grid size={{xs: 12, md: 4}} key={s.n}>
                <Reveal delay={i * 0.12}>
                  <Box
                    sx={{
                      p: { xs: 4, md: 5 },
                      borderRadius: 3,
                      border: `1px solid ${BORDER}`,
                      bgcolor: CARD_BG,
                      backdropFilter: 'blur(12px)',
                      minHeight: 300,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `1px solid rgba(245,200,66,0.25)`,
                        transform: 'translateY(-4px)',
                        boxShadow: `0 24px 48px rgba(0,0,0,0.3)`,
                      },
                      
                      '&::before': {
                        content: `"${s.n}"`,
                        position: 'absolute',
                        top: -20,
                        right: 20,
                        fontSize: 120,
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 900,
                        color: `${SUBTEXTCOLOR}`,
                        lineHeight: 1,
                        pointerEvents: 'none',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: BROWN,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <Typography sx={{ ...displayFont, fontWeight: 900, fontSize: 16, color: DARK }}>
                        {s.n}
                      </Typography>
                    </Box>
                    <Typography sx={{ ...displayFont, fontSize: '1.25rem', fontWeight: 700, mb: 1.5, lineHeight: 1.3 }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ ...bodyFont, color: `${SUBTEXTCOLOR}`, lineHeight: 1.75, fontWeight: 300 }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ 
        mt: 20,
          position: 'relative',
          py: { xs: 14, md: 24 },
          backgroundImage: [
            'linear-gradient(to bottom, rgba(11,15,26,0.96) 0%, rgba(11,15,26,0.90) 50%, rgba(11,15,26,0.96) 100%)',
            'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80)',
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
       }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} justifyContent={'space-between'} alignItems="center">

            <Grid size={{xs: 12, md: 5 }} >
              <Reveal>
                <Typography
                  sx={{
                    ...bodyFont,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: BROWN,
                    mb: 2,
                  }}
                >
                  For every team member
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    ...displayFont,
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    color: 'white'
                  }}
                >
                  Three roles.
                  <br />
                  One system.
                </Typography>
                <Typography sx={{ ...bodyFont, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300, mb: 4 }}>
                  Super admins control the platform. Org admins manage
                  their team and data. Agents log in with their Employee ID
                  and focus on selling.
                </Typography>
                <Button
                  onClick={() => navigate('/register')}
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    ...bodyFont,
                    fontWeight: 500,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: BROWN,
                      color: BROWN,
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  Create your org
                </Button>
              </Reveal>
            </Grid>


            <Grid size={{xs: 12, md: 6}} >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  {
                    role: 'Super Admin',
                    tag: 'You',
                    desc: 'App analytics, system health, all organizations overview.',
                    color: '#ef4444',
                    login: 'Email + password',
                  },
                  {
                    role: 'Org Admin',
                    tag: 'Subscriber',
                    desc: 'Creates agents, manages billing, views reports and org analytics.',
                    color: BLUE,
                    login: 'Email + password',
                  },
                  {
                    role: 'Agent',
                    tag: 'Staff',
                    desc: 'Contacts, leads, deals, activities, messaging, and AI assistant.',
                    color: BROWN,
                    login: 'Employee ID + password',
                  },
                ].map((r, i) => (
                  <Reveal key={r.role} delay={i * 0.1}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        p: 3,
                        color: 'white',
                        borderRadius: 2.5,
                        border: `1px solid rgba(170, 170, 170, 0.19)`,
                        bgcolor: CARD_BG,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: `${r.color}44`,
                          bgcolor: `${r.color}08`,
                        },
                      }}
                    >
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: r.color, flexShrink: 0, boxShadow: `0 0 12px ${r.color}88` }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ ...displayFont, fontWeight: 700, fontSize: '1rem' }}>
                            {r.role}
                          </Typography>
                          <Chip
                            label={r.tag}
                            size="small"
                            sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: `${r.color}22`, color: r.color, border: `1px solid ${r.color}33` }}
                          />
                        </Box>
                        <Typography sx={{ ...bodyFont, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                          {r.desc}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography sx={{ ...bodyFont, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.5 }}>
                          Login via
                        </Typography>
                        <Typography sx={{ ...bodyFont, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                          {r.login}
                        </Typography>
                      </Box>
                    </Box>
                  </Reveal>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ my: 20, textAlign: 'center'}}>
        <Container maxWidth="md">
          <Reveal>
            <Typography
              sx={{
                ...bodyFont,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: BROWN,
                mb: 3,
              }}
            >
              Ready to start?
            </Typography>
            <Typography
              component="h2"
              sx={{
                ...displayFont,
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                fontWeight: 900,
                lineHeight: 1.02,
                mb: 3,
              }}
            >
              Close more deals.
              <br />
              <Box
                component="span"
                sx={{
                  color: BROWN,
                  fontStyle: 'italic',
                  textShadow: `0 0 80px ${BROWN}55`,
                }}
              >
                Start today.
              </Box>
            </Typography>
            <Typography
              sx={{
                ...bodyFont,
                color: `${SUBTEXTCOLOR}`,
                fontSize: '1.1rem',
                maxWidth: 420,
                mx: 'auto',
                mb: 6,
                lineHeight: 1.75,
                fontWeight: 300,
              }}
            >
              Free forever. No credit card. Set up in under 5 minutes.
              Upgrade only when your team grows.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/register')}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  ...bodyFont,
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  px: 5,
                  py: 2,
                  borderRadius: 2,
                  bgcolor: BROWN,
                  color: 'white',
                  boxShadow: `0 0 60px ${BROWN}44`,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: LIGHTBROWN,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 60px ${BROWN}66`,
                  },
                }}
              >
                Create free account
              </Button>
              <Button
                onClick={() => navigate('/about')}
                variant="text"
                size="large"
                sx={{
                  ...bodyFont,
                  fontWeight: 500,
                  fontSize: '1.05rem',
                  px: 4,
                  py: 2,
                  borderRadius: 2,
                  color: `${SUBTEXTCOLOR}`,
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                Learn more
              </Button>
            </Box>
          </Reveal>
        </Container>
      </Box>

    </Box>
  );
}