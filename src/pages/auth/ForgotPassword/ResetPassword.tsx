import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography, Alert,
  Paper, CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);


  useEffect(() => {

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Token detected — user can now set new password
          setSessionReady(true);
        } else if (event === 'SIGNED_IN' && session) {
          setSessionReady(true);
        }
      }
    );

    // Check if there is already a session (token already processed)
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

  const handleReset = async (e: React.FormEvent) => {
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

  if (invalidLink) {
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
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
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
          >
            Request a new reset link
          </Button>
        </Paper>
      </Box>
    );
  }


  if (done) {
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
            textAlign: 'center',
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 56, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Password updated!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your password has been changed successfully.
            Redirecting you to login...
          </Typography>
          <CircularProgress size={20} sx={{ mt: 2 }} />
        </Paper>
      </Box>
    );
  }


  if (!sessionReady) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Verifying your reset link...
          </Typography>
        </Box>
      </Box>
    );
  }

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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            Set new password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose a strong password for your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleReset}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              autoFocus
              helperText="Password must be at least 12 characters that include uppercase letter, number, and symbol"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />

            {newPassword.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
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
                <Typography variant="caption" color="text.secondary">
                  {newPassword.length < 7
                    ? 'Too short'
                    : newPassword.length < 9
                    ? 'Weak — try adding numbers or symbols'
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
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : 'Update password'
              }
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}