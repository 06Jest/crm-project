import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Tabs, Tab, Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import {  useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect } from 'react';
import type { RootState } from '../../../store/store';
import ErrorAlert from '../../../components/Error';


type LoginMode = 0 | 1;


export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>(0);
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);

  const [adminForm, setAdminForm] = useState({
    email: '',
    password: '',
  });

  const [agentForm, setAgentForm] = useState({
    email: '',
    password: '',
  });

  const {
  isAuthenticated,
  loading,
  error,
  adminLogin,
  currentUser,
  agentLogin
} = useAuth();

  useEffect(() => {

  if (!loading && isAuthenticated) {
    navigate("/app/dashboard", { replace: true });
  }
}, [isAuthenticated, loading, navigate]);
  

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await adminLogin(adminForm).unwrap();
      await currentUser().unwrap();
      navigate("/app/dashboard");
    } catch {
      // Error is already stored in auth.error
    }
  };


  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await agentLogin(agentForm);
      await currentUser().unwrap();
      navigate("/app/dashboard");
    } catch {
        // Error is already stored in auth.error
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
          onChange={(_, v) => { setMode(v); }}
          variant="fullWidth"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider'}}
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
          <Box sx={{mb: 2}}>
            <ErrorAlert
              message={error}
            />
          </Box>
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
                disabled={loading || !adminForm.email || !adminForm.password}
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
                label="Email address"
                value={agentForm.email}
                onChange={(e) =>
                  setAgentForm({ ...agentForm, email: e.target.value })
                }
                required
                fullWidth
                autoFocus
                size="small" 
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
                disabled={loading || !agentForm.email || !agentForm.password}
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