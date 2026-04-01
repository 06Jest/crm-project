import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";


import {
  fetchLeads,
  addLead,
  updateLead,
  deleteLead,
  moveLeadLocally,
} from '../../../store/leadsSlice';
import type {Lead} from '../../../types/lead';

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const COLUMNS: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Closed'];

const COLUMN_COLORS: Record<Lead['status'], string> ={
  New: '#1976d2',
  Contacted: '#ed6c02',
  Qualified: '#9c27b0',
  Closed: '#2e7d32',
};

type FormState = {
  title: string;
  name: string;
  email: string;
  phone: string;
  status: Lead['status'];
  notes: string;
};

const emptyForm: FormState = {
  title: '',
  name: '',
  email: '',
  phone: '',
  status: 'New',
  notes: '',
};

export default function Leads() {
  const {items: leads, loading, error } = useSelector((state: RootState) => state.leads);
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    dispatch(fetchLeads());
  },[dispatch]);

  const handleOpen = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setForm({
        title: lead.title,
        name: lead.name,
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status,
        notes: lead.notes || '',
      });
    } else {
      setEditingLead(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = () => {
    if (editingLead) {
      dispatch(updateLead({...editingLead, ...form}));
    } else {
      dispatch(addLead(form));
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteLead(id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as Lead['status'];
    const oldStatus = result.source.droppableId as Lead['status'];

    if (newStatus === oldStatus) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    dispatch(moveLeadLocally({id: leadId, newStatus}));

    dispatch(updateLead({...lead, status:newStatus}));
  };

  const getLeadsByStatus = (status: Lead['status']) => 
    leads.filter((l) => l.status === status);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
        <Typography variant="h5" fontWeight={700}>
          Leads
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add lead
        </Button>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {COLUMNS.map((column) =>(
            <Box
              key={column}
              sx={{ minWidth: 260, flex: 1 }}
            >
              <Box
                sx={{
                    bgcolor: COLUMN_COLORS[column],
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                > <Typography fontWeight={600}>{column}</Typography>
                  <Chip
                    label={getLeadsByStatus(column).length}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}/>
              </Box>
              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: 400,
                      bgcolor: snapshot.isDraggingOver
                        ? 'action.hover'
                        : 'background.paper',
                      border: 1,
                      borderTop: 0,
                      borderColor: 'divider',
                      borderRadius: '0 0 8px 8px',
                      p: 1,
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {getLeadsByStatus(column).map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 1,
                              boxShadow: snapshot.isDragging ? 6 : 1,
                              cursor: 'grab',
                              opacity: snapshot.isDragging ? 0.85 : 1,
                              transition: 'box-shadow 0.2s ease',
                            }}
                          >
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                              <Typography fontWeight={600} variant="body2">
                                {lead.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {lead.name}
                              </Typography>
                              {lead.notes && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  sx={{
                                    mt: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {lead.notes}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpen(lead)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(lead.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingLead ? 'Edit lead' : 'Add lead'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Website Redesign Project"
          />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            select
            fullWidth
          >
            {COLUMNS.map((col) => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingLead ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
