import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Menu, MenuItem,
  Divider, Typography } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleTheme } from '../store/uiSlice';
import lightLogo from '../assets/crm_logo_transparent.png'
import darkLogo from '../assets/LogoDarkMode.png'
import { useState } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { supabase } from "../services/supabase";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { user} = useAuthContext();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (e:React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await supabase.auth.signOut();
    navigate('./login');
  };
  const displayName = user?.user_metadata?.name || user?.email || '';
  const avatarLetter = displayName[0]?.toUpperCase() || '?';
  return (
    <AppBar position="static">
      <Toolbar sx={{ userSelect: 'none',display: "flex", justifyContent: "space-between"}}>
          <img  src={themeMode === 'light' ? lightLogo : darkLogo} alt="Company Logo" style={{ cursor: 'pointer', userSelect: 'none', width: 150 }}  onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <Button onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }  sx={{ fontWeight: 700}} color="primary">Home</Button>
          { user && (
            <>
              <IconButton onClick={handleAvatarClick} sx={{  p: 0.5 }}>
                <Avatar
                  src={user.user_metadata.avatar_url}
                  alt={displayName}
                  sx={{ width:32, height: 32 }}
                  >
                    {avatarLetter}
                </Avatar>
              </IconButton>
              <Menu
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
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/app/profile')} }>Profile</MenuItem>
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/app/settings');
                  }}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}
                  sx={{ color: 'error.main' }}>
                  Log out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
};