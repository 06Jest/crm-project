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
  DialogContentText,
  DialogActions,
  Paper,
  IconButton,
  Autocomplete,
  Avatar,
  Tooltip,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
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
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotesIcon from '@mui/icons-material/Notes';
import ShareIcon from '@mui/icons-material/Share';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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

// ---- purely presentational helpers (no data/logic impact) ----
const AVATAR_PALETTE = [
  "#4f5fce",
  "#0f8f7a",
  "#c4577a",
  "#c17d2a",
  "#7965d1",
  "#2c8fb0",
  "#b1544a",
  "#4a935a",
];

function stringToAvatarColor(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = input.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SectionHeader({
  icon,
  title,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  onEdit?: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: 16 }}>
          {title}
        </Typography>
      </Box>
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton size="small" onClick={onEdit} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, gap: 1.5 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.045),
          color: 'text.secondary',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

const fieldSx = {
  fontSize: 13,
  '& .MuiOutlinedInput-root': { borderRadius: 2 },
};
// ---------------------------------------------------------------

const SocialLink = ({
    href,
    value,
  }: {
    href: string;
    value: string | null | undefined;
  }) => {
    if (!value) {
      return <Typography sx={{ fontSize: 14, color: 'text.disabled' }}>Not provided</Typography>;
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
          fontSize: 14,
          fontWeight: 500,
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
          sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
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

  const fullName = formatName(contact.first_name, contact.last_name);

  const cancelBtnSx = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    minWidth: 90,
  };
  const saveBtnSx = {
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: 2,
    minWidth: 90,
    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>

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
          sx={{ alignSelf: 'start', textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
          Contacts
        </Button>
        {(contact.status === 'Customer' && customer) && (
        <Button 
          endIcon={<ArrowForwardIcon/>}
          onClick={() => {
            navigate(`/app/customers/${customer.id}`);
            dispatch(clearError());
          } }
          sx={{ alignSelf: 'start', textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
          Customer Profile
        </Button>
        )}
      </Box>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, mb: 3, mt: 2, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, width: '100%' }}>
          <Box sx={{display: 'flex', width: 100, mr: 2, flexDirection: 'column' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 32,
                fontWeight: 700,
                bgcolor: stringToAvatarColor(fullName),
              }}
            >
              {getInitials(fullName)}
            </Avatar>
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
              <Button 
              title="Add new Deal for this contact"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: '14px !important' }} />}
              onClick={()=> navigate(`/app/deals/adddeal/${contact.id}`)}
              sx={{
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 700,
                p: '3px 10px',
                mt: 1,
                fontSize: '10px',
                borderRadius: 999,
                textTransform: 'none',
              }}>
                Add deal
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowWrap: "anywhere", wordBreak: "break-word",}}>
            <Typography variant='h4' fontWeight={700} sx={{display: 'flex', alignItems: 'center'}}>
              {fullName} {contact.suffix} 
              <Box title={`${contact.priority} Priority`} component="span" sx={{ ml: 1, cursor: 'pointer', display: "flex", width: 30, height: 30 }}>
              {priorityIcon(contact.priority)}
            </Box>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.25 }}>
              <Chip
                label={contact.status}
                title="Status"
                size='small'
                sx={{
                  px: 1,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  border: contact.status === 'Contacted' ? '1px solid #7a7a7a98' : 'none',
                  backgroundColor: STATUS_COLORS[contact.status],
                  color: contact.status === 'Churned' || contact.status === 'Lost' ? 'white' : 'black'
                }}
              />
              <Chip
                label={contact.source === 'Other' ? 'Not Provided' : contact.source}
                title="Contact Source"
                size='small'
                variant="outlined"
                sx={{
                  px: 1,
                  fontSize: 12,
                  cursor: 'pointer',
                  borderColor: 'divider',
                }}
              />
              <Chip
                label={contact.preferred_contact_time}
                title="Preferred contact time"
                size='small'
                variant="outlined"
                sx={{
                  px: 1,
                  fontSize: 12,
                  cursor: 'pointer',
                  borderColor: 'divider',
                }}
              />
              <Chip
                label={formatName(contact.owner.first_name, contact.owner.last_name)}
                title="Contact owner"
                size='small'
                sx={{
                  px: 1,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid`,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
                }}
              />
            </Box>
            {contact.notes && (
              <Typography
                title="Notes"
                fontWeight={500}
                marginTop={2}
                fontSize={12.5}
                sx={{
                  cursor: 'pointer',
                  color: 'text.secondary',
                  bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.03),
                  borderRadius: 2,
                  p: 1.25,
                }}
              >
                {contact.notes}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', width: '14%', justifyContent: 'flex-end' }}>
            {!isEditingBasic && (
              <Button
                variant='outlined'
                color='error'
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{fontSize: '10px', fontWeight: 700, borderRadius: 2, textTransform: 'none'}}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {!isEditingBasic ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" onEdit={handleEditStart} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow icon={<PersonIcon fontSize="small" />} label="Full name" value={`${fullName} ${contact.suffix ?? ''}`} />
                <InfoRow icon={<EmailIcon fontSize="small" />} label="Email address" value={contact.email || 'Not Provided'} />
                <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone number" value={contact.phone || 'Not Provided'} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow
                  icon={
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <FemaleIcon fontSize="small" />
                      <MaleIcon fontSize="small" sx={{ position: "absolute", top: -5, right: -6, fontSize: 13 }} />
                    </Box>
                  }
                  label="Gender"
                  value={contact.gender}
                />
                <InfoRow icon={<CakeIcon fontSize="small" />} label="Date of Birth" value={!contact.birth_date ? 'Not Provided' : contact.birth_date} />
                <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Added on" value={formattedDate(contact.created_at)} />
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
              gap: 1.5,
            }}>
            <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" />
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="First Name"
                name="first_name"
                required
                onChange={handleChange}
                value={formBasic.first_name || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                required
                onChange={handleChange}
                value={formBasic.last_name || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>

            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                select
                label="Suffix"
                name="suffix"
                onChange={handleChange}
                value={formBasic.suffix || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
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
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              required
              onChange={handleChange}
              value={formBasic.email || ''}
              size="small"
              fullWidth
              sx={fieldSx}
            />

            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                select
                label="Gender"
                name="gender"
                onChange={handleChange}
                value={formBasic.gender || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
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
                  ...fieldSx,
                  width: '50%',
                  '& input': {
                    colorScheme: themeMode === 'dark' ? 'dark' : 'light',
                  }
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />
            <SectionHeader icon={<NotesIcon fontSize="small" />} title="Additional Details" />
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                select
                label="Source"
                name="source"
                value={formBasic.source || ''}
                onChange={handleChange}
                size="small"
                sx={{ ...fieldSx, width: '40%' }}
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
                sx={{ ...fieldSx, width: '30%' }}
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
                sx={{ ...fieldSx, width: '30%' }}
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
              fullWidth
              sx={fieldSx}
            />

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, mt: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingBasic(false)
                  setFormBasic({})
                  dispatch(clearError())
                }}
                variant="outlined"
                color="inherit"
                sx={cancelBtnSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSave}
                disabled={!formBasic.first_name || !formBasic.email || !formBasic.last_name || !formBasic.phone}
                sx={saveBtnSx}
              >
                Update
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 1, mt: 4 }} />

        {!isEditingSocials ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader icon={<ShareIcon fontSize="small" />} title="Social and Messaging Accounts" onEdit={handleEditSocials} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow
                  icon={<FacebookIcon fontSize="small" />}
                  label="Facebook"
                  value={<SocialLink value={contact.facebook} href={`https://facebook.com/${contact.facebook}`} />}
                />
                <InfoRow
                  icon={<XIcon fontSize="small" />}
                  label="X / Twitter"
                  value={<SocialLink value={contact.x} href={`https://x.com/${contact.x}`} />}
                />
                <InfoRow
                  icon={<InstagramIcon fontSize="small" />}
                  label="Instagram"
                  value={<SocialLink value={contact.instagram} href={`https://instagram.com/${contact.instagram}`} />}
                />
                <InfoRow
                  icon={<LinkedInIcon fontSize="small" />}
                  label="LinkedIn"
                  value={<SocialLink value={contact.linkedin} href={`https://linkedin.com/in/${contact.linkedin}`} />}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow
                  icon={<MusicNoteIcon fontSize="small" />}
                  label="Tiktok"
                  value={<SocialLink value={contact.tiktok} href={`https://tiktok.com/@${contact.tiktok}`} />}
                />
                <InfoRow
                  icon={<WhatsAppIcon fontSize="small" />}
                  label="WhatsApp"
                  value={<SocialLink value={contact.whatsapp} href={`https://wa.me/${contact.whatsapp?.replace(/\D/g, "")}`} />}
                />
                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label="Viber"
                  value={<SocialLink value={contact.viber} href={`viber://chat?number=${contact.viber}`} />}
                />
                <InfoRow
                  icon={<TelegramIcon fontSize="small" />}
                  label="Telegram"
                  value={<SocialLink value={contact.telegram} href={`https://t.me/${contact.telegram}`} />}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', gap: 1.5 }}>
            <SectionHeader icon={<ShareIcon fontSize="small" />} title="Social and Messaging Accounts" />
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="Facebook"
                name="facebook"
                onChange={handleChangeSocials}
                value={formSocials.facebook || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              <TextField
                label="X / Twitter"
                name="x"
                onChange={handleChangeSocials}
                value={formSocials.x || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="Instagram"
                name="instagram"
                onChange={handleChangeSocials}
                value={formSocials.instagram || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              <TextField
                label="LinkedIn"
                name="linkedin"
                onChange={handleChangeSocials}
                value={formSocials.linkedin || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="Tiktok"
                name="tiktok"
                onChange={handleChangeSocials}
                value={formSocials.tiktok || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              <TextField
                label="WhatsApp"
                name="whatsapp"
                onChange={handleChangeSocials}
                value={formSocials.whatsapp || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="Viber"
                name="viber"
                onChange={handleChangeSocials}
                value={formSocials.viber || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              <TextField
                label="Telegram"
                name="telegram"
                onChange={handleChangeSocials}
                value={formSocials.telegram || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, mt: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingSocials(false)
                  setFormSocials({})
                  dispatch(clearError())
                }}
                variant="outlined"
                color="inherit"
                sx={cancelBtnSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSaveSocials}
                sx={saveBtnSx}
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
            <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" onEdit={handleEditCareer} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow icon={<AccountTreeIcon fontSize="small" />} label="Industry" value={contact.industry || 'Not Provided'} />
                <InfoRow icon={<BusinessIcon fontSize="small" />} label="Company" value={contact.company_name || 'Not Provided'} />
                <InfoRow icon={<LanguageIcon fontSize="small" />} label="Website" value={contact.website || 'Not Provided'} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>
                <InfoRow icon={<AccountTreeIcon fontSize="small" />} label="Department" value={contact.department || 'Not Provided'} />
                <InfoRow icon={<WorkIcon fontSize="small" />} label="Position" value={contact.position || 'Not Provided'} />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', gap: 1.5 }}>
            <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" />
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
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
                    sx={fieldSx}
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
                    sx={fieldSx}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", width: '100%', justifyContent: "space-between", gap: 1.5 }}>
              <TextField
                label="Company"
                name="company_name"
                onChange={handleChangeCareer}
                value={formCareer.company_name || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
              
              <TextField
                label="Position"
                name="position"
                onChange={handleChangeCareer}
                value={formCareer.position || ''}
                size="small"
                sx={{ ...fieldSx, width: '50%' }}
              />
            </Box>
            <TextField
                label="Website Url"
                name="website"
                onChange={handleChangeCareer}
                value={formCareer.website || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />

            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1, mt: 1 }}>
              <Button
                onClick={() => {
                  setIsEditingCareer(false)
                  setFormCareer({})
                  dispatch(clearError())
                }}
                variant="outlined"
                color="inherit"
                sx={cancelBtnSx}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSaveCareer}
                sx={saveBtnSx}
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
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.1),
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          Delete contact?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.9rem' }}>
            Are you sure you want to delete{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {contact.first_name} {contact.last_name}
            </Box>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={handleDeleteConfirm}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 