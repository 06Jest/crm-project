import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';

import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchActivities,
  addManualActivity,
  clearError as clearActivitiesError,
} from '../../../store/activitiesSlice';
import { fetchContactsLists } from '../../../store/contactsSlice';
import { fetchLeadsLists } from '../../../store/leadsSlice';
import { fetchCustomersLists } from '../../../store/customersSlice';
import ErrorAlert from '../../../components/Error';
import { formatName } from '../../../utils/formatText';
import { formatRelativeTime } from '../../../utils/formatTime';
import {
  ACTIVITY_TYPES,
  ACTIVITY_ACTIONS,
  MANUAL_ACTIVITY_TYPES,
  MANUAL_ACTIVITY_ACTIONS,
} from '../../../types/activity';
import type {
  ActivityType,
  ActivityAction,
  ManualActivityType,
  ManualActivityAction,
  ManualCreateActivity,
} from '../../../types/activity';

const TYPE_COLORS: Record<ActivityType, string> = {
  meeting: '#80abce',
  visit: '#92e695',
  follow_up: '#c5aa80',
  other: '#9e9e9e',
  lead: '#b39ddb',
  contact: '#80cbc4',
  deal: '#ffab91',
  customer: '#90caf9',
  task: '#ce93d8',
  call: '#a5d6a7',
  note: '#fff59d',
  sms: '#f48fb1',
  email: '#81d4fa',
};

const ACTION_COLORS: Record<ActivityAction, string> = {
  created: '#4caf50',
  updated: '#2196f3',
  deleted: '#e53935',
  assigned: '#9c27b0',
  started: '#00acc1',
  completed: '#43a047',
  cancelled: '#c97771',
  sent: '#3f51b5',
};

const formatLabel = (value: string) =>
  value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

interface ActivityRow {
  id: string;
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description: string | null;
  relatedName: string | null;
  createdBy: string;
  createdAt: string;
}

