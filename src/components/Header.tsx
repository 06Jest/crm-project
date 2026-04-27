import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Menu, MenuItem,
  Divider, Typography } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Badge } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleTheme } from '../store/uiSlice';
import lightLogo from '../assets/crm_logo_transparent.png'
import darkLogo from '../assets/LogoDarkMode.png'
import { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { supabase } from "../services/supabase";
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types/profile'
import { fetchUnreadCounts } from '../store/messagingSlice';
import { fetchMyProfileFromDB } from "../services/profileService";

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

  const [profile, setProfile] = useState<Profile | null>(null);

  const unreadCounts = useSelector(
    (state: RootState) => state.messaging.unreadCounts
  )
  useEffect(() => {
        if (user) {
          dispatch(fetchUnreadCounts(user.id));
          fetchMyProfileFromDB(user.id)
          .then((p) => {
          setProfile(p);
          })
        }
      }, [dispatch, user]);

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0)
  const displayName = user?.user_metadata?.name || user?.email || '';
  const avatarLetter = displayName[0]?.toUpperCase() || '?';
  const avatarSrc =  profile?.avatar_url || undefined;
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ userSelect: 'none',display: "flex", justifyContent: "space-between"}}>
          <img  src={themeMode === 'light' ? lightLogo : darkLogo} alt="Company Logo" style={{ cursor: 'pointer', userSelect: 'none', width: 150 }}  onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }/>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          { !user && (
            <>
              <Button onClick={() => {navigate('/Register')}  
              }  sx={{ fontWeight: 700}} variant="contained" color="primary">Sign Up</Button>
              <Button onClick={() => {navigate('/Login')}  
              }  sx={{ fontWeight: 700}} color="primary">Login</Button>
              
            </>
          )}
          { user && (
          <IconButton  title="Chat with agents">
              <Badge 
                badgeContent={totalUnread}
                color="error"
                invisible={totalUnread === 0}>
                <ChatBubbleIcon onClick={() => {navigate('/app/messaging')}}/>
              </Badge>
          </IconButton>
          )}
          <Button onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }  sx={{ fontWeight: 700}} color="primary">Home</Button>
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
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/app/profile')} }>Profile</MenuItem>
                  <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/app/reports');
                }}>
                  Reports & Analytics
                </MenuItem>
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