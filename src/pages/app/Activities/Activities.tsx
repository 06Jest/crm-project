import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  toggleActivityComplete,
} from '../../../store/activitiesSlice';

import { useAI } from '../../../hooks/useAI';
import { aiApi } from '../../../services/backendApi';

import { fetchContacts } from "../../../store/contactsSlice";
import type { Activity, ActivityType } from "../../../types/activity";
import { useAuthContext } from "../../../hooks/useAuthContext";

import {
  Box, Typography, Button, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Alert, CircularProgress,
  Chip, IconButton, Avatar, List, ListItem,
  Checkbox, Tooltip, Select, FormControl,
  InputLabel, OutlinedInput,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import NoteIcon from '@mui/icons-material/Note';
import SmsIcon from '@mui/icons-material/Sms';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ACTIVITY_TYPES: {
  value: ActivityType;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  { value: 'call', label: 'Call',  color: '#1976d2', icon: <PhoneIcon fontSize="small" /> },
  { value: 'email', label: 'Email', color: '#9c27b0', icon: <EmailIcon fontSize="small" /> },
  { value: 'meeting', label: 'Meeting', color: '#ed6c02', icon: <EventIcon fontSize="small" /> },
  { value: 'note', label: 'Note', color: '#2e7d32', icon: <NoteIcon fontSize="small" /> },
  { value: 'sms', label: 'SMS', color: '#0288d1', icon: <SmsIcon fontSize="small" /> },
];

const getTypeConfig = (type: ActivityType) => 
  ACTIVITY_TYPES.find((t) => t.value === type) ?? ACTIVITY_TYPES[0];


const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type FormState = {
  type: ActivityType;
  subject: string;
  body: string;
  contact_name: string;
  direction: 'inbound' | 'outbound';
  duration: string;
  scheduled_at: string;
};

const emptyForm: FormState = {
  type: 'call',
  subject: '',
  body: '',
  contact_name: '',
  direction: 'outbound',
  duration: '',
  scheduled_at: '',
};

export default function Activities() {
  const { items: activities, loading, error} = useSelector(
    (state: RootState) => state.activities
  );

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const[form, setForm] = useState<FormState>(emptyForm);
  const [filterType, setFilterType] = useState<ActivityType | 'all'> ('all');
  const [filterContact, setFilterContact] = useState<string>('all');

   const {
    result: aiDraft,
    loading: aiLoading,
    error: aiError,
    generate: generateDraft,
    clear: clearDraft,
  } = useAI(aiApi.composeMessage);

  const handleGenerateDraft = () => {
    if (!form.contact_name || !form.subject) return;
    generateDraft({
      type: form.type === 'email' || form.type === 'sms' ? form.type : 'email',
      contactName: form.contact_name,
      subject: form.subject,
      tone: 'followup',
    });
  };

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchContacts());
  }, [dispatch]);

   useEffect(() => {
    if (!aiDraft) return;

    const timer = window.setTimeout(() => {
      setForm((prev) => ({ ...prev, body: aiDraft }));
      clearDraft();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [aiDraft, clearDraft]);

  const filteredActivities = activities.filter((a) => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesContact = 
      filterContact === 'all' || a.contact_name === filterContact;

    return matchesType && matchesContact;
  });

  const contactNames = [
    ...new Set(activities.map((a) => a.contact_name).filter(Boolean)),
  ] as string[];

  const handleOpen = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setForm({
        type: activity.type,
        subject: activity.subject,
        body: activity.body || '', 
        contact_name: activity.contact_name || '',
        direction: activity.direction || 'outbound',
        duration: activity.duration?.toString() || '',
        scheduled_at: activity.scheduled_at?.slice(0, 16) || '',
      });
    } else {
      setEditingActivity(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = () => {
    const activityData = {
      type: form.type,
      subject: form.subject,
      body: form.body,
      contact_name: form.contact_name,
      direction: form.direction,
      duration: form.duration  ? parseInt(form.duration) : undefined,
      scheduled_at: form.scheduled_at
        ? new Date(form.scheduled_at).toISOString()
        : undefined,
        completed: false,
        user_id: user?.id || '',
    };

    if (editingActivity) {
      dispatch(updateActivity({ ...editingActivity, ...activityData}));
    } else {
      dispatch(addActivity(activityData as Activity));
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteActivity(id));
  };

  const handleToggleComplete = (activity: Activity) => {
    dispatch(toggleActivityComplete({
      id: activity.id,
      completed: !activity.completed,
    }));
  };

 

 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Typography variant="h5" fontWeight={700}>
          Activities
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Log activity
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {ACTIVITY_TYPES.map((type) => {
          const count = activities.filter((a) => a.type === type.value).length;
          return (
            <Chip
              key={type.value}
              icon={<>{type.icon}</>}
              label={`${type.label}: ${count}`}
              onClick={() =>
                setFilterType(filterType === type.value ? 'all' : type.value)
              }
              variant={filterType === type.value ? 'filled' : 'outlined'}
              sx={{
                cursor: 'pointer',
                borderColor: type.color,
                color: filterType === type.value ? 'white' : type.color,
                bgcolor: filterType === type.value ? type.color : 'transparent',
              }}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter by type</InputLabel>
          <Select
            value={filterType}
             MenuProps={{
              disableScrollLock: true,
            }}
            onChange={(e) =>
              setFilterType(e.target.value as ActivityType | 'all')
            }
            input={<OutlinedInput label="Filter by type" />}
          >
            <MenuItem value="all">All types</MenuItem>
            {ACTIVITY_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by contact</InputLabel>
          <Select
            value={filterContact}
            MenuProps={{
              disableScrollLock: true,
            }}
            onChange={(e) => setFilterContact(e.target.value)}
            input={<OutlinedInput label="Filter by contact" />}
          >
            <MenuItem value="all">All contacts</MenuItem>
            {contactNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(filterType !== 'all' || filterContact !== 'all') && (
          <Button
            size="small"
            onClick={() => {
              setFilterType('all');
              setFilterContact('all');
            }}
          >
            Clear filters
          </Button>
        )}
      </Box>

      {filteredActivities.length === 0 ? (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">
              No activities yet. Log your first one!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredActivities.map((activity) => {
            const typeConfig = getTypeConfig(activity.type);
            return (
              <ListItem key={activity.id} disablePadding>
                <Card
                  elevation={0}
                  sx={{
                    width: '100%',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 3,
                    borderLeft: `4px solid ${typeConfig.color}`,
                    opacity: activity.completed ? 0.65 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>

                      <Tooltip title={activity.completed
                        ? 'Mark as incomplete'
                        : 'Mark as complete'
                      }>
                        <Checkbox
                          checked={activity.completed || false}
                          onChange={() => handleToggleComplete(activity)}
                          sx={{ p: 0, mt: 0.5 }}
                        />
                      </Tooltip>
                      <Avatar
                        sx={{
                          bgcolor: typeConfig.color,
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                        }}
                      >
                        {typeConfig.icon}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              sx={{
                                textDecoration: activity.completed
                                  ? 'line-through'
                                  : 'none',
                              }}
                            >
                              {activity.subject}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <Chip
                                label={typeConfig.label}
                                size="small"
                                sx={{
                                  bgcolor: typeConfig.color,
                                  color: 'white',
                                  height: 20,
                                  fontSize: 11,
                                }}
                              />
                              {activity.contact_name && (
                                <Chip
                                  label={activity.contact_name}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: 11 }}
                                />
                              )}
                              {activity.direction && (
                                <Chip
                                  label={activity.direction}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: 11 }}
                                />
                              )}
                              {activity.duration && (
                                <Chip
                                  label={`${activity.duration} min`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: 11 }}
                                />
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpen(activity)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(activity.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        {activity.body && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, lineHeight: 1.6 }}
                          >
                            {activity.body}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Logged: {formatDate(activity.created_at)}
                          </Typography>
                          {activity.scheduled_at && (
                            <Typography variant="caption" color="text.secondary">
                              Scheduled: {formatDate(activity.scheduled_at)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            );
          })}
        </List>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingActivity ? 'Edit activity' : 'Log activity'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>

          <TextField
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            select
            fullWidth
          >
            {ACTIVITY_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: t.color }}>{t.icon}</Box>
                  {t.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          {(form.type === 'email' || form.type === 'sms') &&
            form.contact_name &&
            form.subject && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    aiLoading
                      ? <CircularProgress size={14} />
                      : <AutoAwesomeIcon />
                  }
                  onClick={handleGenerateDraft}
                  disabled={aiLoading}
                  sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
                >
                  {aiLoading ? 'Writing draft...' : '✨ AI draft'}
                </Button>
                {aiError && (
                  <Typography variant="caption" color="error">{aiError}</Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Fill in contact + subject first
                </Typography>
              </Box>
          )}
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Follow-up call with client"
          />

          <TextField
            label="Contact name"
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            fullWidth
            placeholder="Who was this with?"
          />

          <TextField
            label="Direction"
            name="direction"
            value={form.direction}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="outbound">Outbound (you initiated)</MenuItem>
            <MenuItem value="inbound">Inbound (they initiated)</MenuItem>
          </TextField>

          {form.type === 'call' && (
            <TextField
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={form.duration}
              onChange={handleChange}
              fullWidth
              placeholder="e.g. 15"
            />
          )}

          <TextField
            label="Scheduled date & time"
            name="scheduled_at"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Notes / body"
            name="body"
            value={form.body}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="What was discussed? Any action items?"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.subject}
          >
            {editingActivity ? 'Update' : 'Log activity'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
