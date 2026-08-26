import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Divider, Dialog,
  DialogActions, DialogTitle, DialogContent, Grow,
  Checkbox, FormControlLabel
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Dashboard from "@mui/icons-material/Dashboard";
import PersonSearch from "@mui/icons-material/PersonSearch";
import FactCheck from "@mui/icons-material/FactCheck";
import Contacts from "@mui/icons-material/Contacts";
import Handshake from "@mui/icons-material/Handshake";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Timeline from "@mui/icons-material/Timeline";
import EditNote from "@mui/icons-material/EditNote";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Search from "@mui/icons-material/Search";
import Groups from "@mui/icons-material/Groups";
import Assessment from "@mui/icons-material/Assessment";
import Verified from "@mui/icons-material/Verified";
import Update from "@mui/icons-material/Update";
import Hub from "@mui/icons-material/Hub";
import Security from "@mui/icons-material/Security";
import Repeat from "@mui/icons-material/Repeat";
import Diversity3 from "@mui/icons-material/Diversity3";
import type { SvgIconComponent } from '@mui/icons-material';
import ErrorAlert from '../../../components/Error';
import { useAuth } from '../../../hooks/useAuth';
import { signUp } from '../../../store/userSlice';
import { supabase } from '../../../services/supabase';

interface CrmTip {
  eyebrow: string;
  text: string;
  icon: SvgIconComponent;
}

const AUTOPLAY_MS = 5000;

