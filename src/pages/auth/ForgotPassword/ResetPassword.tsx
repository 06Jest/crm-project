import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkOffIcon from '@mui/icons-material/LinkOff';

const CARD_MAX_WIDTH = 420;

const cardSx = {
  width: '100%',
  maxWidth: CARD_MAX_WIDTH,
  boxSizing: 'border-box' as const,
  p: { xs: 2.5, sm: 4 },
  border: 1,
  borderColor: 'divider',
  borderRadius: 3,
  bgcolor: 'background.paper',
};

const pageWrapperSx = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: { xs: 2, sm: 3 },
  py: { xs: 4, sm: 6 },
  boxSizing: 'border-box' as const,
  overflowX: 'hidden' as const,
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSessionReady(true);
        } else if (event === 'SIGNED_IN' && session) {
          setSessionReady(true);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      } else {

        const hash = window.location.hash;
        if (!hash.includes('access_token') && !hash.includes('type=recovery')) {
          setInvalidLink(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setDone(true);

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update password. Please try again.');
      }
    };
  }

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  if (invalidLink) {
    return (
      <Box sx={pageWrapperSx}>
        <Paper elevation={0} sx={{ ...cardSx, textAlign: 'center' }}>
          <LinkOffIcon sx={{ fontSize: { xs: 44, sm: 48 }, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
            Invalid or expired link
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This password reset link is invalid or has expired.
            Reset links are only valid for 1 hour.
          </Typography>
          <Button
            component={Link}
            to="/forgot-password"
            variant="contained"
            fullWidth
            sx={{ minHeight: 44 }}
          >
            Request a new reset link
          </Button>
        </Paper>
      </Box>
    );
  }


  if (done) {
    return (
      <Box sx={pageWrapperSx}>
        <Paper elevation={0} sx={{ ...cardSx, textAlign: 'center' }}>
          <CheckCircleIcon
            sx={{ fontSize: { xs: 48, sm: 56 }, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
            Password updated!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your password has been changed successfully.
            Redirecting you to login...
          </Typography>
          <CircularProgress size={20} sx={{ mt: 2 }} aria-label="Redirecting to login" />
        </Paper>
      </Box>
    );
  }


  if (!sessionReady) {
    return (
      <Box sx={pageWrapperSx}>
        <Paper elevation={0} sx={{ ...cardSx, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} aria-label="Verifying your reset link" />
          <Typography variant="body2" color="text.secondary">
            Verifying your reset link...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={pageWrapperSx}>
      <Paper elevation={0} sx={cardSx}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: { xs: 40, sm: 44 }, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" component="h1" fontWeight={700}>
            Set new password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose a strong password for your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleReset} noValidate>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              fullWidth
              autoFocus={isDesktop}
              disabled={loading}
              helperText="Password must be at least 12 characters that include uppercase letter, number, and symbol"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              fullWidth
              disabled={loading}
              autoComplete="new-password"
            />

            {newPassword.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }} aria-hidden="true">
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        bgcolor:
                          newPassword.length >= i * 3
                            ? newPassword.length >= 12
                              ? 'success.main'
                              : newPassword.length >= 8
                              ? 'warning.main'
                              : 'error.main'
                            : 'action.hover',
                        transition: 'background-color 0.2s',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary" aria-live="polite">
                  {newPassword.length < 7
                    ? 'Too short'
                    : newPassword.length < 9
                    ? 'Weak, try adding numbers or symbols'
                    : newPassword.length >= 12
                    ? 'Good password'
                    : 'Strong password ✓'
                  }
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                {loading && <CircularProgress size={18} color="inherit" />}
                {loading ? 'Updating...' : 'Update password'}
              </Box>
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}