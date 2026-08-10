import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockResetIcon from '@mui/icons-material/LockReset';

const CARD_MAX_WIDTH = 440;

const cardSx = {
  width: '100%',
  maxWidth: CARD_MAX_WIDTH,
  boxSizing: 'border-box' as const,
  p: { xs: 3, sm: 4 },
  border: 1,
  borderColor: 'divider',
  borderRadius: 3,
  bgcolor: 'background.paper',
  textAlign: 'center' as const,
};

function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');

  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return trimmed;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  const firstChar = localPart.charAt(0) || '*';

  return `${firstChar}***@${domain}`;
}

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return; 

    setError('');

    const trimmedEmail = userEmail.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) throw resetError;

      setSentTo(maskEmail(trimmedEmail));
      setSent(true);
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError(
        "We couldn't send the reset email right now. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Paper elevation={0} sx={cardSx}>
          <CheckCircleIcon sx={{ fontSize: { xs: 48, sm: 56 }, color: 'success.main', mb: 2 }} />

          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
            Check your email
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            We sent a password reset link to:
          </Typography>

          <Typography
            variant="body1"
            fontWeight={700}
            sx={{
              mb: 2,
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
            }}
          >
            {sentTo}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Click the link in the email to reset your password. The link
            expires in 1 hour.
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
              Didn&apos;t receive it? Check your spam folder — the email comes
              from your organization&apos;s email address.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ minHeight: 44 }}
              onClick={() => {
                setSent(false);
                setSentTo('');
                setUserEmail('');
              }}
            >
              Try a different email
            </Button>
            <Button component={Link} to="/login" variant="text" fullWidth sx={{ minHeight: 44 }}>
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
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Paper elevation={0} sx={cardSx}>
        <Box sx={{ mb: 3 }}>
          <LockResetIcon sx={{ fontSize: { xs: 40, sm: 44 }, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" component="h1" fontWeight={700}>
            Reset your password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your email and we&apos;ll send you a reset link
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handlePasswordReset} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email address"
              type="email"
              value={userEmail}
              onChange={handleEmailChange}
              required
              fullWidth
              autoFocus={isDesktop}
              autoComplete="email"
              disabled={loading}
              helperText="Enter the email you registered with"
              inputProps={{
                inputMode: 'email',
                autoCapitalize: 'none',
                autoCorrect: 'off',
                'aria-required': true,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ minHeight: 48 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                {loading && <CircularProgress size={18} color="inherit" />}
                {loading ? 'Sending...' : 'Send reset link'}
              </Box>
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Remember your password?{' '}
          <Link
            to="/login"
            style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}
          >
            Back to login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}