const columns: GridColDef<ActivityRow>[] = [
  {
    field: 'type',
    headerName: 'Type',
    flex: 1,
    minWidth: 110,
    display: 'flex',
    renderCell: ({ value }) => (
      <Chip
        label={formatLabel(value)}
        size="small"
        sx={{ bgcolor: TYPE_COLORS[value as ActivityType], color: '#fff', fontWeight: 600, fontSize: '0.7rem', width: 80 }}
      />
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    minWidth: 110,
    display: 'flex',
    renderCell: ({ value }) => (
      <Chip
        label={formatLabel(value)}
        size="small"
        variant="outlined"
        sx={{
          borderColor: ACTION_COLORS[value as ActivityAction],
          color: ACTION_COLORS[value as ActivityAction],
          fontWeight: 600,
          width: 80,
          fontSize: '0.7rem',
        }}
      />
    ),
  },
  {
    field: 'title',
    headerName: 'Title',
    flex: 1.6,
    minWidth: 160,
    display: 'flex',
    renderCell: ({ row }) => (
      <Box sx={{ py: 0.5, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {row.title}
        </Typography>
        {row.relatedName && (
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            Re: {row.relatedName}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 200,
    display: 'flex',
    renderCell: ({ value }) => (
      <Typography variant="body2" color="text.secondary" noWrap title={value ?? ''}>
        {value || '—'}
      </Typography>
    ),
  },
  {
    field: 'createdBy',
    headerName: 'Created By',
    flex: 1,
    minWidth: 140,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    minWidth: 130,
    valueGetter: (value) => (value ? formatRelativeTime(new Date(value as string)) : ''),
  },
];

const paginationModel = { page: 0, pageSize: 30 };

export default function Activities() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: activities, loading, loaded, error } = useSelector((s: RootState) => s.activities);
  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loaded: lLd } = useSelector((s: RootState) => s.leads);
  const { items: customers, loaded: cuLd } = useSelector((s: RootState) => s.customers);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ActivityType | ''>('');
  const [actionFilter, setActionFilter] = useState<ActivityAction | ''>('');

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [relatedType, setRelatedType] = useState<'none' | 'lead' | 'contact' | 'customer'>('none');
  const [relatedId, setRelatedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    type: ManualActivityType;
    action: ManualActivityAction;
    title: string;
    description: string;
  }>({
    type: 'meeting',
    action: 'created',
    title: '',
    description: '',
  });

  const needsLoading = !loaded || !cLd || !lLd || !cuLd;

  useEffect(() => {
    if (!needsLoading) return;

    const loadData = async () => {
      try {
        const promises = [];
        if (!loaded) promises.push(dispatch(fetchActivities()).unwrap());
        if (!cLd) promises.push(dispatch(fetchContactsLists()).unwrap());
        if (!lLd) promises.push(dispatch(fetchLeadsLists()).unwrap());
        if (!cuLd) promises.push(dispatch(fetchCustomersLists()).unwrap());
        await Promise.all(promises);
      } catch {
        // Error handled by Redux state
      }
    };

    loadData();
  }, [loaded, cLd, lLd, cuLd, needsLoading, dispatch]);

  const contactsMap = useMemo(() => new Map(contacts.map((c) => [c.id, c])), [contacts]);

  const leadOptions = useMemo(
    () => leads.map((l) => ({ id: l.id, label: formatName(l.first_name, l.last_name) })),
    [leads]
  );

  const contactOptions = useMemo(
    () => contacts.map((c) => ({ id: c.id, label: formatName(c.first_name, c.last_name) })),
    [contacts]
  );

  const customerOptions = useMemo(
    () =>
      customers
        .map((customer) => {
          const c = contactsMap.get(customer.contact_id);
          return c ? { id: customer.id, label: formatName(c.first_name, c.last_name) } : null;
        })
        .filter((o): o is { id: string; label: string } => o !== null),
    [customers, contactsMap]
  );

  const relatedOptions =
    relatedType === 'lead'
      ? leadOptions
      : relatedType === 'contact'
      ? contactOptions
      : relatedType === 'customer'
      ? customerOptions
      : [];

  const relatedLoading =
    (relatedType === 'lead' && !lLd) ||
    (relatedType === 'contact' && !cLd) ||
    (relatedType === 'customer' && !cuLd);

  const rows: ActivityRow[] = useMemo(
    () =>
      activities.map((a) => {
        const related = a.lead ?? a.contact ?? a.customer ?? null;
        return {
          id: a.id,
          type: a.type,
          action: a.action,
          title: a.title,
          description: a.description,
          relatedName: related ? formatName(related.first_name, related.last_name) : null,
          createdBy: formatName(a.creator.first_name, a.creator.last_name),
          createdAt: a.created_at,
        };
      }),
    [activities]
  );

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (typeFilter && row.type !== typeFilter) return false;
      if (actionFilter && row.action !== actionFilter) return false;

      if (q) {
        const searchable = [row.title, row.description, row.relatedName, row.createdBy, row.type, row.action]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [rows, search, typeFilter, actionFilter]);

  const resetForm = () => {
    setFormData({ type: 'meeting', action: 'created', title: '', description: '' });
    setRelatedType('none');
    setRelatedId(null);
  };

  const closeDialog = () => {
    dispatch(clearActivitiesError());
    setOpenAddDialog(false);
    resetForm();
  };

  const handleAddActivity = async () => {
    if (!formData.title.trim()) return;

    const payload: ManualCreateActivity = {
      type: formData.type,
      action: formData.action,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
    };

    if (relatedType === 'lead' && relatedId) payload.lead_id = relatedId;
    if (relatedType === 'contact' && relatedId) payload.contact_id = relatedId;
    if (relatedType === 'customer' && relatedId) payload.customer_id = relatedId;

    try {
      await dispatch(addManualActivity(payload)).unwrap();
      setOpenAddDialog(false);
      resetForm();
    } catch {
      // Error handled by Redux state
    }
  };

  if (loading && !loaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, height: 850 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: 750, p: 2, mx: 2, height: 850 }}>
      <Paper
        sx={{
          p: 2,
          pt: 0,
          width: '70vw',
          minWidth: 300,
          maxHeight: 1000,
          display: 'flex',
          flex: 1,
          borderRadius: 3,
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            p: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              Activities
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Log Activity
          </Button>
        </Box>

        {error && (
          <Box sx={{ px: 2, mb: 1 }}>
            <ErrorAlert message={error} />
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, px: 2, pb: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as ActivityType | '')}>
              <MenuItem value="">All Types</MenuItem>
              {ACTIVITY_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {formatLabel(t)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Action</InputLabel>
            <Select
              label="Action"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as ActivityAction | '')}
            >
              <MenuItem value="">All Actions</MenuItem>
              {ACTIVITY_ACTIONS.map((a) => (
                <MenuItem key={a} value={a}>
                  {formatLabel(a)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={() => {
              setSearch('');
              setTypeFilter('');
              setActionFilter('');
            }}
          >
            <ClearAllIcon />
          </IconButton>
        </Box>

        <DataGrid
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: 3,
            fontSize: '0.85rem',
          }}
          rows={visibleRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[30, 50]}
          rowHeight={32}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog
        open={openAddDialog}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: '#fff',
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Log Activity
            </Typography>
          </Box>
          <IconButton size="small" onClick={closeDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && (
              <Box sx={{ width: '100%' }}>
                <ErrorAlert message={error} />
              </Box>
            )}

            <Box sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5, display: 'block', mb: 1 }}>
                Activity
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      label="Type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as ManualActivityType })}
                    >
                      {MANUAL_ACTIVITY_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                          {formatLabel(t)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth>
                    <InputLabel>Action</InputLabel>
                    <Select
                      label="Action"
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value as ManualActivityAction })}
                    >
                      {MANUAL_ACTIVITY_ACTIONS.map((a) => (
                        <MenuItem key={a} value={a}>
                          {formatLabel(a)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  fullWidth
                  size="small"
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Stack>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5, display: 'block', mb: 1 }}>
                Related To
              </Typography>

              <Stack spacing={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Relates To</InputLabel>
                  <Select
                    label="Relates To"
                    value={relatedType}
                    onChange={(e) => {
                      setRelatedType(e.target.value as typeof relatedType);
                      setRelatedId(null);
                    }}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="lead">Lead</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                  </Select>
                </FormControl>

                {relatedType !== 'none' && (
                  <Autocomplete
                    size="small"
                    options={relatedOptions}
                    loading={relatedLoading}
                    getOptionLabel={(option) => option.label}
                    onChange={(_, option) => setRelatedId(option?.id ?? null)}
                    renderInput={(params) => <TextField {...params} label={`Select ${formatLabel(relatedType)}`} />}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2,  }}>
          <Button onClick={closeDialog} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddActivity}
            disabled={loading || !formData.title.trim()}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={15} color="inherit" /> : 'Log Activity'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}