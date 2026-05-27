import  { useState, useEffect } from 'react';
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
  Chip,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as ResumeIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { supabase } from '../../../services/supabase';
import type { Organization } from '../../../types/organization';

export default function AdminAccounts() {
  const [orgs, setOrgs] = useState<Organization[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'pause' | 'delete'>('pause');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOrg, setMenuOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);

        const { data: organizations } = await supabase
          .from('organizations')
          .select(`*, admin:admin_id(name, email)`)
          .order('created_at', { ascending: false });
          

        setOrgs(organizations || []);
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  const handlePauseOrg = async (org: Organization) => {
    try {
      await supabase
        .from('organizations')
        .update({ subscription_status: 'paused' })
        .eq('id', org.id);

      setOrgs(orgs.map(o =>
        o.id === org.id ? { ...o, subscription_status: 'paused' } : o
      ));
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to pause organization:', err);
    }
  };

  const handleResumeOrg = async (org: Organization) => {
    try {
      await supabase
        .from('organizations')
        .update({ subscription_status: 'active' })
        .eq('id', org.id);

      setOrgs(orgs.map(o =>
        o.id === org.id ? { ...o, subscription_status: 'active' } : o
      ));
    } catch (err) {
      console.error('Failed to resume organization:', err);
    }
  };

  const handleDeleteOrg = async (org: Organization) => {
    try {
      await supabase.from('organizations').delete().eq('id', org.id);

      setOrgs(orgs.filter(o => o.id !== org.id));
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to delete organization:', err);
    }
  };

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
        Organization Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        SUPER ADMIN: Manage all organizations and their Tier 2 (Admin) users
      </Alert>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{xs: 12, sm: 6, md: 3}} >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Total Organizations
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700}>
                {orgs.length}
              </Typography>
              <Typography variant="caption" color="success.main">
                {orgs.filter(o => o.subscription_status === 'active').length} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Organization</TableCell>
              <TableCell>Admin (Tier 2)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgs.map(org => (
              <TableRow key={org.id} hover>
                <TableCell sx={{fontWeight: 600}}>{org.name}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {org.admin?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {org.admin?.email || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={org.subscription_status}
                    size="small"
                    color={
                      org.subscription_status === 'active'
                        ? 'success'
                        : 'warning'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{org.subscription_plan || 'Pro'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setMenuOrg(org);
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {menuOrg?.subscription_status === 'active' && (
          <MenuItem
            onClick={() => {
              setSelectedOrg(menuOrg);
              setDialogMode('pause');
              setOpenDialog(true);
              setAnchorEl(null);
            }}
          >
            <PauseIcon fontSize="small" sx={{ mr: 1 }} />
            Pause Subscription
          </MenuItem>
        )}

        {menuOrg?.subscription_status === 'paused' && (
          <MenuItem
            onClick={() => {
              handleResumeOrg(menuOrg);
              setAnchorEl(null);
            }}
          >
            <ResumeIcon fontSize="small" sx={{ mr: 1 }} />
            Resume Subscription
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setSelectedOrg(menuOrg);
            setDialogMode('delete');
            setOpenDialog(true);
            setAnchorEl(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Organization
        </MenuItem>
      </Menu>

      <Dialog open={openDialog && dialogMode === 'pause'} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Pause Subscription</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Pausing {selectedOrg?.name} will prevent new logins
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedOrg) handlePauseOrg(selectedOrg);
            }}
            color="warning"
            variant="contained"
          >
            Pause
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog && dialogMode === 'delete'} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Organization</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            ⚠️ This will delete the entire organization and ALL associated data
          </Alert>
          <TextField
            fullWidth
            placeholder="Confirm org name"
            id="confirm-org-name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              const input = document.getElementById('confirm-org-name') as HTMLInputElement;
              if (input?.value === selectedOrg?.name) {
                if (selectedOrg) handleDeleteOrg(selectedOrg);
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