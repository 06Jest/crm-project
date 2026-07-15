import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography, Alert,
  Paper, CircularProgress, Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import {  useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [userEmail, setUserEmail] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        userEmail.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) throw resetError;

      const [user, domain] = userEmail.split('@');
      const masked = `${user[0]}***@${domain}`;
      setSentTo(masked);
      setSent(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    }
  };

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.4)';

  if (sent) {
    return (
      <Box
        sx={{
          my: 10, 
          mx: '5%',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(39, 39, 39, 0)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '70vw',
            maxWidth: 400,
            height: '85vh',
            maxHeight: 400,
            minHeight: 400,
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
                setUserEmail('');
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
        my: 5, 
        mx: '5%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(39, 39, 39, 0)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '80vw',
          maxWidth: 420,
          height: '90vh',
          maxHeight: 550,
          minHeight: 550,
          border: 1,
          borderColor: 'divider',
          bgcolor: `${BACKGROUNDCOLOR}`,
          borderRadius: 3,
          textAlign: 'center',
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}


          <Box component="form" onSubmit={handlePasswordReset}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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