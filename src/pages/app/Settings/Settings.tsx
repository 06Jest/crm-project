import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { toggleTheme, setTheme } from '../../../store/uiSlice';
import { useAuth } from '../../../hooks/useAuth';
import { stripeApi } from '../../../services/backendApi';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { CircularProgress } from '@mui/material';
import {
  loadSettings,
  saveSettings,
  type NotificationSettings,
} from '../../../utils/settingsStorage';
import { updateProfileInDB } from '../../../services/profileService';
import {
  fetchAgentsFromDB,
  createAgentViaBackend,
  toggleAgentStatusInDB,
  updateAgentInDB,
  sendPasswordResetForAgent,
} from '../../../services/agentsService';
import {
  generateEmployeeId,
  isEmployeeIdTaken,
  formatEmployeeId,
} from '../../../utils/generateEmployeeId';
import type { Profile } from '../../../types/profile';

import {
  Box, Typography, Paper, Switch, 
  Divider, Button, TextField, Alert, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, IconButton, Avatar
} from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';

const APP_VERSION = '1.0.0';
const BUILD_DATE = 'April 2026';

interface Subscription {
  plan: string;
  status: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
}

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  const [notifications, setNotifications] = useState<NotificationSettings>(loadSettings);

  const [orgName, setOrgName] = useState('');
  const  [orgNameSaved, setOrgNameSaved] = useState(false);
  const [orgNameError, setOrgNameError] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    tempPassword: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({ name: '', employeeId: '' });
  const [editLoading, setEditLoading] = useState(false);

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
  useEffect(() => {
    stripeApi.getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription({ plan: 'free', status: 'active' }))
      .finally(() => setSubLoading(false)); 
  }, []);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try{
      const { url } = await stripeApi.createPortal();
      window.open(url, '_blank');
    } catch {
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  const loadAgents = useCallback(async () => {
    if (!user?.org_id) return;
    setAgentsLoading(true);
    try {
      const data = await fetchAgentsFromDB(user.org_id);
      setAgents(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Failed to load agents:', err.message);
      } else {
        console.error('Failed to load agents:', err);
      }
    } finally {
      setAgentsLoading(false);
    }
  }, [user?.org_id]);

  useEffect(() => {
    if (isAdmin) loadAgents();
  }, [isAdmin, loadAgents]);

  const handleOpenCreate = () => {
    const existingIds = agents.map(a => a.employee_id || '');
    const nextId = generateEmployeeId(existingIds);
    setCreateForm({
      name: '',
      email: '',
      employeeId: nextId,
      tempPassword: '',
    });
    setCreateError('');
    setCreateOpen(true);
  };

  const handleCreateAgent = async () => {
    if (!user?.org_id) return;
    setCreateError('');

    // Validate
    if (!createForm.name.trim()) {
      setCreateError('Name is required');
      return;
    }
    if (!createForm.email.trim()) {
      setCreateError('Email is required');
      return;
    }
    if (!createForm.employeeId.trim()) {
      setCreateError('Employee ID is required');
      return;
    }
    if (!createForm.tempPassword || createForm.tempPassword.length < 12) {
      setCreateError('Password must be at least 12 characters');
      return;
    }

    // Check Employee ID uniqueness
    const existingIds = agents.map(a => a.employee_id || '');
    if (isEmployeeIdTaken(createForm.employeeId, existingIds)) {
      setCreateError(`Employee ID ${createForm.employeeId} is already in use`);
      return;
    }

    setCreateLoading(true);
    try {
      const newAgent = await createAgentViaBackend({
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        employeeId: formatEmployeeId(createForm.employeeId),
        tempPassword: createForm.tempPassword,
        orgId: adminProfile.org_id,
        orgName: adminProfile.org_name || 'MiniCRM',
        adminName: adminProfile.name,
      });

      setAgents(prev => [newAgent, ...prev]);
      setCreateOpen(false);
      showSuccess(`Agent ${createForm.name} created! Invite sent to ${createForm.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setCreateError(message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (agent: Profile) => {
    try {
      await toggleAgentStatusInDB(agent.id, !agent.is_active);
      setAgents(prev =>
        prev.map(a =>
          a.id === agent.id ? { ...a, is_active: !a.is_active } : a
        )
      );
      showSuccess(
        `${agent.name} has been ${agent.is_active ? 'deactivated' : 'reactivated'}`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setCreateError(message);
    }
  };

  const handleOpenEdit = (agent: Profile) => {
  setEditAgent(agent);
  setEditForm({ name: agent.name, employeeId: agent.employee_id || '' });
  setEditOpen(true);
};

// Save agent edits
const handleSaveEdit = async () => {
  if (!editAgent) return;
  setEditLoading(true);
  try {
    // Check Employee ID uniqueness if changed
    if (editForm.employeeId !== editAgent.employee_id) {
      const existingIds = agents
        .filter(a => a.id !== editAgent.id)
        .map(a => a.employee_id || '');
      if (isEmployeeIdTaken(editForm.employeeId, existingIds)) {
        setCreateError(`Employee ID ${editForm.employeeId} is already in use`);
        setEditLoading(false);
        return;
      }
    }

    const updated = await updateAgentInDB(editAgent.id, {
        name: editForm.name.trim(),
        employee_id: formatEmployeeId(editForm.employeeId),
      });
      setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
      setEditOpen(false);
      showSuccess('Agent updated successfully');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setCreateError(message);
    } finally {
      setEditLoading(false);
    }
  };

// Send password reset
  const handlePasswordReset = async (agent: Profile) => {
    try {
      await sendPasswordResetForAgent(agent.email);
      showSuccess(`Password reset email sent to ${agent.email}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setCreateError(message);
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
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
              Current plan
            </Typography>

            {subLoading ? (
              <LinearProgress sx={{ borderRadius: 2 }} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      label={subscription?.plan === 'pro' ? 'Pro' : 'Free'}
                      color={subscription?.plan === 'pro' ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    {subscription?.status === 'trialing' && (
                      <Chip label="Trial" color="warning" size="small" />
                    )}
                    {subscription?.status === 'past_due' && (
                      <Chip label="Payment due" color="error" size="small" />
                    )}
                    {subscription?.cancel_at_period_end && (
                      <Chip label="Cancels soon" color="warning" size="small" variant="outlined" />
                    )}
                  </Box>

                  {subscription?.current_period_end && (
                    <Typography variant="caption" color="text.secondary">
                      {subscription.cancel_at_period_end ? 'Access until' : 'Renews'}{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </Typography>
                  )}

                  {subscription?.plan === 'free' && (
                    <Typography variant="caption" color="text.secondary">
                      Upgrade to Pro for unlimited access and AI features
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {subscription?.plan === 'free' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate('/pricing')}
                    >
                      Upgrade to Pro
                    </Button>
                  )}
                  {subscription?.plan === 'pro' && (
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={portalLoading
                        ? <CircularProgress size={12} />
                        : <OpenInNewIcon fontSize="small" />
                      }
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                    >
                      Manage billing
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
      </Paper>


      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{
          p: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GroupIcon color="action" />
            <Box>
              <Typography variant="h6" fontWeight={700}>Users & Agents</Typography>
              <Typography variant="body2" color="text.secondary">
                {agents.length} agent{agents.length !== 1 ? 's' : ''} in your organization
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add agent
          </Button>
        </Box>

        {agentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : agents.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              No agents yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your first agent to get started.
              They'll receive an email with their Employee ID and login credentials.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              Add first agent
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={agent.avatar_url || undefined}
                          sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}
                        >
                          {agent.name[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {agent.name}
                        </Typography>
                      </Box>
                    </TableCell>


                    <TableCell>
                      <Chip
                        label={agent.employee_id || '—'}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace', fontSize: 12 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {agent.email}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          size="small"
                          checked={agent.is_active}
                          onChange={() => handleToggleStatus(agent)}
                          color="success"
                        />
                        <Chip
                          label={agent.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={agent.is_active ? 'success' : 'default'}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Edit name or Employee ID">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(agent)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send password reset email">
                          <IconButton
                            size="small"
                            onClick={() => handlePasswordReset(agent)}
                          >
                            <LockResetIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={agent.is_active ? 'Deactivate' : 'Reactivate'}>
                          <IconButton
                            size="small"
                            color={agent.is_active ? 'error' : 'success'}
                            onClick={() => handleToggleStatus(agent)}
                          >
                            {agent.is_active
                              ? <PersonOffIcon fontSize="small" />
                              : <PersonIcon fontSize="small" />
                            }
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Add new agent</Typography>
          <Typography variant="body2" color="text.secondary">
            An invite email will be sent with their login credentials.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {createError && (
              <Alert severity="error">{createError}</Alert>
            )}
            <TextField
              label="Full name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              fullWidth
              autoFocus
              required
            />
            <TextField
              label="Work email"
              type="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              fullWidth
              required
              helperText="Agent will use this email internally — they log in with Employee ID"
            />
            <TextField
              label="Employee ID"
              value={createForm.employeeId}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  employeeId: e.target.value.toUpperCase(),
                })
              }
              fullWidth
              required
              helperText="Auto-generated. You can override to any format e.g. SALES-001"
              inputProps={{ style: { fontFamily: 'monospace', fontWeight: 600 } }}
            />
            <TextField
              label="Temporary password"
              type="password"
              value={createForm.tempPassword}
              onChange={(e) =>
                setCreateForm({ ...createForm, tempPassword: e.target.value })
              }
              fullWidth
              required
              helperText="Agent will use this to log in for the first time"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAgent}
            disabled={createLoading}
          >
            {createLoading
              ? <CircularProgress size={20} color="inherit" />
              : 'Create agent + send invite'
            }
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit agent</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Full name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              fullWidth
              autoFocus
            />
            <TextField
              label="Employee ID"
              value={editForm.employeeId}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  employeeId: e.target.value.toUpperCase(),
                })
              }
              fullWidth
              helperText="Changing this will affect how the agent logs in"
              inputProps={{ style: { fontFamily: 'monospace', fontWeight: 600 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={editLoading}
          >
            {editLoading
              ? <CircularProgress size={20} color="inherit" />
              : 'Save changes'
            }
          </Button>
        </DialogActions>
      </Dialog>


      <Paper elevation={1} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <InfoIcon color="action" />
          <Box>
            <Typography variant="h6" fontWeight={700}>About uniThread</Typography>
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