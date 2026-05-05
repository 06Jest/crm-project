import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography, Alert,
  Paper, CircularProgress, Tabs, Tab, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

type LoginMode = 0 | 1;

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
  });

  const [agentForm, setAgentForm] = useState({
    employeeId: '',
    password: '',
  });

  const parseErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    ) {
      return (error as Record<string, unknown>).message as string;
    }
    return fallback;
  };


  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (signInError) throw signInError;
      navigate('/app/dashboard');
    } catch (err: unknown) {
      setError(parseErrorMessage(err, 'Login failed. Check your email and password.'));
    } finally {
      setLoading(false);
    }
  };


  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const employeeIdClean = agentForm.employeeId.trim().toUpperCase();

    
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, is_active, role')
        .eq('employee_id', employeeIdClean)
        .single();

      if (profileError || !profile) {
        throw new Error('Employee ID not found. Check your ID and try again.');
      }

      if (!profile.is_active) {
        throw new Error('Your account has been deactivated. Contact your admin.');
      }

      if (profile.role !== 'agent') {
        throw new Error('This login is for agents only. Use the Admin tab.');
      }


      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: agentForm.password,
      });

      if (signInError) {
        throw new Error('Incorrect password. Please try again.');
      }

      navigate('/app/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >

        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
          Sign in to MiniCRM
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Choose your login type below
        </Typography>


        <Tabs
          value={mode}
          onChange={(_, v) => { setMode(v); setError(''); }}
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<EmailIcon fontSize="small" />}
            iconPosition="start"
            label="Admin"
            sx={{ fontSize: 13 }}
          />
          <Tab
            icon={<BadgeIcon fontSize="small" />}
            iconPosition="start"
            label="Agent"
            sx={{ fontSize: 13 }}
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}


        {mode === 0 && (
          <Box component="form" onSubmit={handleAdminLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                required
                fullWidth
                autoFocus
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                required
                fullWidth
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Sign in as Admin'
                }
              </Button>
            </Box>
          </Box>
        )}


        {mode === 1 && (
          <Box component="form" onSubmit={handleAgentLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Employee ID"
                value={agentForm.employeeId}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, employeeId: e.target.value })
                }
                required
                fullWidth
                autoFocus
                placeholder="e.g. EMP-2026-0001"
                helperText="Your Employee ID was provided by your admin"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
              <TextField
                label="Password"
                type="password"
                value={agentForm.password}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, password: e.target.value })
                }
                required
                fullWidth
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Sign in as Agent'
                }
              </Button>
            </Box>

            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                💡 Your Employee ID looks like <strong>EMP-2026-0001</strong>.
                Contact your admin if you don't have it.
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No account?{' '}
            <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
              Create organization
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
    </Box>
  );
}