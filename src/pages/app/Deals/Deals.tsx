import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchDeals,
  addDeal,
  updateDeal,
  deleteDeal,
} from '../../../store/dealsSlice';
import type { Deal, DealStage } from '../../../types/deal';
import { useAuthContext } from '../../../hooks/useAuthContext';

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
} from '@mui/material';

import { useAI } from '../../../hooks/useAI';
import { aiApi } from '../../../services/backendApi';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const STAGES: DealStage[] = [
  'Prospecting',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

const STAGE_COLORS: Record<DealStage, string> = {
  Prospecting: '#1976d2',
  Proposal: '#ed6c02',
  Negotiation: '#9c27b0',
  'Closed Won': '#2e7d32',
  'Closed Lost': '#d32f2f',
};

const STAGE_CHIP_COLOR: Record<DealStage,
'default' | 'primary' | 'warning' | 'secondary' | 'success' | 'error'
> = {
  Prospecting: 'primary',
  Proposal: 'warning',
  Negotiation: 'secondary',
  'Closed Won': 'success',
  'Closed Lost': 'error'
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

type FormState = {
  title: string;
  value: string;
  stage: DealStage;
  contact_name: string;
  notes: string;
  close_date: string;
};

const emptyForm: FormState = {
  title:  '',
  value: '',
  stage: 'Prospecting',
  contact_name: '',
  notes: '',
  close_date: '',
};

function DealCardWithAI({
  deal,
  onEdit,
  onDelete,
  onMarkWon,
  onMarkLost
}: {
  deal: Deal;
  onEdit: (d: Deal) => void;
  onDelete: (d: Deal) => void;
  onMarkWon: (d: Deal) => void;
  onMarkLost: (d: Deal) => void;
}) {
  const [showPrediction, setShowPrediction] = useState(false);
  const { result, loading, error, generate} = useAI(aiApi.getDealPrediction);

  const handlePredict = () => {
    setShowPrediction(true);
    generate({
      dealTitle: deal.title,
      dealValue: deal.value,
      dealStage: deal.stage,
      daysOpen: deal.created_at
        ? Math.floor(
            (Date.now() - new Date(deal.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
          )
        : 0,
      activityCount : 0,
      contactName: deal.contact_name,
    });
  };

  const isOpen = deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost';

  return (
    <Card
      elevation={0}
      sx={{
        border: 1, borderColor: 'divider', borderRadius: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          {deal.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <AttachMoneyIcon sx={{ fontSize: 14, color: 'success.main' }} />
          <Typography variant="body2" color="success.main" fontWeight={600}>
            {formatCurrency(deal.value)}
          </Typography>
        </Box>
        {deal.contact_name && (
          <Typography variant="caption" color="text.secondary" display="block">
            👤 {deal.contact_name}
          </Typography>
        )}
        {deal.close_date && (
          <Typography variant="caption" color="text.secondary" display="block">
            📅 {new Date(deal.close_date).toLocaleDateString()}
          </Typography>
        )}

        {/* AI prediction section */}
        {showPrediction && (
          <Box sx={{ mt: 1 }}>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CircularProgress size={12} color="secondary" />
                <Typography variant="caption" color="text.secondary">
                  Predicting...
                </Typography>
              </Box>
            )}
            {result && !loading && (
              <Typography
                variant="caption"
                color="secondary.main"
                display="block"
                sx={{ mt: 0.5, lineHeight: 1.5 }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 11, mr: 0.25 }} />
                {result}
              </Typography>
            )}
            {error && !loading && (
              <Typography variant="caption" color="error.main">
                {error}
              </Typography>
            )}
          </Box>
        )}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isOpen && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                size="small" color="success" variant="outlined"
                sx={{ fontSize: 10, py: 0.25, minWidth: 'auto', px: 1 }}
                onClick={() => onMarkWon(deal)}
              >
                Won
              </Button>
              <Button
                size="small" color="error" variant="outlined"
                sx={{ fontSize: 10, py: 0.25, minWidth: 'auto', px: 1 }}
                onClick={() => onMarkLost(deal)}
              >
                Lost
              </Button>
              {/* AI predict button */}
              {!showPrediction && (
                <Button
                  size="small"
                  sx={{ fontSize: 10, py: 0.25, minWidth: 'auto', px: 0.75, color: 'secondary.main' }}
                  onClick={handlePredict}
                  startIcon={<AutoAwesomeIcon sx={{ fontSize: 10 }} />}
                >
                  Predict
                </Button>
              )}
            </Box>
          )}
          {deal.stage === 'Closed Won' && (
            <EmojiEventsIcon sx={{ color: '#ffd700', fontSize: 18 }} />
          )}
          {(deal.stage === 'Closed Lost' || !isOpen) && <Box sx={{ flex: 1 }} />}
          <Box>
            <IconButton size="small" onClick={() => onEdit(deal)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(deal)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Deals() {
  const { items: deals, loading, error } = useSelector(
    (state: RootState) => state.deals);
  const dispatch = useDispatch<AppDispatch>();;
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);



  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const wonValue = deals  
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const winRate = deals.length > 0
    ? Math.round(
        (deals.filter((d) => d.stage === 'Closed Won').length / deals.length) * 100
    ) : 0;

  const handleOpen = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setForm({
        title: deal.title,
        value: deal.value.toString(),
        stage: deal.stage,
        contact_name: deal.contact_name || '',
        notes: deal.notes || '',
        close_date: deal.close_date || '',
      });
    } else {
      setEditingDeal(null);
      setForm(emptyForm);
    }
    setOpen(true)
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = () => {
    const dealData = {
      title: form.title,
      value: parseFloat(form.value) || 0,
      stage: form.stage, 
      contact_name: form.contact_name,
      notes: form.notes,
      close_date: form.close_date || undefined,
      user_id: user?.id || '',
      owned_by: user?.id || '',
    };

    if (editingDeal) {
      dispatch(updateDeal({ ...editingDeal, ...dealData}));
    } else {
      dispatch(addDeal(dealData))
    }
    handleClose();
  };


  const handleDeleteClick = (deal: Deal) => {
    setDealToDelete(deal);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (dealToDelete) dispatch(deleteDeal(dealToDelete.id));
    setDeleteDialogOpen(false);
    setDealToDelete(null);
  };

  const handleMarkWon = (deal: Deal) => {
    dispatch(updateDeal({
      ...deal,
      stage: 'Closed Won',
      won: true,
    }));
  };


  const handleMarkLost = (deal: Deal) => {
    dispatch(updateDeal({
      ...deal,
      stage: 'Closed Lost',
      won: false,
    }));
  };


  const getDealsByStage = ( stage: DealStage ) => 
    deals.filter((d) => d.stage === stage);

  const getStageValue = (stage: DealStage) => 
    getDealsByStage(stage).reduce((sum, d) => sum + d.value, 0);


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
      }}>
        <Typography variant="h5" fontWeight={700}>
          Deals
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add deal
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid sx={{xs:12, sm: 4}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total pipeline
              </Typography>
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {formatCurrency(totalPipelineValue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {deals.filter(d => d.stage !== 'Closed Lost').length} open deals
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{xs:12, sm: 4}}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Won revenue
              </Typography>
              <Typography variant="h4" fontWeight={800} color="success.main">
                {formatCurrency(wonValue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {deals.filter(d => d.stage === 'Closed Won').length} deals won
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{xs:12, sm: 4}} >
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Win rate
              </Typography>
              <Typography variant="h4" fontWeight={800} color="secondary.main">
                {winRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={winRate}
                sx={{ mt: 1, borderRadius: 2, height: 6 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {STAGES.map((stage) => {
          const stageDeals = getDealsByStage(stage);
          const stageValue = getStageValue(stage);

          return (
            <Box key={stage} sx={{ minWidth: 240, flex: 1 }}>

              <Box
                sx={{
                  bgcolor: STAGE_COLORS[stage],
                  color: 'white',
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography fontWeight={700} variant="body2">
                    {stage}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    {formatCurrency(stageValue)}
                  </Typography>
                </Box>
                <Chip
                  label={stageDeals.length}
                  size="small"
                  sx={{ bgcolor: STAGE_CHIP_COLOR, color: 'white' }}
                />
              </Box>

              <Box
                sx={{
                  minHeight: 300,
                  border: 1,
                  borderTop: 0,
                  borderColor: 'divider',
                  borderRadius: '0 0 8px 8px',
                  bgcolor: 'background.paper',
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {stageDeals.length === 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mt: 4, display: 'block' }}
                  >
                    No deals here
                  </Typography>
                )}

                {stageDeals.map((deal) => (
                  <DealCardWithAI
                    key={deal.id}
                    deal={deal}
                    onEdit={handleOpen}
                    onDelete={handleDeleteClick}
                    onMarkWon={handleMarkWon}
                    onMarkLost={handleMarkLost}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingDeal ? 'Edit deal' : 'Add deal'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Deal title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Annual Software License"
          />
          <TextField
            label="Value (Php)"
            name="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            fullWidth
            placeholder="0"
            inputProps={{min:0}}
            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>Php</Typography> }}
          />
          <TextField
            label="Stage"
            name="stage"
            value={form.stage}
            onChange={handleChange}
            select
            fullWidth
          >
            {STAGES.map((stage) => (
              <MenuItem key={stage} value={stage}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: STAGE_COLORS[stage],
                    }}
                  />
                  {stage}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Contact name"
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            fullWidth
            placeholder="Who is this deal with?"
          />
          <TextField
            label="Expected close date"
            name="close_date"
            type="date"
            value={form.close_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Any additional details..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title}
          >
            {editingDeal ? 'Update' : 'Add deal'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete deal?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{dealToDelete?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}