import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { toggleTheme, setTheme } from '../../../store/uiSlice';
import { useAuthContext } from '../../../hooks/useAuthContext';
import {
  loadSettings,
  saveSettings,
  type NotificationSettings,
} from '../../../utils/settingsStorage';
import { updateProfileInDB } from '../../../services/profileService';

import {
  Box, Typography, Paper, Switch, 
  Divider, Button, TextField, Alert, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction, Grid,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const APP_VERSION = '1.0.0';
const BUILD_DATE = 'April 2026';

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthContext();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [notifications, setNotifications] = useState<NotificationSettings>(loadSettings);

  const [orgName, setOrgName] = useState('');
  const  [orgNameSaved, setOrgNameSaved] = useState(false);
  const [orgNameError, setOrgNameError] = useState('');


  const [success, setSuccess] = useState('');

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleNotificationToggle = (
    key: keyof NotificationSettings
  ) => {
    const updated = {...notifications, [key]: !notifications[key]};
    setNotifications(updated);
    saveSettings(updated);
    showSuccess('Notification preference saved');
  }
  
  const handleSaveOrgName = async () => {
    if (!orgName.trim() || !user) return;
    setOrgNameError('');
    try {
      await updateProfileInDB(user.id, {
        name: orgName.trim(),
      });
      setOrgNameSaved(true);
      showSuccess('Organization name saved');
      setTimeout(() => setOrgNameSaved(false), 3000)
    } catch {
      setOrgNameError('Failed to save. Please try again.');
    }
  };
   return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 1 — APPEARANCE
      ══════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {themeMode === 'dark' ? <DarkModeIcon color="action" /> : <LightModeIcon color="action" />}
          <Box>
            <Typography variant="h6" fontWeight={700}>Appearance</Typography>
            <Typography variant="body2" color="text.secondary">
              Customize how MiniCRM looks
            </Typography>
          </Box>
        </Box>

        <List disablePadding>
          {/* Dark mode toggle */}
          <ListItem sx={{ py: 2, px: 2.5 }}>
            <ListItemText
              primary="Dark mode"
              secondary={themeMode === 'dark'
                ? 'Dark theme is active — easier on the eyes'
                : 'Light theme is active — switch to dark mode'
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={themeMode === 'dark'}
                onChange={handleThemeToggle}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider />

          {/* Theme quick select */}
          <ListItem sx={{ py: 2, px: 2.5 }}>
            <ListItemText
              primary="Quick select"
              secondary="Choose your preferred theme"
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant={themeMode === 'light' ? 'contained' : 'outlined'}
                  onClick={() => dispatch(setTheme('light'))}
                  startIcon={<LightModeIcon />}
                >
                  Light
                </Button>
                <Button
                  size="small"
                  variant={themeMode === 'dark' ? 'contained' : 'outlined'}
                  onClick={() => dispatch(setTheme('dark'))}
                  startIcon={<DarkModeIcon />}
                >
                  Dark
                </Button>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* ══════════════════════════════════════════════
          SECTION 2 — NOTIFICATIONS
      ══════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NotificationsIcon color="action" />
          <Box>
            <Typography variant="h6" fontWeight={700}>Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              Control what you get notified about
            </Typography>
          </Box>
        </Box>

        {/* Email notifications */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1}>
            Email notifications
          </Typography>
        </Box>

        <List disablePadding>
          {[
            {
              key: 'emailNewContact' as const,
              label: 'New contact added',
              secondary: 'Get notified when a new contact is created',
            },
            {
              key: 'emailNewDeal' as const,
              label: 'New deal created',
              secondary: 'Get notified when a deal is added to the pipeline',
            },
            {
              key: 'emailNewMessage' as const,
              label: 'New message received',
              secondary: 'Get notified when an agent sends you a message',
            },
            {
              key: 'emailWeeklyReport' as const,
              label: 'Weekly summary report',
              secondary: 'Receive a weekly email summary of CRM activity',
            },
          ].map((item, i, arr) => (
            <Box key={item.key}>
              <ListItem sx={{ py: 1.5, px: 2.5 }}>
                <ListItemText
                  primary={item.label}
                  secondary={item.secondary}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications[item.key]}
                    onChange={() => handleNotificationToggle(item.key)}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {i < arr.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        <Divider />

        {/* In-app notifications */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={700} letterSpacing={1}>
            In-app notifications
          </Typography>
        </Box>

        <List disablePadding>
          {[
            {
              key: 'inAppNewMessage' as const,
              label: 'New message badge',
              secondary: 'Show unread count badge on Messages tab',
            },
            {
              key: 'inAppNewLead' as const,
              label: 'New lead alert',
              secondary: 'Show notification when a new lead is added',
            },
          ].map((item, i, arr) => (
            <Box key={item.key}>
              <ListItem sx={{ py: 1.5, px: 2.5 }}>
                <ListItemText
                  primary={item.label}
                  secondary={item.secondary}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications[item.key]}
                    onChange={() => handleNotificationToggle(item.key)}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {i < arr.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'action.hover' }}>
          <Typography variant="caption" color="text.secondary">
            Email notifications require SMTP setup (Milestone 3).
            In-app notifications are active immediately.
          </Typography>
        </Box>
      </Paper>

      {/* ══════════════════════════════════════════════
          SECTION 3 — ORGANIZATION
      ══════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BusinessIcon color="action" />
          <Box>
            <Typography variant="h6" fontWeight={700}>Organization</Typography>
            <Typography variant="body2" color="text.secondary">
              Your organization account settings
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Organization name
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This name appears across the CRM for your team.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Enter your organization name"
              size="small"
              sx={{ flex: 1, maxWidth: 360 }}
              error={!!orgNameError}
              helperText={orgNameError}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveOrgName}
              disabled={!orgName.trim()}
              startIcon={orgNameSaved ? <CheckCircleIcon /> : undefined}
            >
              {orgNameSaved ? 'Saved!' : 'Save'}
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Plan:</strong> Free tier
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <strong>Billing:</strong> Stripe integration coming in Milestone 3
          </Typography>
        </Box>
      </Paper>

      {/* ══════════════════════════════════════════════
          SECTION 4 — USER MANAGEMENT PLACEHOLDER
      ══════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <GroupIcon color="action" />
          <Box>
            <Typography variant="h6" fontWeight={700}>Users & Agents</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your team members and their access
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3, textAlign: 'center' }}>
          <GroupIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Coming in Milestone 4
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 420, mx: 'auto' }}>
            User management lets you create agent accounts,
            assign Employee IDs, manage roles, and invite
            your team via email. This full feature set is
            part of the organization architecture update.
          </Typography>
          <Grid container spacing={1} justifyContent="center" sx={{ maxWidth: 480, mx: 'auto' }}>
            {[
              'Create agent accounts',
              'Assign Employee IDs',
              'Invite via email',
              'Manage roles',
              'Deactivate users',
              'Reset passwords',
            ].map((feature) => (
              <Grid key={feature}>
                <Chip label={feature} size="small" variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* ══════════════════════════════════════════════
          SECTION 5 — ABOUT
      ══════════════════════════════════════════════ */}
      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <InfoIcon color="action" />
          <Box>
            <Typography variant="h6" fontWeight={700}>About MiniCRM</Typography>
            <Typography variant="body2" color="text.secondary">
              App info and tech stack
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid sx={{xs: 6, sm: 3}}>
              <Typography variant="caption" color="text.secondary">Version</Typography>
              <Typography variant="body2" fontWeight={600}>{APP_VERSION}</Typography>
            </Grid>
            <Grid sx={{xs: 6, sm: 3}}>
              <Typography variant="caption" color="text.secondary">Build date</Typography>
              <Typography variant="body2" fontWeight={600}>{BUILD_DATE}</Typography>
            </Grid>
            <Grid sx={{xs: 6, sm: 3}}>
              <Typography variant="caption" color="text.secondary">Environment</Typography>
              <Typography variant="body2" fontWeight={600}>
                {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
              </Typography>
            </Grid>
            <Grid sx={{xs: 6, sm: 3}}>
              <Typography variant="caption" color="text.secondary">Database</Typography>
              <Typography variant="body2" fontWeight={600}>Supabase</Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Built with
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {[
              'React 18', 'TypeScript', 'Vite', 'Material UI',
              'Redux Toolkit', 'Supabase', 'Chart.js', 'Leaflet',
              'react-leaflet', '@hello-pangea/dnd', 'Cloudinary',
            ].map((tech) => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11 }}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="text"
            onClick={() => window.open('https://supabase.com/docs', '_blank')}
          >
            Supabase docs
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => window.open('https://mui.com', '_blank')}
          >
            MUI docs
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => window.open('https://redux-toolkit.js.org', '_blank')}
          >
            Redux Toolkit docs
          </Button>
        </Box>
      </Paper>

      {/* ══════════════════════════════════════════════
          SECTION 6 — DANGER ZONE
      ══════════════════════════════════════════════ */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'error.main',
          opacity: 0.85,
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'error.main', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon color="error" />
          <Box>
            <Typography variant="h6" fontWeight={700} color="error.main">
              Danger zone
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Irreversible actions — proceed with caution
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Delete organization account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Permanently delete your account and all associated data.
                This cannot be undone.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                // For now just show an alert
                // In Milestone 4 this will open a confirmation dialog
                // and handle the actual deletion
                alert(
                  'Account deletion will be available in a future update. ' +
                  'Please contact support to delete your account.'
                );
              }}
            >
              Delete account
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}