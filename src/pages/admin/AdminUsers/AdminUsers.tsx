import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Block as BlockIcon,
  Restore as RestoreIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { supabase } from '../../../services/supabase';
import type { Profile } from '../../../types/profile';

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'admins' | 'agents' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'ban' | 'delete' | 'unban'>('ban');
  const [banReason, setBanReason] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data: profiles } = await supabase
          .from('profiles')
          .select(`
            *,
            org:org_id(name)
          `)
          .neq('role', 'super_admin');

        setProfiles(profiles || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (user: Profile, reason: string) => {
    try {
      await supabase
        .from('profiles')
        .update({
          is_active: false,
          is_banned: true,
          ban_reason: reason,
        })
        .eq('id', user.id);

      setProfiles(profiles.map(p =>
        p.id === user.id ? { ...p, is_active: false, is_banned: true } : p
      ));

      setOpenDialog(false);
      setSelectedUser(null);
      setBanReason('');
    } catch (err) {
      console.error('Failed to ban user:', err);
    }
  };

  const handleUnbanUser = async (user: Profile) => {
    try {
      await supabase
        .from('profiles')
        .update({
          is_active: true,
          is_banned: false,
          ban_reason: null,
        })
        .eq('id', user.id);

      setProfiles(profiles.map(p =>
        p.id === user.id ? { ...p, is_active: true, is_banned: false } : p
      ));
    } catch (err) {
      console.error('Failed to unban user:', err);
    }
  };

  const handleDeleteUser = async (user: Profile) => {
    try {

      await supabase.from('profiles').delete().eq('id', user.id);

      setProfiles(profiles.filter(p => p.id !== user.id));
      setOpenDialog(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const filteredUsers = profiles.filter(p => {
    if (tab === 'admins') return p.role === 'admin';
    if (tab === 'agents') return p.role === 'agent';
    if (tab === 'banned') return !p.is_active || p.is_banned;
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        User Management (Tier 1 & 2)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        SUPER ADMIN: Managing all users across all organizations
        <br />
        Tier 2 (Admin): Can only manage agents in their own organization
      </Alert>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`All Users (${profiles.length})`} value="all" />
          <Tab label={`Admins - Tier 2 (${profiles.filter(p => p.role === 'admin').length})`} value="admins" />
          <Tab label={`Agents - Tier 1 (${profiles.filter(p => p.role === 'agent').length})`} value="agents" />
          <Tab label={`Banned (${profiles.filter(p => !p.is_active).length})`} value="banned" />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role (Tier)</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={user.avatar_url} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" fontWeight={500}>
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === 'admin' ? 'Tier 2: Admin' : 'Tier 1: Agent'}
                    size="small"
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{user.org?.name || 'N/A'}</TableCell>
                <TableCell>
                  {user.is_banned ? (
                    <Chip label="Banned" size="small" color="error" variant="filled" />
                  ) : (
                    <Chip label="Active" size="small" color="success" variant="filled" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setMenuUser(user);
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSelectedUser(menuUser);
            setDialogMode('ban');
            setOpenDialog(true);
            setAnchorEl(null);
          }}
          disabled={menuUser?.is_banned}
        >
          <BlockIcon fontSize="small" sx={{ mr: 1 }} />
          Ban User
        </MenuItem>

        <MenuItem
          onClick={() => {
            setSelectedUser(menuUser);
            if (menuUser) {
              handleUnbanUser(menuUser);
            }
            setAnchorEl(null);
          }}
          disabled={!menuUser?.is_banned}
        >
          <RestoreIcon fontSize="small" sx={{ mr: 1 }} />
          Unban User
        </MenuItem>

        <MenuItem
          onClick={() => {
            setSelectedUser(menuUser);
            setDialogMode('delete');
            setOpenDialog(true);
            setAnchorEl(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Ban Dialog */}
      <Dialog open={openDialog && dialogMode === 'ban'} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ban User</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Banning {selectedUser?.name} prevents them from logging in
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ban Reason"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedUser) {
                handleBanUser(selectedUser, banReason);
              }
            }}
            color="error"
            variant="contained"
            disabled={!banReason.trim()}
          >
            Ban User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDialog && dialogMode === 'delete'} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete User Permanently</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            ⚠️ This action cannot be undone
          </Alert>
          <TextField
            fullWidth
            placeholder="Confirm email"
            id="confirm-email"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const input = document.getElementById('confirm-email') as HTMLInputElement;
              if (input?.value === selectedUser?.email) {
                if (selectedUser) {
                  handleDeleteUser(selectedUser);
                }
              }
            }}
            color="error"
            variant="contained"
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}