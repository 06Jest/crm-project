import React, { useState } from 'react';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { Lock as LockIcon, Security as SecurityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { superAdminLogin } from '../../services/superAdminAuthService';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';

import { setSuperAdmin } from '../../store/superAdminSlice';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setError('');
    setShowKeyInput(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretKey.trim()) {
      setError('Secret key is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await superAdminLogin(email, secretKey);

      console.log('LOGIN RESULT:', result);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (!result.data) {
        setError('Login failed. Please try again.');
        return;
      }

      // ✅ FIXED: correct Redux payload
      dispatch(
        setSuperAdmin({
          user: result.data.user,
          token: result.data.token,
        })
      );

      // small safety delay to ensure state updates
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 100);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={0} sx={{ width: '100%' }}>
          {/* HEADER */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: 3,
              textAlign: 'center',
            }}
          >
            <SecurityIcon sx={{ fontSize: 40 }} />

            <Typography variant="h5" fontWeight={700}>
              UniThread Admin Portal
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Super Admin Access
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Chip
                label="Restricted Access"
                size="small"
                sx={{ color: 'white', borderColor: 'white' }}
                variant="outlined"
              />
            </Box>
          </Box>

          <Divider />

          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={!showKeyInput ? handleEmailSubmit : handleLogin}>
              {!showKeyInput ? (
                <>
                  <Typography fontWeight={600} sx={{ mb: 2 }}>
                    Step 1: Email Verification
                  </Typography>

                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleEmailSubmit}
                    disabled={!email.trim() || loading}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>
                    Step 2: Secret Key
                  </Typography>

                  <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
                    {email}
                  </Typography>

                  <TextField
                    fullWidth
                    type="password"
                    label="Secret Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={!secretKey.trim() || loading}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <LockIcon />
                    }
                  >
                    {loading ? 'Verifying...' : 'Login'}
                  </Button>

                  <Button
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => {
                      setShowKeyInput(false);
                      setSecretKey('');
                      setError('');
                    }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
}