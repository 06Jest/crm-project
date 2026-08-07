import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Menu,  MenuItem,
  Divider, Typography, } from "@mui/material";
import {  useSelector } from 'react-redux';
import type {  RootState } from '../store/store';
import logo from '../assets/logobrown.png'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { logout } = useAuth();
  
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
    await logout();
    navigate('/login');
  };

  const { user } = useSelector(
    (state: RootState) => state.user)
    
  const displayName =
  [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.email || '';

  const avatarLetter = displayName[0]?.toUpperCase() || '?';
  const avatarSrc =   undefined;
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000,  bgcolor: !user && themeMode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : themeMode, boxShadow: !user ? 'none' : '-moz-initial' }}>
      <Toolbar sx={{ userSelect: 'none',display: "flex", justifyContent: "space-between"}}>
          <Typography   color='text.primary' fontWeight={500} sx={{ letterSpacing: '0.15em', display: 'flex', alignItems: 'center', fontFamily: '"Lexend Exa", sans-serif' }} onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }>
            <img src={logo} style={{userSelect: 'none', width: 50, marginRight: 5 }} alt="uniThread Logo" />
            uniThread
          </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          { !user && (
            <>
              <Button onClick={() => {navigate('/Login')}  
              }  sx={{ fontWeight: 700}} color="primary">Login</Button>
              
            </>
          )}
          <Button onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }  sx={{ fontWeight: 700}} color="primary">Home</Button>
        
          { user && (
            <>
              <IconButton
                onClick={handleAvatarClick} sx={{  p: 0.5 }}>
                <Avatar
                  src={avatarSrc}
                  
                  alt={displayName}
                  sx={{ width:32, height: 32 }}
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
    </AppBar>
  )
};