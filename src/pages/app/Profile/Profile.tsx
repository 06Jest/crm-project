import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type {  RootState } from '../../../store/store';
import { useAuthContext } from '../../../hooks/useAuthContext';
import {
  fetchMyProfileFromDB,
  updateProfileInDB,
  updatePasswordInAuth,
  updateNameInAuth,
} from '../../../services/profileService';
import {
  uploadImageToCloudinary,
  validateImageFile,
} from '../../../utils/uploadImage';
import type { Profile } from '../../../types/profile';
import type { Contact } from '../../../types/contact';
import type { Lead } from '../../../types/lead';
import type { Deal } from '../../../types/deal';
import type { Activity } from '../../../types/activity';

import {
  Box, Typography, Paper, Avatar, Button,
  TextField, Divider, Chip, Alert, Grid,
  CircularProgress, IconButton, Card,
  CardContent,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';

export default function Profile () {
  const { user } = useAuthContext();

  const contacts = useSelector((s: RootState) => s.contacts.items);
  const leads = useSelector((s: RootState) => s.leads.items);
  const deals = useSelector((s: RootState) => s.deals.items);
  const activities = useSelector((s: RootState) => s.activities.items);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameForm, setNameForm] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null> (null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchMyProfileFromDB(user.id)
    .then((p) => {
      setProfile(p);
      setNameForm(p?.name || user.user_metadata?.name || '');
    })
    .catch(() => setError('Could not load profile'))
    .finally(() => setLoading(false));
  }, [user]);


  const myContacts = contacts.filter(
    (c) => (c as Contact).created_by === user?.id || 
          (c as Contact).assigned_to === user?.id
  ).length;

  const myLeads = leads.filter(
    (l) => (l as Lead).assigned_to === user?.id
  ).length;

  const myDeals = deals.filter(
    (d) => (d as Deal).owned_by === user?.id
  ).length;

  const myActivities = activities.filter(
    (a) => (a as Activity).logged_by === user?.id
  ).length;


  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '-';

  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if(!file || !user) return;

    const validationError = validateImageFile(file);
    if(validationError) {
      setError(validationError);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      setUploadingAvatar(true);
      setError('');

      const cloudinaryUrl = await uploadImageToCloudinary(file);

      const updated = await updateProfileInDB(user.id, {
        avatar_url: cloudinaryUrl,
      });
      setProfile(updated);
      setAvatarPreview(null);
      setSuccess('Avatar updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to upload avatar.. Please try again.')
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      URL.revokeObjectURL(localPreview);
    }
  };

  const handleSaveName = async () => {
    if (!user || !nameForm.trim()) return;
    setSaving(true);
    setError('');
    try {
      await Promise.all([
        updateProfileInDB(user.id, { name: nameForm.trim() }),
        updateNameInAuth(nameForm.trim()),
      ]);
      setProfile((prev) =>
        prev ? { ...prev, name: nameForm.trim() }: prev
      );
      setIsEditingName(false);
      setSuccess('Name updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update name. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if(!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Please must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Password do not match');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await updatePasswordInAuth(passwordForm.newPassword);
      setIsChangingPassword(false);
      setPasswordForm({ newPassword: '', confirmPassword: ''});
      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to change password, Please try again.');
    } finally {
      setSaving(false)
    }
  };

  const roleBadge = {
    super_admin: { label: 'Super Admin', color: 'error' as const },
    admin: { label: 'Admin', color: 'primary' as const },
    agent: { label: 'Agent', color: 'default' as const },
  }[profile?.role || 'agent'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User';

  const avatarSrc = avatarPreview || profile?.avatar_url || undefined;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={avatarSrc}
              sx={{ width: 96, height: 96, fontSize: 36, bgcolor: 'primary.main' }}
            >
              {displayName[0]?.toUpperCase()}
            </Avatar>

            <IconButton
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                width: 32,
                height: 32,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {uploadingAvatar
                ? <CircularProgress size={14} />
                : <CameraAltIcon sx={{ fontSize: 16 }} />
              }
            </IconButton>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            {!isEditingName ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h5" fontWeight={700}>
                  {displayName}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setNameForm(displayName);
                    setIsEditingName(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  value={nameForm}
                  onChange={(e) => setNameForm(e.target.value)}
                  size="small"
                  label="Display name"
                  sx={{ maxWidth: 260 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                  autoFocus
                />
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleSaveName}
                  disabled={saving}
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsEditingName(false)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Chip
              label={roleBadge.label}
              color={roleBadge.color}
              size="small"
              sx={{ mb: 1.5 }}
            />

            {profile?.employee_id && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Employee ID:{' '}
                  <Typography component="span" variant="body2" fontWeight={700}>
                    {profile.employee_id}
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email address
              </Typography>
              <Typography>{user?.email}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Member since
              </Typography>
              <Typography>{memberSince}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          My activity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Records you have created or been assigned to.
          Full attribution data available after Milestone 4.
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'Contacts', value: myContacts, color: 'primary.main' },
            { label: 'Leads', value: myLeads, color: 'secondary.main' },
            { label: 'Deals', value: myDeals, color: 'success.main' },
            { label: 'Activities', value: myActivities, color: 'warning.main' },
          ].map((stat) => (
            <Grid sx={{ xs: 6,  sm: 3 }}  key={stat.label}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, textAlign: 'center', p: 1 }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="h4" fontWeight={800} color={stat.color}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: isChangingPassword ? 2 : 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LockIcon color="action" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Change your account password
              </Typography>
            </Box>
          </Box>
          {!isChangingPassword && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsChangingPassword(true)}
            >
              Change password
            </Button>
          )}
        </Box>

        {isChangingPassword && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              fullWidth
              helperText="Minimum 6 characters"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              fullWidth
              autoComplete="new-password"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save password'}
              </Button>
              <Button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordForm({ newPassword: '', confirmPassword: '' });
                  setError('');
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}