  
import { useState } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import {useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import {
  Box,
  // Paper,
  Tabs,
  Tab,
  // Typography,
  IconButton,
  Snackbar,
  // Fade
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';


export default function Sidebar() {
  const [tab, setTab] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  return (
    <Box
      display={{ 
        xs: 'none',
        sm: 'none',
        md: 'flex'
      }}
      sx={{
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        zIndex: 500,
        width: collapsed ? 70 : 350,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        right: 0,
        top: 0,
        bottom: 0,
        fontSize: '0.75rem',
        pt: 9,
        borderLeft: 0.2, 
        borderColor: '#63636338',
        backgroundColor: themeMode === 'dark' ? '#313131a8' : '#ffffffbe'
      }}
    >
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{ alignSelf: collapsed ? 'flex-center' : 'flex-start', m: 1 }}
      >
        {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
      </IconButton>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '70%',
        width: '100%',
        borderTop: 0.2,
        borderColor: '#63636338'
      }}>

          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{
                minHeight: 36,
                '& .MuiTab-root': {
                  minHeight: 50,
                  minWidth: 58,
                  px: 1,
                  py: 0.5,
                  color: 'inherit',
                  opacity: 0.7
                },
                 '& .MuiTabs-indicator': {
                  display: 'none',
                },
                '& .MuiTabs-flexContainer': {
                  flexDirection: collapsed ? 'column' : 'row',
                  transition: 'all 0.3s ease',
                },

                '& .MuiTab-root.Mui-selected': {
                  color: collapsed ? 'inherit' : 'primary.main',
                  backgroundColor: 'transparent',
                  fontWeight: 'normal',
                }
              }}
          >
            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<NoteAltIcon />}
              title="Notes"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '&:focus': {
                  outline: collapsed ? 'none' : 'block',
                },
              }}
            />

            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<TaskAltIcon />}
              title="Tasks"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '& .MuiTabs-indicator': {
                  display: collapsed ? 'none' : 'block',
                },
              }}
            />

            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<ChatIcon />}
              title="Chats"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '& .MuiTabs-indicator': {
                  display: collapsed ? 'none' : 'block',
                },
              }}
            />

            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<EmailIcon />}
              title="Emails"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '& .MuiTabs-indicator': {
                  display: collapsed ? 'none' : 'block',
                },
              }}
            />

            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<CallIcon />}
              title="Calls"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '& .MuiTabs-indicator': {
                  display: collapsed ? 'none' : 'block',
                },
              }}
            />

            <Tab
              onClick={() => collapsed ? setCollapsed(!collapsed) : setCollapsed(collapsed)}
              iconPosition="start"
              icon={<SmsIcon />}
              title="Sms"
              sx={{
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.6)",
                },
                '& .MuiTabs-indicator': {
                  display: collapsed ? 'none' : 'block',
                },
              }}
            />
          </Tabs>
          {!collapsed && (
          <Box
            onClick={() => setOpenSnackbar(true)}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex', 
              justifyContent: 'center',
              pt: 20, 
              width: '100%', 
              opacity: 0.5,
              cursor: 'pointer'
            }}
          >
            {tab === 0 && (
              <>
                <LockIcon fontSize="large"/>
              </>
            )}

            {tab === 1 && (
              <>
                <LockIcon fontSize="large"/>

              </>
            )}

            {tab === 2 && (
              <>
                <LockIcon fontSize="large"/>

              </>
            )}

            {tab === 3 && (
              <>
                <LockIcon fontSize="large"/>

              </>
            )}

            {tab === 4 && (
              <>
                <LockIcon fontSize="large"/>

              </>
            )}

            {tab === 5 && (
              <>
                <LockIcon fontSize="large"/>

              </>
            )}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              message="Coming Soon!"
            />
          </Box>
          )}

        </Box>
    </Box>
  );
}