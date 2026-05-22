import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography, Alert,
  Paper, CircularProgress, Tabs, Tab, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import {  useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

type ResetMode = 0 | 1; 

export default function ForgotPassword() {
  const [mode, setMode] = useState<ResetMode>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [adminEmail, setAdminEmail] = useState('');


  const [agentEmployeeId, setAgentEmployeeId] = useState('');

  const handleAdminReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!adminEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        adminEmail.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) throw resetError;

      const [user, domain] = adminEmail.split('@');
      const masked = `${user[0]}***@${domain}`;
      setSentTo(masked);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const idClean = agentEmployeeId.trim().toUpperCase();
    if (!idClean) {
      setError('Please enter your Employee ID');
      return;
    }
    setLoading(true);
    try {

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, is_active')
        .eq('employee_id', idClean)
        .single();

      if (profileError || !profile) {
        throw new Error('Employee ID not found. Please check and try again.');
      }
      if (!profile.is_active) {
        throw new Error('This account has been deactivated. Contact your admin.');
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        profile.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) throw resetError;


      const [user, domain] = profile.email.split('@');
      const masked = `${user[0]}***@${domain}`;
      setSentTo(masked);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.4)';

  if (sent) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          marginRight: 25,
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: 'rgba(39, 39, 39, 0)',
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
            bgcolor: `${BACKGROUNDCOLOR}`,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 56, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Check your email
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            We sent a password reset link to:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={700}
            sx={{ mb: 2, fontFamily: 'monospace' }}
          >
            {sentTo}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click the link in the email to reset your password.
            The link expires in 1 hour.
          </Typography>
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'action.hover',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Didn't receive it? Check your spam folder.
              The email comes from your organization's email address.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSent(false);
                setAdminEmail('');
                setAgentEmployeeId('');
              }}
            >
              Try a different email
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="text"
              fullWidth
            >
              Back to login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }


  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'rgba(39, 39, 39, 0)',
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
          bgcolor: `${BACKGROUNDCOLOR}`,
        }}
      >

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockResetIcon
            sx={{ fontSize: 44, color: 'primary.main', mb: 1 }}
          />
          <Typography variant="h5" fontWeight={700}>
            Reset your password
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Choose how you want to reset your password
          </Typography>
        </Box>


        <Tabs
          value={mode}
          onChange={(_, v) => {
            setMode(v);
            setError('');
          }}
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
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}


        {mode === 0 && (
          <Box component="form" onSubmit={handleAdminReset}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                fullWidth
                autoFocus
                autoComplete="email"
                helperText="Enter the email you registered with"
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
                  : 'Send reset link'
                }
              </Button>
            </Box>
          </Box>
        )}


        {mode === 1 && (
          <Box component="form" onSubmit={handleAgentReset}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Employee ID"
                value={agentEmployeeId}
                onChange={(e) =>
                  setAgentEmployeeId(e.target.value.toUpperCase())
                }
                required
                fullWidth
                autoFocus
                placeholder="e.g. EMP-2026-0001"
                helperText="We will send the reset link to the email on file"
                inputProps={{ style: { textTransform: 'uppercase' } }}
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
                  : 'Send reset link'
                }
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
            Back to login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}