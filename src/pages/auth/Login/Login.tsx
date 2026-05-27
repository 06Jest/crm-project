import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import {
  Box, Button, TextField, Typography, Alert,
  Paper, CircularProgress, Tabs, Tab, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import {  useSelector } from 'react-redux';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useEffect } from 'react';
import type { RootState } from '../../../store/store';


type LoginMode = 0 | 1;


export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [mode, setMode] = useState<LoginMode>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);

  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
  });

  const [agentForm, setAgentForm] = useState({
    employeeId: '',
    password: '',
  });
  
  useEffect(() => {
    
      if (!loading && user) {
        navigate('/app/dashboard', { replace: true });
      }
    }, [user, loading, navigate]);
  
    if (loading) return null; 


  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (signInError) throw signInError;
      navigate('/app/dashboard');
    } catch(err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Check your email and password.');
      }
    } finally {
      setLoading(false);
    }; 
  };


  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const employeeIdClean = agentForm.employeeId.trim().toUpperCase();
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, is_active, role')
        .eq('employee_id', employeeIdClean)
        .single();

      if (profileError || !profile) {
        throw new Error('Employee ID not found. Check your ID and try again.');
      }

      if (!profile.is_active) {
        throw new Error('Your account has been deactivated. Contact your admin.');
      }

      if (profile.role !== 'agent') {
        throw new Error('This login is for agents only. Use the Admin tab.');
      }


      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: agentForm.password,
      });

      if (signInError) {
        throw new Error('Incorrect password. Please try again.');
      }
      navigate('/app/dashboard');
    } catch (err) {
      if(err instanceof Error) {
        setError(err.message);
      }else{
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.65)';

  return (
    <Box
      sx={{
        my: 5,
        mx: '5%',
        height: '70vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: '430px',
          height: '60vh',
          width: '75vw',
          maxHeight: '550px',
          minHeight: '450px',
          border: 1,
          justifySelf: 'center',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: `${BACKGROUNDCOLOR}`,
        }}
      >

        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
          Sign in to uniThread
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          Choose your login type below
        </Typography>


        <Tabs
          value={mode}
          onChange={(_, v) => { setMode(v); setError(''); }}
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider'}}
        >
          <Tab
            icon={<EmailIcon fontSize="small" />}
            iconPosition="start"
            label="Admin"
            sx={{ fontSize: 11 }}
          />
          <Tab
            icon={<BadgeIcon fontSize="small" />}
            iconPosition="start"
            label="Agent"
            sx={{ fontSize: 11 }}
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}


        {mode === 0 && (
          <Box component="form" onSubmit={handleAdminLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                size="small" 
                placeholder="loremipsum@gmail.com"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
                required
                fullWidth
                autoFocus
                autoComplete="email"
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                size="small" 
                value={adminForm.password}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, password: e.target.value })
                }
                required
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="medium"
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Sign in as Admin'
                }
              </Button>
            </Box>
          </Box>
        )}


        {mode === 1 && (
          <Box component="form" onSubmit={handleAgentLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Employee ID"
                value={agentForm.employeeId}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, employeeId: e.target.value })
                }
                required
                fullWidth
                autoFocus
                size="small" 
                placeholder="e.g. EMP-2026-0001"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                size="small" 
                value={agentForm.password}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, password: e.target.value })
                }
                required
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="medium"
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Sign in as Agent'
                }
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" >
            <Link to="/register" style={{ color: 'inherit', fontWeight: 500, display: 'flex',
    justifyContent: 'space-between',
    width: '100%', }}>
              Create account
            </Link>
            
          </Typography>
          <Link
            to="/forgot-password"
            style={{ fontSize: 14, color: 'inherit' }}
          >
            Forgot password?
          </Link> 
        </Box>
      </Paper>
    </Box>
  );
}