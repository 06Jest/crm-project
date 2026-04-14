import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };


  const handleEmailLogin = async () => {

    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/app/dashboard');
  };


  // const handleGoogleLogin = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/app/dashboard`,
  //     },
  //   });

  // };


  // const handleFacebookLogin = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: 'facebook',
  //     options: {
  //       redirectTo: `${window.location.origin}/app/dashboard`,
  //     },
  //   });
  // };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEmailLogin();
  };

  return (
    <Box sx={{ width: 500,  display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" fontWeight={700}>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Log in to your account
      </Typography>


      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}


      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        autoComplete="email"
      />


      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        fullWidth
        autoComplete="current-password"
      />


      <Box sx={{ textAlign: 'right', mt: -1 }}>
        <Typography
          component={Link}
          to="/forgot-password"
          variant="body2"
          color="primary"
          sx={{ textDecoration: 'none' }}
        >
          Forgot password?
        </Typography>
      </Box>


      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleEmailLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
      </Button>

      <Divider>or</Divider>


      {/* <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </Button>


      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<FacebookIcon />}
        onClick={handleFacebookLogin}
      >
        Continue with Facebook
      </Button> */}


      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Typography
            component={Link}
            to="/register"
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 600 }}
          >
            Sign up free
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}