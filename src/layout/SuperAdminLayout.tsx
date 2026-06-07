import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import SuperAdminHeader from '../components/SuperAdminHeader';
import { Outlet } from 'react-router-dom';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <DashboardIcon />,
    section: 'main',
  },
  {
    label: 'Analytics',
    path: '/admin/analytics',
    icon: <AnalyticsIcon />,
    section: 'main',
  },
  {
    label: 'Users Management',
    path: '/admin/users',
    icon: <PeopleIcon />,
    section: 'manage',
  },
  {
    label: 'Organizations',
    path: '/admin/accounts',
    icon: <BusinessIcon />,
    section: 'manage',
  },
  {
    label: 'Security',
    path: '/admin/security',
    icon: <SecurityIcon />,
    section: 'settings',
  },
];

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 260;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'static', mt: '50px' }}>
      <SuperAdminHeader />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: 64,
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        <List>
          {menuItems
            .filter(item => item.section === 'main')
            .map(item => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemText
              primary="Management"
              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
            />
          </ListItem>

          {menuItems
            .filter(item => item.section === 'manage')
            .map(item => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

          <Divider sx={{ my: 1 }} />

          <ListItem>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
            />
          </ListItem>

          {menuItems
            .filter(item => item.section === 'settings')
            .map(item => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          background: '#f5f5f5',
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}