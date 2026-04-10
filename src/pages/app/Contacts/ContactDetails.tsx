import { useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { updateContact, deleteContact } from '../../../store/contactsSlice';
import type { Contact } from '../../../types/contact';

import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { RootState } from '../../../store/store';

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'info'> = {
  Active: 'success',
  Prospect: 'warning',
  Lead: 'info'
};

export default function ContactDetail() {

const { id } = useParams<{id: string }>();
const navigate = useNavigate();
const dispatch = useDispatch<AppDispatch>();

const contact = useSelector((state: RootState) => 
  state.contacts.items.find((c) => c.id === id) 
);

const [isEditing, setIsEditing] = useState(false);
const [form, setForm] = useState<Partial<Contact>>({});
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

if (!contact) {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Contact not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/contacts')}
          sx={{ mt: 2 }}
        >
          Back to contacts
        </Button>
    </Box>
  );
}

const handleEditStart = () => {
  setForm({
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
    status: contact.status
  });
  setIsEditing(true);
};

const handleEditCancel = () => {
  setIsEditing(false);
  setForm({});
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSave = () => {
  dispatch(updateContact({ ...contact, ...form}));
  setIsEditing(false);
  setSuccessMessage('Contact updated successfully');
  setTimeout(() => setSuccessMessage(''), 3000);
 };

 const handleDeleteConfirm = () => {
  dispatch(deleteContact(contact.id));
  navigate('/app/contacts');
 };

 const formattedDate = contact.created_at ? new Date(contact.created_at).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
 })
 :'Unknown';

 return (
  <Box sx={{ maxWidth: 800, mx: 'auto'}}>
    <Button 
      startIcon={<ArrowBackIcon/>}
      onClick={() => navigate('/app/contacts')}
      sx={{ mb: 3}}>
        Back to contacts
    </Button>

    {successMessage && (
      <Alert severity='success' sx={{ mb: 2}}>
        {successMessage}
      </Alert>
    )}

    <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant='h4' fontWeight={700}>
            {contact.name}
          </Typography>
          <Chip
            label={contact.status}
            color={STATUS_COLORS[contact.status] || 'default'}
            size='small'
            sx={{ mt: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isEditing && (
            <>
              <Button 
                variant='outlined'
                startIcon={<EditIcon/>}
                onClick={handleEditStart}
                >
                  Edit
              </Button>
              <Button
                variant='outlined'
                color='error'
                startIcon={<DeleteIcon/>}
                onClick={()=> setDeleteDialogOpen(true)}
                >
                  Delete
              </Button>
            </>
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 3}}/>
      {!isEditing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full name
                </Typography>
                <Typography>{contact.name}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email address
                </Typography>
                <Typography>{contact.email}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Phone number
                </Typography>
                <Typography>{contact.phone || '—'}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarTodayIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Added on
                </Typography>
                <Typography>{formattedDate}</Typography>
              </Box>
            </Box>

          </Box>
        )}

        {isEditing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Status"
              name="status"
              value={form.status || 'active'}
              onChange={handleChange}
              select
              fullWidth
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="Prospect">Prospect</MenuItem>
              <MenuItem value="Lead">Lead</MenuItem>
            </TextField>

            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Button variant="contained" onClick={handleSave}>
                Save changes
              </Button>
              <Button onClick={handleEditCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
    </Paper>
    <Dialog
      open={deleteDialogOpen}
      onClose={() => setDeleteDialogOpen(false)}
    >
      <DialogTitle>Delete contact?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{contact.name}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>
          Cancel
        </Button>
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
 )};