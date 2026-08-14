
import { useState } from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import useDock from '../hooks/useDock';
export const MOBILE_BOTTOM_NAV_HEIGHT = 64;

const tabs = [
  { label: "Notes", icon: NoteAltIcon, width: 450, height: 550 },
  { label: "Tasks", icon: TaskAltIcon, width: 450, height: 550 },
  { label: "Chats", icon: ChatIcon, width: 450, height: 550 },
  { label: "Emails", icon: EmailIcon, width: 800, height: 600 },
  { label: "Calls", icon: CallIcon, width: 450, height: 550 },
  { label: "SMS", icon: SmsIcon, width: 450, height: 550 },
];

export default function Sidebar() {
  const [tab, setTab] = useState(0);
  const { collapsed, setCollapsed } = useSidebar();
  const { openWindow } = useDock();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const handleSelect = (index: number) => {
    setTab(index);
    const { label, icon: Icon, width, height } = tabs[index];
    openWindow({ id: label.toLowerCase(), title: label, Icon, width, height });
  };

  return (
    <>
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
          width: collapsed ? 60 : 180,
          transition: 'width 0.3s ease',
          alignItems: 'flex-end',
          overflow: 'hidden',
          left: 0,
          top: 0,
          bottom: 0,
          fontSize: '0.75rem',
          pt: 9,
          borderRight: 0.5,
          borderColor: '#63636338',
          backgroundColor: themeMode === 'dark' ? '#535353a8' : '#e7e7e7'
        }}
      >
        <Box sx={{ m: 1, px: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}

          >
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          height: '70%',
          width: '100%',
          borderTop: 0.2,
          borderColor: '#63636338'
        }}>

          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(_, value) => setTab(value)}
            sx={{
              width: "100%",
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {tabs.map(({ label, icon: Icon, width, height }, index) => (

              <Tab
                key={label}
                value={index}
                title={label}
                onClick={() => {
                  if (collapsed) setCollapsed(false);
                  openWindow({ id: label.toLowerCase(), title: label, Icon, width, height });
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                      gap: 1.5,
                      transformOrigin: "left center",
                      transition: "transform .25s ease",
                      ".MuiTab-root:hover &": {
                        transform: collapsed ? "scale(1.2)" : "scale(1.12)",
                      },
                    }}
                  >
                    <Icon />

                    <Box
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        transition: "opacity .2s ease, width .3s ease",
                      }}
                    >
                      {label}
                    </Box>
                  </Box>
                }
                sx={{
                  minHeight: 48,
                  width: "100%",
                  px: 2,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "inherit",
                  opacity: 0.7,
                  "&.Mui-selected": {
                    color: "primary.main",
                    opacity: 1,
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            ))}
          </Tabs>

        </Box>
      </Box>

      {/* ===================== MOBILE BOTTOM NAVIGATION (xs/sm) ===================== */}
      <Paper
        elevation={3}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          borderTop: '0.5px solid',
          borderColor: '#63636338',
        }}
      >
        <BottomNavigation
          showLabels
          value={tab}
          onChange={(_, newValue: number) => handleSelect(newValue)}
          sx={{
            height: MOBILE_BOTTOM_NAV_HEIGHT,
            backgroundColor: themeMode === 'dark' ? '#2b2b2b' : '#ffffff',
          }}
        >
          {tabs.map(({ label, icon: Icon }) => (
            <BottomNavigationAction
              key={label}
              label={label}
              icon={<Icon fontSize="small" />}
              sx={{
                minWidth: 0,
                px: 0.5,
                color: 'inherit',
                opacity: 0.7,
                '&.Mui-selected': {
                  color: 'primary.main',
                  opacity: 1,
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.65rem',
                  '&.Mui-selected': {
                    fontSize: '0.7rem',
                  },
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}