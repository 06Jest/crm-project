import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async () => {

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }


    setSuccess(true);
  };


  if (success) {
    return (
      <Box sx={{  display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          Account created! 🎉
        </Typography>
        <Alert severity="success">
          Your account has been created successfully.
          Please check your email to verify your account,
          then log in.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Go to login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Create your account
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TextField
        label="Full name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        autoComplete="name"
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        autoComplete="email"
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        autoComplete="new-password"
        helperText="Minimum 6 characters"
      />

      <TextField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        fullWidth
        autoComplete="new-password"
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading
          ? <CircularProgress size={24} color="inherit" />
          : 'Create account'
        }
      </Button>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Typography
            component={Link}
            to="/login"
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 600 }}
          >
            Log in
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}