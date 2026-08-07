import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Divider, Grow,
} from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import PersonSearch from "@mui/icons-material/PersonSearch";
import Insights from "@mui/icons-material/Insights";
import FilterAlt from "@mui/icons-material/FilterAlt";
import Timeline from "@mui/icons-material/Timeline";
import AccessTime from "@mui/icons-material/AccessTime";
import MarkEmailRead from "@mui/icons-material/MarkEmailRead";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import EditNote from "@mui/icons-material/EditNote";
import BarChart from "@mui/icons-material/BarChart";
import Groups from "@mui/icons-material/Groups";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Verified from "@mui/icons-material/Verified";
import Hub from "@mui/icons-material/Hub";
import PhoneIphone from "@mui/icons-material/PhoneIphone";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import SupportAgent from "@mui/icons-material/SupportAgent";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import TrendingUp from "@mui/icons-material/TrendingUp";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import Handshake from "@mui/icons-material/Handshake";
import Map from "@mui/icons-material/Map";
import TrackChanges from "@mui/icons-material/TrackChanges";
import Assessment from "@mui/icons-material/Assessment";
import Security from "@mui/icons-material/Security";
import type { SvgIconComponent } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import type { RootState } from '../../../store/store';
import ErrorAlert from '../../../components/Error';

interface CrmTip {
  eyebrow: string;
  text: string;
  icon: SvgIconComponent;
}

const AUTOPLAY_MS = 5000;

