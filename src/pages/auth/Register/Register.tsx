import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Divider, Dialog,
  DialogActions, DialogTitle, DialogContent
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import {  useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ErrorAlert from '../../../components/Error';
import { useAuth } from '../../../hooks/useAuth';
import { signUp } from '../../../store/userSlice';


export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAuth();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const [showPassword, setShowPassword] = useState(false);
  const [openRedirect, setOpenRedirect] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    org_name: ''
    
  });

  const handleCloseRedirect = () => {
    setOpenRedirect(false);
  }

  const handleRedirect = () => {
    navigate('/login')
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (loading) return;

    try {
      await  dispatch(signUp(form)).unwrap();

      setOpenRedirect(true);
    } catch  {
      //Error in State
    };
  }

  const BACKGROUNDCOLOR = themeMode === 'light' ? 'rgba(255, 255, 255, 0.73)' : 'rgba(34, 34, 34, 0.4)';

  return (
    <Box
      sx={{
        mx: '5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: ' rgba(39, 39, 39, 0)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '80vw',
          maxWidth: 600,
          height: '85vh',
          maxHeight: 900,
          minHeight: 900,
          border: 1,
          color: 'white',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: `${BACKGROUNDCOLOR}`,
        }}
      >

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="text.secondary">
            Create your organization
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Start your free trial. You'll be the admin of
            your organization and can invite your team after setup.
          </Typography>
        </Box>
        <Box sx={{my: 2}}>
          {error && (
            <ErrorAlert
              message={error}
            />
          )}
        </Box>
        

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>


            <TextField
              label="Organization name"
              name="org_name"
              value={form.org_name}
              onChange={handleChange}
              placeholder="e.g. Acme Sales Team"
              required
              fullWidth
              helperText="This is the name of your company or team"
            />

            <Divider />


            <TextField
              label="Your first name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Your last name"
              name="last_name"
              value={form.last_name}
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
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Password must be at least 12 characters that include uppercase letter, number, and symbol"
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
              size="large"
              disabled={loading || !form.email || !form.first_name || !form.last_name || !form.last_name || !form.password}
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
            Ask your admin for your login credentials.
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
      <Dialog open={openRedirect} onClose={handleCloseRedirect}>
        <DialogTitle sx={{fontWeight: 700}}>
          Register Successful
        </DialogTitle>
        <DialogContent
          >
            The email confirmation is sent in your email, Proceed to login?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRedirect}>
              No
            </Button>
            <Button 
              variant="contained"
              color="error"
              onClick={() => {
                handleRedirect();
              }}
            >
              Yes
            </Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}