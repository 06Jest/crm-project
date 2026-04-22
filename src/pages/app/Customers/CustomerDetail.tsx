import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { updateCustomer, deleteCustomer } from '../../../store/customersSlice';
import type { Customer } from '../../../types/customer';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fixLeafletIcons } from '../../../utils/fixLeafletIcons';
fixLeafletIcons();

import {
  Box, Typography, Button, Paper, Grid,
  Chip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  MenuItem, Alert, Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Retail',
  'Manufacturing', 'Education', 'Real Estate',
  'Hospitality', 'Transportation', 'Other',
];

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const customer = useSelector((state: RootState) => 
    state.customers.items.find((c) => c.id === id)
  );

  const linkedContacts = useSelector((state: RootState) => 
    state.contacts.items.filter((c) => c.id === id)
  );

  const linkedActivities = useSelector((state: RootState) => 
    state.activities.items.filter((a) => 
      linkedContacts.some((c) => c.id === a.contact_id)
    )
  );

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  if (!customer) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Customer not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/customers')}
          sx={{ mt: 2 }}
        >
          Back to customers
        </Button>
      </Box>
    );
  }

  const hasMapLocation = 
    customer.latitude !== null &&
    customer.latitude !== undefined &&
    customer.longitude !== null &&
    customer.longitude !== undefined;

  
  const handleEditStart = () => {
    setForm({ ...customer});
    setIsEditing(true);
  };

  const handleSave = () => {
    dispatch(updateCustomer({ ...customer, ...form}));
    setIsEditing(false);
    setSuccessMessage('Customer updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCustomer(customer.id));
    navigate('/app/customers');
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/app/customers')}
        sx={{ mb: 3 }}
      >
        Back to customers
      </Button>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
      )}

      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 24 }}>
              {customer.name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {customer.name}
              </Typography>
              <Chip
                label={customer.status}
                color={
                  customer.status === 'Active' ? 'success'
                  : customer.status === 'Inactive' ? 'error'
                  : 'warning'
                }
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          {!isEditing && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditStart}>
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {!isEditing && (
          <Grid container spacing={3}>
            <Grid sx={{ xs:12, md:6 }} >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customer.industry && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Industry</Typography>
                      <Typography>{customer.industry}</Typography>
                    </Box>
                  </Box>
                )}
                {customer.email && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <EmailIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography>{customer.email}</Typography>
                    </Box>
                  </Box>
                )}
                {customer.phone && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <PhoneIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography>{customer.phone}</Typography>
                    </Box>
                  </Box>
                )}
                {customer.website && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <LanguageIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Website</Typography>
                      <Typography
                        component="a"
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        sx={{ textDecoration: 'none' }}
                      >
                        {customer.website}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {(customer.city || customer.country) && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Location</Typography>
                      <Typography>
                        {[customer.address, customer.city, customer.country]
                          .filter(Boolean)
                          .join(', ')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid sx={{ xs:12, md:6 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Paper
                  elevation={0}
                  sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, flex: 1 }}
                >
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {linkedContacts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Contacts</Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, flex: 1 }}
                >
                  <Typography variant="h4" fontWeight={800} color="secondary.main">
                    {linkedActivities.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Activities</Typography>
                </Paper>
              </Box>
              {customer.notes && (
                <Paper
                  elevation={0}
                  sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, mt: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">Notes</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{customer.notes}</Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}

        {isEditing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Company name" name="name" value={form.name || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Industry" name="industry" value={form.industry || ''} onChange={handleChange} select fullWidth>
                  {INDUSTRIES.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Phone" name="phone" value={form.phone || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12 }}>
                <TextField label="Website" name="website" value={form.website || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Address" name="address" value={form.address || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="City" name="city" value={form.city || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Country" name="country" value={form.country || ''} onChange={handleChange} fullWidth />
              </Grid>
              <Grid sx={{ xs:12, md:6 }}>
                <TextField label="Notes" name="notes" value={form.notes || ''} onChange={handleChange} fullWidth multiline rows={3} />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSave}>Save changes</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </Box>
          </Box>
        )}
      </Paper>

      {hasMapLocation && (
        <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700}>Location</Typography>
          </Box>
          <Box sx={{ height: 350 }}>
            <MapContainer
              center={[customer.latitude!, customer.longitude!]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[customer.latitude!, customer.longitude!]}>
                <Popup>
                  <strong>{customer.name}</strong>
                  <br />
                  {[customer.address, customer.city, customer.country]
                    .filter(Boolean)
                    .join(', ')}
                </Popup>
              </Marker>
            </MapContainer>
          </Box>
        </Paper>
      )}

      {!hasMapLocation && (
        <Paper elevation={0} sx={{
          border: 1, borderColor: 'divider', borderRadius: 3,
          p: 3, mb: 3, textAlign: 'center',
        }}>
          <LocationOnIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary" variant="body2">
            No location set. Add an address to show a map.
          </Typography>
        </Paper>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete customer?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{customer.name}</strong>?
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}