const CRM_TIPS: CrmTip[] = [
  {
    eyebrow: "NAVIGATING THE CRM",
    icon: Dashboard,
    text: "Start with the dashboard to get a quick overview of your team's sales activity, pipeline, and customer progress.",
  },
  {
    eyebrow: "LEADS",
    icon: PersonSearch,
    text: "Use Leads to keep track of potential customers before they become qualified opportunities.",
  },
  {
    eyebrow: "QUALIFYING LEADS",
    icon: FactCheck,
    text: "Move a lead forward only when you've gathered enough information to determine that the opportunity is worth pursuing.",
  },
  {
    eyebrow: "CONTACTS",
    icon: Contacts,
    text: "Keep contact information accurate so your team always knows who they're communicating with.",
  },
  {
    eyebrow: "DEALS",
    icon: Handshake,
    text: "Create a deal when a qualified opportunity enters an active sales process.",
  },
  {
    eyebrow: "PIPELINE",
    icon: FilterAlt,
    text: "Use your pipeline to understand where every active opportunity currently stands.",
  },
  {
    eyebrow: "DEAL STAGES",
    icon: Timeline,
    text: "Update a deal's stage whenever there is meaningful progress instead of leaving opportunities in outdated stages.",
  },
  {
    eyebrow: "ACTIVITIES",
    icon: EditNote,
    text: "Record calls, meetings, notes, and other interactions so your team has the full customer history.",
  },
  {
    eyebrow: "FOLLOW-UPS",
    icon: CalendarMonth,
    text: "Never rely entirely on memory. Record follow-up activities so important conversations don't get forgotten.",
  },
  {
    eyebrow: "CUSTOMERS",
    icon: SupportAgent,
    text: "Once a deal becomes a customer, keep their information updated and continue tracking the relationship.",
  },
  {
    eyebrow: "SEARCH",
    icon: Search,
    text: "Use search and filters to quickly find the leads, contacts, deals, or customers you need.",
  },
  {
    eyebrow: "TEAM",
    icon: Groups,
    text: "Keep your teammates informed by recording important updates directly in the CRM.",
  },
  {
    eyebrow: "DASHBOARD",
    icon: Assessment,
    text: "Check your dashboard regularly to spot trends, bottlenecks, and opportunities that need attention.",
  },
  {
    eyebrow: "DATA QUALITY",
    icon: Verified,
    text: "Accurate CRM data leads to better reports and better decisions. Keep records complete and up to date.",
  },
  {
    eyebrow: "STATUS UPDATES",
    icon: Update,
    text: "Keep statuses current. An outdated status can make your pipeline look healthier or weaker than it actually is.",
  },
  {
    eyebrow: "WORKSPACE",
    icon: Hub,
    text: "Your workspace keeps your team's CRM data connected in one place.",
  },
  {
    eyebrow: "PERMISSIONS",
    icon: Security,
    text: "Use appropriate team roles and permissions so members have access to the information they actually need.",
  },
  {
    eyebrow: "CONSISTENCY",
    icon: Repeat,
    text: "A consistent workflow makes your CRM more useful. Record important interactions and update records as work happens.",
  },
  {
    eyebrow: "CUSTOMER RELATIONSHIPS",
    icon: Diversity3,
    text: "CRM isn't just about closing deals. Use the information you collect to build stronger long-term relationships.",
  },
  {
    eyebrow: "GETTING STARTED",
    icon: BusinessIcon,
    text: "After verifying your email, complete your profile and workspace setup before starting to manage your CRM.",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAuth();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleCloseRedirect = () => {
    setOpenRedirect(false);
  }

  const handleRedirect = () => {
    navigate('/login')
  }

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      console.error(error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!agreedToPolicies) {
      return;
    }

    try {
      await dispatch(signUp(form)).unwrap();

      setOpenRedirect(true);
    } catch {
      // Error in State
    }
  };

  const [tipIndex, setTipIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CRM_TIPS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, tipIndex]);

  const goPrevTip = () => setTipIndex((prev) => (prev - 1 + CRM_TIPS.length) % CRM_TIPS.length);
  const goNextTip = () => setTipIndex((prev) => (prev + 1) % CRM_TIPS.length);

  const activeTip = CRM_TIPS[tipIndex];
  const ActiveIcon = activeTip.icon;

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.4)';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');

        @keyframes uniThreadTipFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes uniThreadProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .unithread-tip {
          animation: uniThreadTipFade 0.5s ease;
        }
        .unithread-progress-fill {
          animation-name: uniThreadProgress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .unithread-tip, .unithread-progress-fill { animation: none !important; }
        }
      `}</style>

      <Box sx={{ display: 'flex', width: '100%', minHeight: '60vh' }}>
        <Box
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            width: '46%',
            p: { md: 6, lg: 8 },
            color: '#F4F1E8',
            backgroundColor: 'transparent',
            position: 'relative',
            overflow: 'hidden',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          />
          <Box sx={{ zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Fraunces, serif', fontWeight: 600,
                fontSize: { md: 26, lg: 35 }, lineHeight: 1.25, mb: 1, maxWidth: 420,
              }}
            >
              Start building better customer relationships.
            </Typography>
            <Typography sx={{ color: 'rgba(244,241,232,0.6)', fontSize: 14, mb: 4, maxWidth: 420 }}>
              uniThread connects your leads, contacts, deals, and customers in one continuous workflow.
            </Typography>

            <Box key={tipIndex} className="unithread-tip" aria-live="polite" sx={{ minHeight: 160, maxWidth: 440 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 40, height: 40, borderRadius: '50%',
                    bgcolor: 'rgba(227,165,72,0.15)', border: '1px solid rgba(227, 155, 72, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <ActiveIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'primary.main' }}>
                    {activeTip.eyebrow}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'rgba(244,241,232,0.5)' }}>
                    Tip {String(tipIndex + 1).padStart(2, '0')} / {String(CRM_TIPS.length).padStart(2, '0')}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 17, lineHeight: 1.6, color: '#F4F1E8' }}>
                {activeTip.text}
              </Typography>
            </Box>

            <Box sx={{ mt: 4, maxWidth: 440 }}>
              <Box sx={{ height: 3, borderRadius: 2, bgcolor: 'rgba(244,241,232,0.15)', overflow: 'hidden', mb: 2 }}>
                <Box
                  key={`progress-${tipIndex}`}
                  className="unithread-progress-fill"
                  style={{
                    animationDuration: `${AUTOPLAY_MS}ms`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                  }}
                  sx={{ height: '100%', bgcolor: 'primary.main', width: 0 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={goPrevTip} aria-label="Previous tip" sx={{ color: 'rgba(244,241,232,0.7)' }}>
                  <ChevronLeft />
                </IconButton>
                <IconButton size="small" onClick={goNextTip} aria-label="Next tip" sx={{ color: 'rgba(244,241,232,0.7)' }}>
                  <ChevronRight />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ zIndex: 1 }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '100%', md: '54%' },
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Grow in appear timeout={550}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                width: '100%',
                maxWidth: 470,
                border: 1,
                borderColor: 'divider',
                borderRadius: 4,
                bgcolor: BACKGROUNDCOLOR,
                backdropFilter: 'blur(6px)',
                boxShadow: '0 20px 60px -25px rgba(16,26,46,0.35)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography
                  sx={{ fontFamily: 'Fraunces, serif' }}
                  variant="h5"
                  fontWeight={600}
                  gutterBottom
                >
                  Create your account
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Create your account to get started.
                  After verifying your email, you'll finish setting up your profile and workspace.
                </Typography>
              </Box>

              {error && (
                <Box sx={{ mb: 2 }}>
                  <ErrorAlert
                    message={error}
                  />
                </Box>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    size="small"
                    value={form.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoFocus
                    autoComplete="email"
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    value={form.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    autoComplete="new-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreedToPolicies}
                        onChange={(e) => setAgreedToPolicies(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', fontWeight: 600 }}
                        >
                          Terms of Service
                        </Link>
                        {', '}
                        <Link
                          to="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', fontWeight: 600 }}
                        >
                          Privacy Policy
                        </Link>
                        {' and '}
                        <Link
                          to="/cookiepolicy"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', fontWeight: 600 }}
                        >
                          Cookie Policy
                        </Link>
                        .
                      </Typography>
                    }
                    sx={{
                      alignSelf: 'center',
                      m: 0,
                      width: '100%',
                      '& .MuiCheckbox-root': {
                        p: 0.2,
                        mt: '-15px',
                        mr: 0.75,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="medium"
                    disabled={
                      loading ||
                      !form.email ||
                      !form.password ||
                      !agreedToPolicies
                    }
                    sx={{
                      py: 1.1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: '#16304F' },
                    }}
                  >
                    {loading
                      ? <CircularProgress size={22} color="inherit" />
                      : 'Create account'
                    }
                  </Button>
                  <Divider>
                    or
                  </Divider>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      onClick={handleGoogleSignUp}
                      disabled={loading}
                      sx={{
                        width: 30,
                        height: 30,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '50%',
                        transition: 'transform 0.15s ease, background-color 0.15s ease',

                        '&:hover': {
                          backgroundColor: 'action.hover',
                          transform: 'scale(1.15)',
                        },

                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src="/google.svg"
                        alt="Continue with Google"
                        sx={{
                          width: 30,
                          height: 30,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </Paper>
          </Grow>
        </Box>
      </Box>

      <Dialog
        open={openRedirect}
        onClose={handleCloseRedirect}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Verify your email
        </DialogTitle>
        <DialogContent>
          We've sent a verification email to your inbox.

          Please verify your email before signing in.

          Once verified, you'll complete your profile and workspace setup.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRedirect}>
            Later
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleRedirect();
            }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}