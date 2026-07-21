import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { updateContact, deleteContact, clearError, updateSocials, updateCareer } from '../../../store/contactsSlice';
import { type ContactCareer, type ContactSocials, type ContactStatus, type UpdateContact } from "../../../types/contact";
import 'leaflet/dist/leaflet.css';


import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  Autocomplete,
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
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LanguageIcon from '@mui/icons-material/Language';

import type { RootState } from '../../../store/store';
import { fixLeafletIcons } from '../../../utils/fixLeafletIcons';
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from '../../../types/global';
import ErrorAlert from '../../../components/Error';
import SuccessAlert from '../../../components/Success';
import { formatName } from '../../../utils/formatText';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

fixLeafletIcons();


const STATUS_COLORS: Record<ContactStatus, string> = {
  Contacted: '#ffffff',
  Opportunity: '#ffbb29',
  Customer: '#AD7450',
  Lost: '#7a0000',
  Churned: '#000000',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const SocialLink = ({
    href,
    value,
  }: {
    href: string;
    value: string | null | undefined;
  }) => {
    if (!value) {
      return <Typography>Not Provided</Typography>;
    }

    return (
      <Typography
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "primary.main",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
          },
          display: 'block'
        }}
      >
        {value}
      </Typography>
    );
  };

export default function ContactDetail() {
  
  const { id } = useParams<{id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
    
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const contact = useSelector((state: RootState) =>
    state.contacts.items.find((c) => c.id === id)
  );
  const customer = useSelector((state: RootState) =>
    state.customers.items.find((c) => c.contact_id === contact?.id)
  );
  const { loading, error } = useSelector((state: RootState) => state.contacts);

  type BasicForm = Partial<UpdateContact>;
  type SocialsForm = Partial<ContactSocials>;
  type CareerForm = Partial<ContactCareer>;

  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [isEditingCareer, setIsEditingCareer] = useState(false);
  const [formBasic, setFormBasic] = useState<BasicForm>({});
  const [formSocials, setFormSocials] = useState<SocialsForm>({});
  const [formCareer, setFormCareer] = useState<CareerForm>({});
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
          onClick={() => {
            dispatch(clearError());
            navigate('/app/contacts')
          }}
          sx={{ mt: 2 }}
        >
          Back to contacts
        </Button>
      </Box>
    );
  }

  const handleEditStart = () => {
    setFormBasic({
      first_name: contact.first_name,
      last_name: contact.last_name,
      suffix: contact.suffix as Suffix,
      gender: contact.gender as Gender,
      birth_date: contact.birth_date || null,
      email: contact.email,
      phone: contact.phone,
      status: contact.status as ContactStatus,
      source: contact.source as Source,
      priority: contact.priority as Priority,
      notes: contact.notes || '',
      preferred_contact_time: contact.preferred_contact_time as PreferredTime,
    });
    setIsEditingBasic(true);
  };

  const handleEditSocials = () => {
    setFormSocials({
      facebook: contact.facebook || '',
      x: contact.x || '',
      whatsapp: contact.whatsapp || '',
      linkedin: contact.linkedin || '',
      instagram: contact.instagram || '',
      telegram: contact.telegram || '',
      tiktok: contact.tiktok || '',
      viber: contact.viber || '',
    });
    setIsEditingSocials(true);
  };

  const handleEditCareer = () => {
    setFormCareer({
      company_name: contact.company_name || '',
      industry: contact.industry || '',
      position: contact.position || '',
      department: contact.department || '',
      website: contact.website || '',
    });
    setIsEditingCareer(true);
  };

  const success = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormBasic({ ...formBasic, [e.target.name]: e.target.value });
  };

  const handleChangeSocials = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormSocials({ ...formSocials, [e.target.name]: e.target.value });
  };

  const handleChangeCareer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormCareer({ ...formCareer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (loading) return;
    try {
      await dispatch(updateContact({ id: contact.id, contact: formBasic as UpdateContact })).unwrap();
      setIsEditingBasic(false);
      success("Contact updated successfully")
    } catch {
      //Error in state
    }
    dispatch(clearError())
  };

  const handleSaveSocials = async () => {
    if (loading) return;
    try {
      await dispatch(updateSocials({ id: contact.id, socials: formSocials as ContactSocials })).unwrap();
      setIsEditingSocials(false);

      
      success("Contact updated successfully")
    } catch {
      //Error in state
    }
    dispatch(clearError())
  };

  const handleSaveCareer = async () => {
    if (loading) return;
    try {
      await dispatch(updateCareer({ id: contact.id, career: formCareer as ContactCareer })).unwrap();
      setIsEditingCareer(false);
      success("Contact updated successfully")
    } catch {
      //Error in state
    }
    dispatch(clearError())
  };

  const handleDeleteConfirm = async () => {
    if (loading) return;
    try {
      await dispatch(deleteContact(contact.id)).unwrap();
      navigate('/app/contacts');
    } catch {
      //Error in State
    }
  };

  const formattedDate = (created: string | null | undefined) =>
    created
      ? new Date(created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "Unknown";

  const priorityIcon = (priority: Priority) => {
    if (priority === 'High') {
      return <PriorityIcon sx={{
        color: PRIORITY_COLORS['High'],
        border: `1px solid ${PRIORITY_COLORS['High']}`,
        borderRadius: 20,
      }} fontSize='large' />
    }
    if (priority === 'Highest') {
      return <PriorityIcon sx={{
        color: PRIORITY_COLORS['Highest'],
        border: `1px solid ${PRIORITY_COLORS['Highest']}`,
        borderRadius: 20,
      }} fontSize='large' />
    }
  }


  

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>

      {successMessage && (
        <Box sx={{ my: 2, width: '100%' }}>
          <SuccessAlert
            message={successMessage}
          />
        </Box>
      )}

      {error && (
        <Box sx={{ width: '100%', my: 2 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
      )}

      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Button 
          startIcon={<ArrowBackIcon/>}
          onClick={() => {
            navigate('/app/contacts');
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start'}}>
          Contacts
        </Button>
        {(contact.status === 'Customer' && customer) && (
        <Button 
          endIcon={<ArrowForwardIcon/>}
          onClick={() => {
            navigate(`/app/customers/${customer.id}`);
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start'}}>
          Customer Profile
        </Button>
        )}
      </Box>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 3, mb: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, width: '100%' }}>
          <Box sx={{display: 'flex', width: 100, mr: 2, flexDirection: 'column' }}>
            <Box sx={{width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', height:100, border: '1px solid #ccccccd8', borderRadius: 100}}>
              <PersonIcon sx={{fontSize: '80px', color: '#686868b0'}}/>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              <Button 
              title="Add new Deal for this contact"
              onClick={()=> navigate(`/app/adddeal/${contact.id}`)}
              sx={{border: '1px solid', borderColor: 'primary.main', fontWeight: 700, p: '2px 8px', mt: 1, fontSize: '10px'}}>
                Add deal
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowWrap: "anywhere", wordBreak: "break-word",}}>
            <Typography variant='h4' fontWeight={700} sx={{display: 'flex', alignItems: 'center'}}>
              {formatName(contact.first_name, contact.last_name)} {contact.suffix} 
              <Box title={`${contact.priority} Priority`} component="span" sx={{ ml: 1, cursor: 'pointer', display: "flex", width: 30, height: 30 }}>
              {priorityIcon(contact.priority)}
            </Box>
            </Typography>
            <Chip
              label={contact.status}
              title="Status"
              size='small'
              sx={{
                px: 2,
                py: '1px',
                cursor: 'pointer',
                mt: 1,
                border: contact.status === 'Contacted' ? '1px solid #7a7a7a98' : 'none',
                backgroundColor: STATUS_COLORS[contact.status],
                color: contact.status === 'Churned' || contact.status === 'Lost' ? 'white' : 'black'
              }}
            />
            <Chip
              label={contact.source === 'Other' ? 'Not Provided' : contact.source}
              title="Contact Source"
              size='small'
              sx={{
                px: 2,
                py: '1px',
                cursor: 'pointer',
                mt: 1,
                mx: 2,
                border: '1px solid #7a7a7a98',
                backgroundColor: '#cccccc00',
              }}
            />
            <Chip
              label={contact.preferred_contact_time}
              title="Preferred contact time"
              variant="filled"
              size='small'
              sx={{
                px: 2,
                cursor: 'pointer',
                py: '1px',
                mt: 1,
                mr: 2,
                border: '1px solid #7a7a7a98',
                backgroundColor: '#cccccc00',
              }}
            />
            <Chip
              label={formatName(contact.owner.first_name, contact.owner.last_name)}
              title="Contact owner"
              size='small'
              sx={{
                px: 2,
                cursor: 'pointer',
                py: '1px',
                mt: 1,
                border: `1px solid`,
                borderColor: 'primary.main',
                color: 'primary.main',
                backgroundColor: '#cccccc00',
              }}
            />
            <Typography title="Notes" fontWeight={500} marginTop={2} fontSize={12} sx={{ cursor: 'pointer', }}>
              {contact.notes}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', width: '14%' }}>
            {!isEditingBasic && (
              <Button
                variant='outlined'
                color='error'
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{fontSize: '10px', fontWeight: 700,}}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {!isEditingBasic ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6' fontWeight={700}>
                Personal Details
              </Typography>
              <IconButton size='small' onClick={handleEditStart}>
                <EditIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Full name
                    </Typography>
                    <Typography>{formatName(contact.first_name, contact.last_name)} {contact.suffix}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Email address
                    </Typography>
                    <Typography>{contact.email || 'Not Provided'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phone number
                    </Typography>
                    <Typography>{contact.phone || 'Not Provided'}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <FemaleIcon color="action" />
                    <MaleIcon color="action" sx={{ position: "absolute", top: -5, right: -1, }} />
                  </Box>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography>{contact.gender}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CakeIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography>{!contact.birth_date ? 'Not Provided' : contact.birth_date}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Added on
                    </Typography>
                    <Typography>{formattedDate(contact.created_at)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
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
            <Typography variant="h6" fontWeight={700} mt={2}>
              Personal Details
            </Typography>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="First Name"
                name="first_name"
                required
                onChange={handleChange}
                value={formBasic.first_name || ''}
                size="small"
                sx={{ fontSize: 13, width: '50%' }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                required
                onChange={handleChange}
                value={formBasic.last_name || ''}
                size="small"
                sx={{ fontSize: 13, width: '50%' }}
              />
            </Box>

            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                select
                label="Suffix"
                name="suffix"
                onChange={handleChange}
                value={formBasic.suffix || ''}
                size="small"
                sx={{ fontSize: 13, width: '50%' }}
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 250 } },
                    },
                  },
                }}
              >
                {SUFFIXES.map((suffix) => (
                  <MenuItem key={suffix} value={suffix}>
                    {suffix}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type='tel'
                label="Phone"
                name="phone"
                placeholder='63+'
                required
                onChange={handleChange}
                value={formBasic.phone || ''}
                size="small"
                sx={{ fontSize: 13, width: '50%' }}
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              required
              onChange={handleChange}
              value={formBasic.email || ''}
              size="small"
              sx={{ fontSize: 13 }}
            />

            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                select
                label="Gender"
                name="gender"
                onChange={handleChange}
                value={formBasic.gender || ''}
                size="small"
                sx={{ fontSize: 13, width: '50%' }}
              >
                {GENDERS.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date of Birth"
                name="birth_date"
                type="date"
                value={formBasic.birth_date || ''}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                size="small"
                sx={{
                  fontSize: 13,
                  width: '50%',
                  '& input': {
                    colorScheme: themeMode === 'dark' ? 'dark' : 'light',
                  }
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight={700} mt={2}>
              Additional Details
            </Typography>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                select
                label="Source"
                name="source"
                value={formBasic.source || ''}
                onChange={handleChange}
                size="small"
                sx={{ fontSize: 13, width: '40%' }}
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: { sx: { maxHeight: 250 } },
                    },
                  },
                }}
              >
                {SOURCES.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Preferred Time"
                name="preferred_contact_time"
                onChange={handleChange}
                value={formBasic.preferred_contact_time || ''}
                size="small"
                sx={{ fontSize: 13, width: '30%' }}
              >
                {PREFERRED_CONTACT_TIMES.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Priority"
                name="priority"
                onChange={handleChange}
                value={formBasic.priority || ''}
                size="small"
                sx={{ fontSize: 13, width: '30%' }}
              >
                {PRIORITIES.map((prio) => (
                  <MenuItem key={prio} value={prio}>
                    {prio}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Notes"
              name="notes"
              value={formBasic.notes || ''}
              onChange={handleChange}
              size="small"
              multiline
              rows={3}
              sx={{ fontSize: 13 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingBasic(false)
                  setFormBasic({})
                  dispatch(clearError())
                }}
                sx={{ backgroundColor: '#7c7c7cb4', width: '15%', color: 'white', alignSelf:'end' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!formBasic.first_name || !formBasic.email || !formBasic.last_name || !formBasic.phone}
                sx={{ backgroundColor: 'primary.main', width: '15%', alignSelf:'end' }}
              >
                Update
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 1, mt: 4 }} />

        {!isEditingSocials ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={700}>
                Social and Messaging Accounts
              </Typography>
              <IconButton size="small" onClick={handleEditSocials}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FacebookIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Facebook</Typography>
                    <SocialLink
                      value={contact.facebook}
                      href={`https://facebook.com/${contact.facebook}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <XIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">X / Twitter</Typography>
                    <SocialLink
                      value={contact.x}
                      href={`https://x.com/${contact.x}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InstagramIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Instagram</Typography>
                    <SocialLink
                      value={contact.instagram}
                      href={`https://instagram.com/${contact.instagram}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinkedInIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">LinkedIn</Typography>
                    <SocialLink
                      value={contact.linkedin}
                      href={`https://linkedin.com/in/${contact.linkedin}`}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNoteIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Tiktok</Typography>
                    <SocialLink
                      value={contact.tiktok}
                      href={`https://tiktok.com/@${contact.tiktok}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WhatsAppIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">WhatsApp</Typography>
                    <SocialLink
                      value={contact.whatsapp}
                      href={`https://wa.me/${contact.whatsapp?.replace(/\D/g, "")}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Viber</Typography>
                    <SocialLink
                      value={contact.viber}
                      href={`viber://chat?number=${contact.viber}`}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TelegramIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Telegram</Typography>
                    <SocialLink
                      value={contact.telegram}
                      href={`https://t.me/${contact.telegram}`}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', p: 2, gap: 1 }}>
            <Typography variant="h5" fontWeight={700} mt={2}>
              Social and Messaging Accounts
            </Typography>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="Facebook"
                name="facebook"
                onChange={handleChangeSocials}
                value={formSocials.facebook || ''}
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="X / Twitter"
                name="x"
                onChange={handleChangeSocials}
                value={formSocials.x || ''}
                size="small"
                sx={{ width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="Instagram"
                name="instagram"
                onChange={handleChangeSocials}
                value={formSocials.instagram || ''}
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="LinkedIn"
                name="linkedin"
                onChange={handleChangeSocials}
                value={formSocials.linkedin || ''}
                size="small"
                sx={{ width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="Tiktok"
                name="tiktok"
                onChange={handleChangeSocials}
                value={formSocials.tiktok || ''}
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="WhatsApp"
                name="whatsapp"
                onChange={handleChangeSocials}
                value={formSocials.whatsapp || ''}
                size="small"
                sx={{ width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="Viber"
                name="viber"
                onChange={handleChangeSocials}
                value={formSocials.viber || ''}
                size="small"
                sx={{ width: '50%' }}
              />
              <TextField
                label="Telegram"
                name="telegram"
                onChange={handleChangeSocials}
                value={formSocials.telegram || ''}
                size="small"
                sx={{ width: '50%' }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingSocials(false)
                  setFormSocials({})
                  dispatch(clearError())
                }}
                sx={{ backgroundColor: '#7c7c7cb4', width: '10%', color: 'white' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveSocials}
                sx={{ backgroundColor: 'primary.main', width: '10%' }}
              >
                Update
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 1, mt: 4 }} />

        {/* ---------------- Professional Details ---------------- */}
        {!isEditingCareer ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={700}>
                Professional Details
              </Typography>
              <IconButton size="small" onClick={handleEditCareer}>
                <EditIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountTreeIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Industry</Typography>
                    <Typography>{contact.industry || 'Not Provided'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Company</Typography>
                    <Typography>{contact.company_name || 'Not Provided'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LanguageIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Website</Typography>
                    <Typography>{contact.website || 'Not Provided'}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountTreeIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography>{contact.department || 'Not Provided'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="action" />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="caption" color="text.secondary">Position</Typography>
                    <Typography>{contact.position || 'Not Provided'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', p: 2, gap: 1 }}>
            <Typography variant="h5" fontWeight={700} mt={2}>
              Professional Details
            </Typography>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <Autocomplete
                freeSolo
                sx={{ width: '50%' }}
                options={INDUSTRIES}
                value={formCareer.industry || ''}
                onInputChange={(_, value) => {
                  setFormCareer(prev => ({
                    ...prev,
                    industry: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Industry"
                    size="small"
                  />
                )}
              />
              <Autocomplete
                freeSolo
                sx={{ width: '50%' }}
                options={DEPARTMENTS}
                value={formCareer.department || ''}
                onInputChange={(_, value) => {
                  setFormCareer(prev => ({
                    ...prev,
                    department: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1 }}>
              <TextField
                label="Company"
                name="company_name"
                onChange={handleChangeCareer}
                value={formCareer.company_name || ''}
                size="small"
                sx={{ width: '50%' }}
              />
              
              <TextField
                label="Position"
                name="position"
                onChange={handleChangeCareer}
                value={formCareer.position || ''}
                size="small"
                sx={{ width: '50%' }}
              />
            </Box>
            <TextField
                label="Website Url"
                name="website"
                onChange={handleChangeCareer}
                value={formCareer.website || ''}
                size="small"
                sx={{ width: '100%' }}
              />

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingCareer(false)
                  setFormCareer({})
                  dispatch(clearError())
                }}
                sx={{ backgroundColor: '#7c7c7cb4', width: '10%', color: 'white' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveCareer}
                sx={{ backgroundColor: 'primary.main', width: '10%' }}
              >
                Update
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
  );
}

