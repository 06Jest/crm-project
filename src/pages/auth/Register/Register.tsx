import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography,
  Alert, Paper, CircularProgress, Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    orgName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!form.orgName.trim()) {
    setError('Organization name is required');
    return;
  }
  if (!form.name.trim()) {
    setError('Your name is required');
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

  try {
    // Generate org_id BEFORE creating the user
    const orgId = crypto.randomUUID();

    // Step 1 — Create Supabase Auth user
    // Store org_id in metadata so it's always in the session
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name.trim(),
          role: 'admin',
          org_id: orgId,          
          org_name: form.orgName.trim(),
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!data.user) throw new Error('User creation failed');


    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: form.name.trim(),
        role: 'admin',
        org_id: orgId,
        org_name: form.orgName.trim(),
      })
      .eq('id', data.user.id);

    if (profileError) throw profileError;

    navigate('/app/dashboard');
  } catch (err: any) {
    setError(err.message || 'Registration failed. Please try again.');
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
          maxWidth: 440,
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            Create your organization
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Start your free trial. You'll be the admin of
            your organization and can invite your team after setup.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>


            <TextField
              label="Organization name"
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              placeholder="e.g. Acme Sales Team"
              required
              fullWidth
              helperText="This is the name of your company or team"
            />

            <Divider />


            <TextField
              label="Your full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Work email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Password must be at least 12 characters that include uppercase letter, number, and symbol"
            />
            <TextField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
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
                : 'Create organization account'
              }
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'action.hover',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🔑 Are you an agent?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ask your admin for your Employee ID and login credentials.
            Agents do not register here.
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}