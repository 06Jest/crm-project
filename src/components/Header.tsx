
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { toggleTheme } from '../store/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import logo from '../assets/logobrown.svg'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import FeedbackIcon from '@mui/icons-material/Feedback';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const NAV_LINKS = [
  { label: 'Overview', path: '/overview' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Help', path: '/help' },
  { label: 'About us', path: '/aboutus' },
];

export default function Header() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [betaOpen, setBetaOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const { user } = useAuth();

  const displayName =
    [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(' ') || user?.email || '';

  const avatarLetter = displayName[0]?.toUpperCase() || '?';
  const avatarSrc = undefined;

  const goHome = () => {
    setNavOpen(false);
    navigate(user ? '/app/dashboard' : '/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 2000, bgcolor: !user && themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : themeMode, boxShadow: !user ? 'none' : '-moz-initial' }}>
      <Toolbar sx={{ userSelect: 'none', display: "flex", justifyContent: "space-between", gap: 1, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Typography
          color='text.primary'
          fontWeight={500}
          sx={{
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            fontFamily: '"Lexend Exa", sans-serif',
            cursor: 'pointer',
            minWidth: 0,
            flexShrink: 1,
          }}
          onClick={goHome}
        >
          <img src={logo} style={{ userSelect: 'none', width: isXs ? 36 : 50, marginRight: 5, flexShrink: 0 }} alt="uniThread Logo" />
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            uniThread
          </Box>
          <Chip
            onClick={(e) => {
              e.stopPropagation();
              setBetaOpen(true);
            }}
            icon={
              <ScienceRoundedIcon
                sx={{ fontSize: "12px !important" }}
              />
            }
            label={isXs ? 'BETA' : 'v.0.1.0 BETA'}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              borderRadius: "6px",
              fontSize: 9,
              fontWeight: 700,
              ml: { xs: 1, sm: 3, md: 5 },
              letterSpacing: "0.5px",
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, 0.06),
              cursor: "pointer",
              flexShrink: 0,

              "&:hover": {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, 0.12),
              },

              "& .MuiChip-icon": {
                color: "primary.main",
                ml: "6px",
                mr: "-2px",
              },

              "& .MuiChip-label": {
                px: "6px",
              },
            }}
          />
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {!user && (
            <>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    sx={{ fontWeight: 700 }}
                    color="primary"
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  onClick={() => navigate("/Login")}
                  sx={{ fontWeight: 700 }}
                  color="primary"
                >
                  Log in
                </Button>
                <Button
                  variant="contained" disableElevation
                  onClick={() => navigate("/register")}
                  sx={{ fontWeight: 700 }}
                  color="primary"
                >
                  Get started
                </Button>
                {!user && (
                  <IconButton
                    onClick={()=> dispatch(toggleTheme())}
                    title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                    {themeMode === 'dark' ? (
                      <LightModeIcon />
                    ): (
                      <DarkModeIcon />
                    )}
                  </IconButton>
                  )}
              </Box>

              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained" disableElevation
                  onClick={() => navigate("/register")}
                  size="small"
                  sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                  color="primary"
                >
                  {isXs ? 'Register' : 'Get started'}
                </Button>
                {!user && (
                  <IconButton
                    onClick={()=> dispatch(toggleTheme())}
                    title={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                    {themeMode === 'dark' ? (
                      <LightModeIcon />
                    ): (
                      <DarkModeIcon />
                    )}
                  </IconButton>
                  )}
                <IconButton
                  aria-label="Open menu"
                  color="primary"
                  onClick={() => setNavOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
                
              </Box>
            </>
          )}
          {user && (
            <>
              <Button
                onClick={goHome}
                sx={{ fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } }}
                color="primary"
              >
                Home
              </Button>
              <IconButton
                onClick={goHome}
                color="primary"
                aria-label="Home"
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              >
                <HomeRoundedIcon />
              </IconButton>
            </>
          )}

          {user && (
            <>
              <IconButton
                onClick={handleAvatarClick} sx={{ p: 0.5 }}>
                <Avatar
                  src={avatarSrc}
                  alt={displayName}
                  sx={{ width: 32, height: 32 }}
                >
                  {avatarLetter}
                </Avatar>
              </IconButton>
              <Menu
                disableScrollLock
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleMenuClose(); navigate('/app/profile'); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/app/workspace'); }}>
                  Workspace
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/app/settings'); }}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}
                  sx={{ color: 'error.main' }}>
                  Log out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer
        sx={{zIndex: 3000}}
        anchor="right"
        open={navOpen}
        onClose={() => setNavOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setNavOpen(false)} aria-label="Close menu">
            <CancelIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.path}
              onClick={() => { setNavOpen(false); navigate(link.path); }}
              sx={{ borderRadius: 1 }}
            >
              <ListItemText
                primaryTypographyProps={{ fontWeight: 700 }}
                primary={link.label}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ mx: 2 }} />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            fullWidth
            onClick={() => { setNavOpen(false); navigate('/Login'); }}
            sx={{ fontWeight: 700 }}
            color="primary"
          >
            Log in
          </Button>
          <Button
            fullWidth
            variant="contained" disableElevation
            onClick={() => { setNavOpen(false); navigate('/register'); }}
            sx={{ fontWeight: 700 }}
            color="primary"
          >
            Get started
          </Button>
          
        </Box>
      </Drawer>

      <Dialog
        open={betaOpen}
        onClose={() => setBetaOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="beta-dialog-title"
        aria-describedby="beta-dialog-description"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          id="beta-dialog-title"
          sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 1.5, pr: 6 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.1),
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <ScienceRoundedIcon fontSize="small" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pt: 0.5 }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
              You're using the Beta version
            </Typography>
            <Chip
              label="Beta"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
            />
          </Box>

          <IconButton
            onClick={() => setBetaOpen(false)}
            aria-label="Close"
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent id="beta-dialog-description" sx={{ pt: 0 }}>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            uniThread is currently in beta. Some features may still be refined,
            optimized, or changed as we continue improving the platform.
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
            Since we're iterating quickly, occasional bugs are possible, we
            recommend keeping exports of anything mission-critical in the
            meantime.
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            If you encounter a bug or have an idea for improvement, we'd love to
            hear your feedback directly shapes what we build next.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setBetaOpen(false)} color="inherit">
            Got it
          </Button>

          <Button
            variant="contained"
            disableElevation
            startIcon={<FeedbackIcon />}
            onClick={() => {
              setBetaOpen(false);
              navigate('/feedback');
            }}
          >
            Send Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
};