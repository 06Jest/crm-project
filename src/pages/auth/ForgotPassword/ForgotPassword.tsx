import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // After clicking the link in their email,
      // user is redirected here to set a new password
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Check your email
        </Typography>
        <Alert severity="success">
          We sent a password reset link to <strong>{email}</strong>.
          Click the link in the email to set a new password.
        </Alert>
        <Typography
          component={Link}
          to="/login"
          variant="body2"
          color="primary"
          sx={{ textDecoration: 'none', textAlign: 'center' }}
        >
          Back to login
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Reset your password
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter your email and we'll send you a reset link
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        fullWidth
        autoComplete="email"
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleReset}
        disabled={loading}
      >
        {loading
          ? <CircularProgress size={24} color="inherit" />
          : 'Send reset link'
        }
      </Button>

      <Typography
        component={Link}
        to="/login"
        variant="body2"
        color="primary"
        sx={{ textDecoration: 'none', textAlign: 'center' }}
      >
        Back to login
      </Typography>
    </Box>
  );
}