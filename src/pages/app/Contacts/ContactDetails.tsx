import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { updateContact, deleteContact } from '../../../store/contactsSlice';
import type {Contact, ContactStatus, Gender, Priority } from "../../../types/contact";
// import { useAI } from '../../../hooks/useAI';
// import AIInsightCard from '../../../components/AIInsightCard';
// import { aiApi } from '../../../services/backendApi';
import 'leaflet/dist/leaflet.css';


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
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import type { RootState } from '../../../store/store';
import { fixLeafletIcons } from '../../../utils/fixLeafletIcons';

fixLeafletIcons(); 

const STATUS_OPTIONS: ContactStatus[] = [
  "Contacted",
  "Qualified",
  "Opportunity",
  "Customer",
  "Inactive",
  "Lost",
  "Churned",
];

const GENDER: Gender[] = [
  "Male",
  "Female",
  "Prefer not to say",
];
const PRIORITY: Priority[] = [
  "Highest",
  "High",
  "Low",
];

const STATUS_COLORS: Record<ContactStatus, string> = {
  Contacted: '#ffffff',
  Qualified: '#facd91',
  Opportunity: '#AD7450',
  Customer: '#ffbb29',  
  Inactive: '#e65454',
  Lost: '#7a0000',
  Churned: '#000000',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

// const now = Date.now();

export default function ContactDetail() {
const { id } = useParams<{id: string }>();
const navigate = useNavigate();
const dispatch = useDispatch<AppDispatch>();
const themeMode = useSelector((state: RootState) => state.ui.themeMode);
const contact = useSelector((state: RootState) => 
  state.contacts.items.find((c) => c.id === id) 
);

// const activities = useSelector((s: RootState) => s.activities.items)
type ContactForm = Partial<
  Omit<Contact, "id" | "created_at" | "owner_id" | "org_id" | "owner_name" | "full_name">
>;

const [isEditing, setIsEditing] = useState(false);
const [form, setForm] = useState<ContactForm>({});
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

// const {
//   result: aiInsight,
//   loading: aiLoading,
//   error: aiError,
//   generate: generateInsight,
//   clear: clearInsight,
// } = useAI(aiApi.getContactIntel);

// const contactActivities = activities.filter(
//   a => a.contact_name === contact?.name
// );

// const daysSinceLastContact = (() => {
//   if (contactActivities.length === 0) return 999;

//   const latest = [...contactActivities].sort(
//     (a, b) =>
//       new Date(b.created_at || '').getTime() -
//       new Date(a.created_at || '').getTime()
//   )[0];

//   return Math.floor(
//     (now - new Date(latest.created_at || '').getTime()) / 86400000
//   );
// })();

// const activityTypes = contactActivities.reduce(
//   (acc: Record<string, number>, a) => {
//     acc[a.type] = (acc[a.type] || 0 ) + 1;
//     return acc;
//   },
//   {}
// );

// const handleGenerateInsight = useCallback(() => {
//   generateInsight({
//     contactName: contact?.name,
//     contactStatus: contact?.status,
//     daysSinceLastContact,
//     totalActivities: contactActivities.length,
//     activityTypes,
//     linkedDeals: 0,
//   });
// }, [contact, daysSinceLastContact, contactActivities, activityTypes, generateInsight])

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
    first_name: contact.first_name,
    last_name: contact.last_name,
    suffix: contact.suffix,
    gender: contact.gender as Gender,
    birth_date: contact.birth_date || null || '',
    email: contact.email,
    phone: contact.phone,
    company_name: contact.company_name || '',
    position: contact.position || '',
    department: contact.department || '',
    status: contact.status as ContactStatus,
    priority: contact.priority as Priority,
    notes: contact.notes || '',
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
  dispatch(updateContact({ id: contact.id, contact: form as Contact}));
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

 const priorityIcon = () => {
  if (contact.priority === 'High') {
    return <PriorityIcon sx={{
      color: PRIORITY_COLORS['High'],
      border: `1px solid ${PRIORITY_COLORS['High']}`,
      borderRadius: 20,
    }} fontSize='large'/>
  }
  if (contact.priority === 'Highest') {
    return <PriorityIcon sx={{
      color: PRIORITY_COLORS['Highest'],
      border: `1px solid ${PRIORITY_COLORS['Highest']}`,
      borderRadius: 20,
    }} fontSize='large'/>
  }
 }

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant='h4' fontWeight={700}>
            {contact.first_name} {contact.last_name} 
          </Typography>
          <Chip
            label={contact.status}
            size='small'
            sx={{ 
              px: 2, 
              py: '1px', 
              mt: 1, 
              border: contact.status === 'Contacted' ? '1px solid #7a7a7a98' : 'none', 
              backgroundColor: STATUS_COLORS[contact.status], 
              color: contact.status === 'Churned' || contact.status === 'Lost' ? 'white' : 'black' }}
          />
          <Typography fontWeight={500} marginTop={2} fontSize={12}>
            {contact.notes}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isEditing && (
            <>
                {priorityIcon()}
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
            <Typography variant='h6' fontWeight={700}>
              Personal Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon color="action" />
              <Box sx={{width: '60%'}}>
                <Typography variant="caption" color="text.secondary">
                  Full name
                </Typography>
                <Typography>{contact.first_name} {contact.last_name} {contact.suffix}</Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <FemaleIcon color="action" />
                <MaleIcon color="action" sx={{ position: "absolute", top: -5, right: -1, }}/>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Gender
                </Typography>
                <Typography>{contact.gender}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon color="action" />
              <Box sx={{width: '60%'}}>
                <Typography variant="caption" color="text.secondary">
                  Email address
                </Typography>
                <Typography>{contact.email}</Typography>
              </Box>
              <CakeIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography>{ !contact.birth_date ? 'Not Provided' : contact.birth_date }</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhoneIcon color="action" />
              <Box sx={{width: '60%'}}>
                <Typography variant="caption" color="text.secondary">
                  Phone number
                </Typography>
                <Typography>{contact.phone || '—'}</Typography>
              </Box>
              <CalendarTodayIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Added on
                </Typography>
                <Typography>{formattedDate}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 1, mt: 4}}/>
            <Typography variant='h6' fontWeight={700}>
              Professional Details
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon color="action" />
              <Box sx={{width: '60%'}}>
                <Typography variant="caption" color="text.secondary">
                  Company
                </Typography>
                <Typography>{!contact.company_name ? 'Not Provided' : contact.company_name}</Typography>
              </Box>
              <WorkIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Position
                </Typography>
                <Typography>{ !contact.position ? 'Not Provided' : contact.position}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountTreeIcon color="action" />
              <Box sx={{width: '60%'}}>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography>{!contact.department ? 'Not Provided' : contact.department}</Typography>
              </Box>
            </Box>
            
          </Box>
        )}

        {isEditing && (
           <Box 
            sx={{
              display: "flex",
              flexDirection: 'column',
              width: '100%',
              minWidth: 450,
              justifyContent: "center",
              p: 2,
              gap: 1,
            }}>
            <Typography variant="h5" fontWeight={700} mt={2}>
            Personal Details
            </Typography>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                label="First Name"
                name="first_name"
                required
                onChange={handleChange}
                value={form.first_name}
                size="small"
                sx={{
                  fontSize: 13,
                  width: '50%'
                }}
                />
      
                <TextField
                  label="Last Name"
                  name="last_name"
                  required
                  onChange={handleChange}
                  value={form.last_name}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                />

              </Box>

              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  label="Suffix"
                  name="suffix"
                  value={form.suffix}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                />
    
                <TextField
                  type='tel'
                  label="Phone"
                  name="phone"
                  placeholder='63+'
                  required
                  onChange={handleChange}
                  value={form.phone}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                />
                
              </Box>
                
              <TextField
                label="Email"
                name="email"
                required
                onChange={handleChange}
                value={form.email}
                size="small"
                sx={{
                  fontSize: 13,
                }}
              />

              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>

                <TextField
                  select
                  label="Gender"
                  name="gender"
                  onChange={handleChange}
                  value={form.gender}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%',
                  }}
                >
                {GENDER.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
                </TextField>

                <TextField
                  label="Date of Birth"
                  name="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%',
                    '& input' : {
                      colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
                    }
                  }}
                />

              </Box>
              <Typography variant="h5" fontWeight={700} mt={2}>
                Professional Details
              </Typography>
              <TextField
                label="Company"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                size="small"
                sx={{
                  fontSize: 13,
                }}
              />
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                />
    
                <TextField
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                />
              </Box>
              <Typography variant="h5" fontWeight={700} mt={2}>
                Additional Details
              </Typography>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
    
                <TextField
                  select
                  label="Priority"
                  name="priority"
                  onChange={handleChange}
                  value={form.priority}
                  size="small"
                  sx={{
                    fontSize: 13,
                    width: '50%'
                  }}
                >
                  {PRIORITY.map((prio) => (
                    <MenuItem key={prio} value={prio}>
                      {prio}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  size="small"
                  multiline
                  rows={3}
                  sx={{
                    fontSize: 13,
                  }}
                />

                <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 1}}>
                  <Button 
                    onClick={handleEditCancel}
                    sx={{
                        backgroundColor: '#7c7c7cb4',
                        width: '50%',
                        color: 'white'
                      }}
                    >
                  Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!form.first_name || !form.email || !form.last_name || !form.phone}
                    sx={{
                      backgroundColor: 'primary.main',
                      width: '50%',
                    }}
                  >
                    Update Contact
                  </Button>
                </Box>
                
            </Box>
          // <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          //   <TextField
          //     label="Name"
          //     name="name"
          //     value={form.name || ''}
          //     onChange={handleChange}
          //     fullWidth
          //   />
          //   <TextField
          //     label="Email"
          //     name="email"
          //     value={form.email || ''}
          //     onChange={handleChange}
          //     fullWidth
          //   />
          //   <TextField
          //     label="Phone"
          //     name="phone"
          //     value={form.phone || ''}
          //     onChange={handleChange}
          //     fullWidth
          //   />
          //   <TextField
          //     label="Status"
          //     name="status"
          //     value={form.status || 'active'}
          //     onChange={handleChange}
          //     select
          //     fullWidth
          //   >
          //     <MenuItem value="active">Active</MenuItem>
          //     <MenuItem value="Prospect">Prospect</MenuItem>
          //     <MenuItem value="Lead">Lead</MenuItem>
          //   </TextField>

          //   <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          //     <Button variant="contained" onClick={handleSave}>
          //       Save changes
          //     </Button>
          //     <Button onClick={handleEditCancel}>
          //       Cancel
          //     </Button>
          //   </Box>
          // </Box>
        )}
    </Paper>
    {/* <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        AI Insight
      </Typography>
      <AIInsightCard
        title="Contact Intelligence"
        result={aiInsight}
        loading={aiLoading}
        error={aiError}
        onGenerate={handleGenerateInsight}
        onClear={clearInsight}
        buttonLabel="✨ Analyze this contact"
      />
    </Paper> */}
    <Dialog
      open={deleteDialogOpen}
      onClose={() => setDeleteDialogOpen(false)}
    >
      <DialogTitle>Delete contact?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{contact.first_name} {contact.last_name}</strong>?
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