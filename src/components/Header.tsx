import { AppBar, Toolbar, Button, Box, IconButton, Avatar, Menu, Chip, MenuItem,
  Divider, Typography } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import BadgeIcon from '@mui/icons-material/Badge';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Badge } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleTheme } from '../store/uiSlice';
import logo from '../assets/logobrown.png'
import { useState, useEffect } from "react";
import { useAuthContext } from '../hooks/useAuthContext';
import { supabase } from "../services/supabase";
import { useNavigate } from 'react-router-dom';
import type { Profile } from '../types/profile'
import { fetchUnreadCounts } from '../store/messagingSlice';
import { fetchMyProfileFromDB } from "../services/profileService";
import { useRole } from '../hooks/useRole';


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
  const { isAdmin, isSuperAdmin, employeeId } = useRole();
  return (
    <AppBar position="fixed" sx={{  bgcolor: !user && themeMode === 'dark' ? 'transparent' : themeMode }}>
      <Toolbar sx={{ userSelect: 'none',display: "flex", justifyContent: "space-between"}}>
          <Typography variant="h6" color='text.primary' fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }} onClick={
            user ? () => {navigate('/app/dashboard')} :  () => {navigate('/')} 
          }>
            <img src={logo} style={{userSelect: 'none', width: 50, marginRight: 3 }} alt="uniThread Logo" />
            uniThread
          </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          { !user && (
            <>
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
          {employeeId && (
            <Chip
              label={employeeId}
              size="small"
              icon={<BadgeIcon />}
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
          )}
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
                {isAdmin && (
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/app/reports'); }}>
                    Reports & Analytics
                  </MenuItem>
                  )}
                  {isSuperAdmin && (
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/app/analytics'); }}>
                      App Analytics
                    </MenuItem>
                  )}
                  {isAdmin && (
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/app/settings'); }}>
                      Settings
                    </MenuItem>
                  )}
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