const CRM_TIPS: CrmTip[] = [
  {
    eyebrow: "LEAD QUALIFICATION",
    icon: PersonSearch,
    text: "Qualify leads early by identifying their needs, budget, and timeline before investing too much time.",
  },
  {
    eyebrow: "SALES INSIGHTS",
    icon: Insights,
    text: "Review your dashboard regularly to spot trends, improve conversion rates, and identify your strongest lead sources.",
  },
  {
    eyebrow: "PIPELINE FOCUS",
    icon: FilterAlt,
    text: "Prioritize active opportunities. A clean pipeline helps your team focus on deals that are most likely to close.",
  },
  {
    eyebrow: "DEAL PROGRESS",
    icon: Timeline,
    text: "Move deals through each stage only after meaningful customer progress—not assumptions or optimism.",
  },
  {
    eyebrow: "FAST RESPONSE",
    icon: AccessTime,
    text: "Respond to new inquiries as quickly as possible. Fast replies build trust and improve conversion rates.",
  },
  {
    eyebrow: "EMAIL COMMUNICATION",
    icon: MarkEmailRead,
    text: "Keep emails concise and always end with a clear next step to encourage customer responses.",
  },
  {
    eyebrow: "CUSTOMER DISCOVERY",
    icon: QuestionAnswer,
    text: "Ask thoughtful questions before presenting solutions. Understanding the problem comes before making the sale.",
  },
  {
    eyebrow: "ACTIVITY LOGS",
    icon: EditNote,
    text: "Record calls, meetings, and important conversations immediately while the details are still fresh.",
  },
  {
    eyebrow: "PERFORMANCE DASHBOARD",
    icon: BarChart,
    text: "Monitor your sales metrics frequently. Small improvements in conversion rates create significant long-term growth.",
  },
  {
    eyebrow: "TEAM COLLABORATION",
    icon: Groups,
    text: "Share notes and updates within your workspace so everyone stays informed about important customers.",
  },
  {
    eyebrow: "WORK SMARTER",
    icon: AutoAwesome,
    text: "Automate repetitive tasks whenever possible so your team can focus on building customer relationships.",
  },
  {
    eyebrow: "DATA ACCURACY",
    icon: Verified,
    text: "Maintain accurate customer information. Reliable data leads to better decisions and stronger customer experiences.",
  },
  {
    eyebrow: "CONNECTED WORKFLOW",
    icon: Hub,
    text: "Keep leads, contacts, deals, and customers connected so every interaction tells a complete story.",
  },
  {
    eyebrow: "MOBILE PRODUCTIVITY",
    icon: PhoneIphone,
    text: "Update customer information immediately after meetings or calls—even while you're on the go.",
  },
  {
    eyebrow: "GETTING STARTED",
    icon: RocketLaunch,
    text: "Start by organizing your workspace and pipeline. A strong foundation makes your sales process more consistent.",
  },
  {
    eyebrow: "CUSTOMER SUCCESS",
    icon: SupportAgent,
    text: "Successful customers become repeat customers. Continue engaging them even after the deal is closed.",
  },
  {
    eyebrow: "FOLLOW-UP SCHEDULE",
    icon: CalendarMonth,
    text: "Schedule every follow-up before ending your current conversation. Never rely on memory alone.",
  },
  {
    eyebrow: "GROWTH OPPORTUNITIES",
    icon: TrendingUp,
    text: "Look for opportunities to expand customer relationships after they've experienced value from your service.",
  },
  {
    eyebrow: "TASK REMINDERS",
    icon: NotificationsActive,
    text: "Use reminders to stay ahead of follow-ups. Consistency often wins more deals than perfect timing.",
  },
  {
    eyebrow: "BUILD TRUST",
    icon: Handshake,
    text: "Long-term business relationships are built by consistently delivering on promises and communicating clearly.",
  },
  {
    eyebrow: "MARKET STRATEGY",
    icon: Map,
    text: "Identify your highest-performing industries or customer segments and focus your sales efforts where they matter most.",
  },
  {
    eyebrow: "LOST OPPORTUNITIES",
    icon: TrackChanges,
    text: "Record why deals are lost. Learning from missed opportunities improves your future sales strategy.",
  },
  {
    eyebrow: "BUSINESS REPORTS",
    icon: Assessment,
    text: "Use reports to measure team performance, identify bottlenecks, and make informed business decisions.",
  },
  {
    eyebrow: "WORKSPACE SECURITY",
    icon: Security,
    text: "Review team permissions regularly to ensure every member has the appropriate level of access.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {
    isAuthenticated,
    loading,
    error,
    login,
    currentUser,
  } = useAuth();

  useEffect(() => {

    if (!loading && isAuthenticated) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const [tipIndex, setTipIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(form).unwrap();

      await currentUser().unwrap();

      navigate(
        result.needsOnboarding
          ? "/onboarding"
          : "/app/dashboard",
        { replace: true }
      );
    } catch {
      // Error is already stored in auth.error
    }
  };

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(34, 34, 34, 0.46)';

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

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'start',  }}>
        <Box
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'start',
            width: '46%',
            p: { md: 6, lg: 8 },
            color: '#F4F1E8',
            backgroundColor: 'transparent' ,
            position: 'relative',
            overflow: 'hidden',
            alignItems: 'center',
            height: 700,
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
                fontSize: { md: 26, lg: 30 }, lineHeight: 1.25, mb: 1, maxWidth: 420,
              }}
            >
              Every relationship starts with the right habit.
            </Typography>
            <Typography sx={{ color: 'rgba(244,241,232,0.6)', fontSize: 14, mb: 4 }}>
              A rotating field guide for teams who live in the CRM.
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
            height: 700,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'start',
            width: { xs: '100%', md: '54%' },
            p: { xs: 3, sm: 5 },
          }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, mb: 4 }}>
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '8px',
                bgcolor: '#E3A548', color: '#101A2E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 13,
              }}
            >
              uT
            </Box>
            <Typography sx={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 19 }}>
              uniThread
            </Typography>
          </Box>

          <Grow in appear timeout={550}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
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
              <Typography
                sx={{ fontFamily: 'Fraunces, serif' }}
                variant="h5"
                fontWeight={600}
                textAlign="center"
                gutterBottom
              >
                Sign in to uniThread
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 3 }}
              >
                Enter your credentials to continue
              </Typography>

              {error && (
                <Box sx={{ mb: 2 }}>
                  <ErrorAlert
                    message={error}
                  />
                </Box>
              )}

              <Box component="form" onSubmit={handleLogin}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Email address"
                    type="email"
                    size="small"
                    placeholder="johndoe@gmail.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    fullWidth
                    autoFocus
                    autoComplete="email"
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    size="small"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    fullWidth
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="medium"
                    disabled={loading || !form.email || !form.password}
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
                      : 'Sign in'
                    }
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary" >
                  <Link to="/register" style={{
                    color: 'inherit', fontWeight: 500, display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                    Create account
                  </Link>

                </Typography>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 14, color: 'inherit' }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Paper>
          </Grow>
        </Box>
      </Box>
    </>
  );
}
