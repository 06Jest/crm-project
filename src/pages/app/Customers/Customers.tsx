import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchCustomers,
  addCustomer,
  deleteCustomer,
} from '../../../store/customersSlice';
import type { Customer, CustomerStatus } from '../../../types/customer';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { geocodeAddress } from '../../../services/customerService';

import {
  Box, Typography, Button, Card, CardContent,
  Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Alert,
  CircularProgress, Chip, IconButton, Avatar,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Retail',
  'Manufacturing', 'Education', 'Real Estate',
  'Hospitality', 'Transportation', 'Other',
];

const STATUS_COLORS: Record<CustomerStatus,
'success' | 'error' | 'warning'
> = {
  Active: 'success',
  Inactive: 'error',
  Prospect: 'warning',
};

type FormState = {
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  status: CustomerStatus;
};

const emptyForm: FormState = {
  name: '',
  industry: '',
  website: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  notes: '',
  status: 'Active',
};

export default function Customers() {
  const { items: customers, loading, error  } = useSelector(
    (state: RootState) => state.customers
  );

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null> (null);

  useEffect(() => {
    dispatch(fetchCustomers());
  },[dispatch]);

  const filteredCustomers = customers.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) || 
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });;
  };

  const handleSubmit = async () => {
    setGeocoding(true);

    let latitude: number | undefined;
    let longitude: number | undefined;

    const fullAddress = [form.address, form.city, form.country]
    .filter(Boolean)
    .join(', ');

    if (fullAddress) {
      const coords = await geocodeAddress(fullAddress);

      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    setGeocoding(false);

    dispatch(addCustomer({
      ...form,
      latitude,
      longitude,
      user_id: user?.id || '',
    }));

    setOpen(false);
    setForm(emptyForm);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) dispatch(deleteCustomer(customerToDelete.id));
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
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
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add customer
        </Button>
      </Box>

      <TextField
        placeholder="Search by name, industry, or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {filteredCustomers.length === 0 ? (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">
              {search ? 'No customers match your search' : 'No customers yet. Add your first one!'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredCustomers.map((customer) => (
            <Grid sx={{ xs: 12, sm: 6, md: 4 }}  key={customer.id}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 3,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/app/customers/${customer.id}`)}
              >
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {customer.name[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={700} lineHeight={1.2}>
                          {customer.name}
                        </Typography>
                        {customer.industry && (
                          <Typography variant="caption" color="text.secondary">
                            {customer.industry}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(customer);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Chip
                    label={customer.status}
                    color={STATUS_COLORS[customer.status]}
                    size="small"
                    sx={{ mb: 1.5 }}
                  />

                  {(customer.city || customer.country) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {[customer.city, customer.country].filter(Boolean).join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {customer.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LanguageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ textDecoration: 'none' }}
                        component="a"
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {customer.website.replace(/^https?:\/\//, '')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add customer</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Company name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            select
            fullWidth
          >
            {INDUSTRIES.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="prospect">Prospect</MenuItem>
          </TextField>
          <TextField
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            fullWidth
            placeholder="https://example.com"
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
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            placeholder="Street address"
            helperText="Used for map location — be as specific as possible"
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              fullWidth
            />
          </Box>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.name || geocoding}
          >
            {geocoding ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Geocoding...
              </Box>
            ) : 'Add customer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete customer?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{customerToDelete?.name}</strong>?
            This cannot be undone.
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