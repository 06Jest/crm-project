import { forwardRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import {  deleteContact, clearError, updateContactPersonal, updateContactSocials, updateContactCareer, updateContactNotes, updateContactSource, updateContactPreferredTime, fetchContactListByID, } from '../../../store/contactsSlice';
import { type ContactCareer, type ContactPersonal, type ContactSocials, type ContactStatus, } from "../../../types/contact";
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
  Collapse,
  Grow,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { alpha, keyframes, type Theme } from '@mui/material/styles';
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
import ShareIcon from '@mui/icons-material/Share';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ClearIcon from '@mui/icons-material/Clear';
import type { RootState } from '../../../store/store';
import { fixLeafletIcons } from '../../../utils/fixLeafletIcons';
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from '../../../types/global';
import ErrorAlert from '../../../components/Error';
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

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GrowTransition = forwardRef(function GrowTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Grow ref={ref} timeout={220} {...props} />;
});

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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
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
          <IconButton
            size="small"
            onClick={onEdit}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              flexShrink: 0,
              transition: 'border-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                transform: 'scale(1.06)',
              },
            }}
          >
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
const twoColSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: { xs: 0, sm: 4 },
};
const twoFieldRowSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 1.5,
};


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
          transition: 'opacity 0.15s ease',
          "&:hover": {
            textDecoration: "underline",
            opacity: 0.8,
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

  useEffect(() => {
    if (!id) return;

    dispatch(fetchContactListByID(id));
  }, [id, dispatch]);

  const contact = useSelector((state: RootState) =>
    state.contacts.items.find((c) => c.id === id)
  );
  const customer = useSelector((state: RootState) =>
    state.customers.items.find((c) => c.contact_id === contact?.id)
  );
  const { loading, error } = useSelector((state: RootState) => state.contacts);

  type PersonalForm = Partial<ContactPersonal>;
  type SocialsForm = Partial<ContactSocials>;
  type CareerForm = Partial<ContactCareer>;

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [isEditingCareer, setIsEditingCareer] = useState(false);
  const [formPersonal, setFormPersonal] = useState<PersonalForm>({});
  const [formSocials, setFormSocials] = useState<SocialsForm>({});
  const [formCareer, setFormCareer] = useState<CareerForm>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [hoveredNotes, setHoveredNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [hoveredSource, setHoveredSource] = useState(false);
  const [isUpdatingSource, setIsUpdatingSource] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Source | "">("");
  const [updateSource, setUpdateSource] = useState(false);
  const [hoveredPreferredTime, setHoveredPreferredTime] = useState(false);
  const [isUpdatingPreferredTime, setIsUpdatingPreferredTime] = useState(false);
  const [selectedPreferredTime, setSelectedPreferredTime] = useState<PreferredTime | "">("");
  const [updatePreferredTime, setUpdatePreferredTime] = useState(false);

  if (loading && !contact) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 800
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!contact) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, px: 2, height: 800 }}>
        <Typography variant="h6" color="text.secondary">
          Contact not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            dispatch(clearError());
            navigate(-1)
          }}
          sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  const handleEditNotes = () => {
    setNewNotes(contact?.notes ?? "");
    setIsEditingNotes(true);
  };

  const handleNewNotes = async () => {
    if (!contact || !newNotes) return;

    try {
      await dispatch(
        updateContactNotes({
          id: contact.id,
          notes: newNotes,
        })
      ).unwrap();
      
      setIsEditingNotes(false);
    } catch {
      //Error in state
    }
  }

  const handleEditSource = () => {
        setSelectedSource(contact?.source ?? "");
        setIsUpdatingSource(true);
      };
    
    
      const handleUpdateSource = async () => {
        if (!contact || !selectedSource) return;
    
        try {
          await dispatch(
            updateContactSource({
              id: contact.id,
              source: selectedSource,
            })
          ).unwrap();
    
          setUpdateSource(false);
          setIsUpdatingSource(false);
        } catch {
          //Error in state
        }
      };
  
    const handleEditPreferredTime = () => {
      setSelectedPreferredTime(contact?.preferred_contact_time ?? "");
      setIsUpdatingPreferredTime(true);
    };
    
    
    const handleUpdatePreferredTime = async () => {
      if (!contact || !selectedPreferredTime) return;
      try {
        await dispatch(
          updateContactPreferredTime({
            id: contact.id,
            preferredTime: selectedPreferredTime,
          })
        ).unwrap();
  
        setUpdatePreferredTime(false);
        setIsUpdatingPreferredTime(false);
      } catch {
        //Error in state
      }
    };

  const handleEditStart = () => {
    setFormPersonal({
      first_name: contact.first_name,
      last_name: contact.last_name,
      suffix: contact.suffix as Suffix,
      gender: contact.gender as Gender,
      birth_date: contact.birth_date || null,
      email: contact.email,
      phone: contact.phone,
    });
    setIsEditingPersonal(true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormPersonal({ ...formPersonal, [e.target.name]: e.target.value });
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
      await dispatch(updateContactPersonal({ id: contact.id, personal: formPersonal as ContactPersonal })).unwrap();
      setIsEditingPersonal(false);
    } catch {
      //Error in state
    }
    dispatch(clearError())
  };

  const handleSaveSocials = async () => {
    if (loading) return;
    try {
      await dispatch(updateContactSocials({ id: contact.id, socials: formSocials as ContactSocials })).unwrap();
      setIsEditingSocials(false);

    } catch {
      //Error in state
    }
    dispatch(clearError())
  };

  const handleSaveCareer = async () => {
    if (loading) return;
    try {
      await dispatch(updateContactCareer({ id: contact.id, career: formCareer as ContactCareer })).unwrap();
      setIsEditingCareer(false);
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
    width: { xs: '100%', sm: 'auto' },
    transition: 'background-color 0.2s ease',
  };
  const saveBtnSx = {
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: 2,
    minWidth: 90,
    width: { xs: '100%', sm: 'auto' },
    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
    },
  };
  const editActionsSx = {
    display: 'flex',
    flexDirection: { xs: 'column-reverse', sm: 'row' },
    justifyContent: 'flex-end',
    gap: 1,
    mt: 1,
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4, px: { xs: 2, sm: 3, md: 0 } }}>

      <Collapse in={!!error} unmountOnExit>
      {error && (
        <Box sx={{ width: '100%', my: 2 }}>
          <ErrorAlert
            message={error}
          />
        </Box>
        )}
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Button
          startIcon={<ArrowBackIcon/>}
          onClick={() => {
            navigate(-1);
            dispatch(clearError());
          } }
          sx={{
            alignSelf: 'start',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateX(-2px)' },
          }}>
          Back
        </Button>
        {(contact.status === 'Customer' && customer) && (
        <Button
          endIcon={<ArrowForwardIcon/>}
          onClick={() => {
            navigate(`/app/customers/${customer.id}`);
            dispatch(clearError());
          } }
          sx={{
            alignSelf: 'start',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateX(2px)' },
          }}>
          Customer Profile
        </Button>
        )}
      </Box>
      <Paper
        variant="outlined"
        sx={{
          pt: '10px !important',
          p: { xs: 2.5, sm: 3, md: 4 },
          borderRadius: 3,
          mb: 3,
          mt: 2,
          borderColor: 'divider',
          animation: `${fadeInUp} 0.45s ease-out`,
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'center',mb: 2}}>
          <Typography sx={{border: '1px solid #ccc', height: '100%', borderRadius: 10,px: 2, py: 0.5, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',}}>CONTACT</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: { xs: 2, sm: 2.5 },
            mb: 1,
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexShrink: 0, flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                width: { xs: 84, sm: 100 },
                height: { xs: 84, sm: 100 },
                fontSize: { xs: 26, sm: 32 },
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
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
                },
              }}>
                Add deal
              </Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', overflowWrap: "anywhere", wordBreak: "break-word", textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography
              variant='h4'
              fontWeight={700}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.125rem' },
              }}
            >
              {fullName} {contact.suffix} 
              <Box title={`${contact.priority} Priority`} component="span" sx={{ ml: 1, cursor: 'pointer', display: "flex", width: 30, height: 30, flexShrink: 0 }}>
              {priorityIcon(contact.priority)}
            </Box>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.25, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Paper
                title="Status"
                elevation={2}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                  py: 0.5,
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  border:
                    contact.status === 'Contacted'
                      ? '1px solid #7a7a7a98'
                      : 'none',
                  backgroundColor: STATUS_COLORS[contact.status],
                  color: contact.status === 'Contacted' ? 'black' : 'white',
                  borderRadius: 10,
                }}
              >
                {contact.status}
              </Paper>
              {!isUpdatingSource ? (
                <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}
                  onMouseEnter={() => setHoveredSource(true)}
                  onMouseLeave={() => setHoveredSource(false)}
                >
                  <Paper
                    title="Source"
                    elevation={2}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1,
                      py: 0.5,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.6px',
                      cursor: 'pointer',
                      borderRadius: 10,
                      opacity: hoveredSource ? 0.4 : 1,
                    }}
                  >
                    {contact?.source}
                  </Paper>
                  <IconButton onClick={handleEditSource} title='Update Source' sx={{p:'1px', position: 'absolute'}}>
                    <ModeEditIcon sx={{ fontSize: '15px', opacity: hoveredSource ? 1 : 0,  transition: "all 0.3s ease", transform: hoveredSource ? "translateX(0)" : "translateX(8px)",}}/>
                  </IconButton>
                </Box>
                ): (
                  <Box sx={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                    <TextField
                      select
                      value={selectedSource}
                      onChange={(e) =>
                        setSelectedSource(e.target.value as Source)
                      }
                      size="small"
                      sx={{ 
                        '& .MuiInputBase-input': {
                            py: '2px',
                            fontSize: '12px'
                          },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      }} 
                      slotProps={{
                        select: {
                          MenuProps: {
                            PaperProps: { sx: { maxHeight: 200 } },
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
                    <IconButton title='Confirm Update' onClick={() => setUpdateSource(true)}  sx={{p:'2px'}}>
                      <CheckIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                    <IconButton title='Cancel' onClick={() => setIsUpdatingSource(false)} sx={{p:'2px'}}>
                      <CancelIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                  </Box>
              )}
              {!isUpdatingPreferredTime ? (
                <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}
                  onMouseEnter={() => setHoveredPreferredTime(true)}
                  onMouseLeave={() => setHoveredPreferredTime(false)}
                >
                  <Paper
                    title="Preferred contact time"
                    elevation={2}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1,
                      py: 0.5,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.6px',
                      cursor: 'pointer',
                      borderRadius: 10,
                      opacity: hoveredPreferredTime ? 0.4 : 1,
                    }}
                  >
                    {contact?.preferred_contact_time}
                  </Paper>
                  <IconButton onClick={handleEditPreferredTime} title='Update Preferred contact time' sx={{p:'1px', position: 'absolute'}}>
                    <ModeEditIcon sx={{ fontSize: '15px', opacity: hoveredPreferredTime ? 1 : 0,  transition: "all 0.3s ease", transform: hoveredPreferredTime ? "translateX(0)" : "translateX(8px)",}}/>
                  </IconButton>
                </Box>
                ): (
                  <Box sx={{display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                    <TextField
                      select
                      value={selectedPreferredTime}
                      onChange={(e) =>
                        setSelectedPreferredTime(e.target.value as PreferredTime)
                      }
                      size="small"
                      sx={{ 
                        '& .MuiInputBase-input': {
                            py: '2px',
                            fontSize: '12px'
                          },
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      }} 
                      slotProps={{
                        select: {
                          MenuProps: {
                            PaperProps: { sx: { maxHeight: 200 } },
                          },
                        },
                      }}
                    >
                      {PREFERRED_CONTACT_TIMES.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </TextField>
                    <IconButton title='Confirm Update' onClick={() => setUpdatePreferredTime(true)}  sx={{p:'2px'}}>
                      <CheckIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                    <IconButton title='Cancel' onClick={() => setIsUpdatingPreferredTime(false)} sx={{p:'2px'}}>
                      <CancelIcon sx={{fontSize: '13px'}}/>
                    </IconButton>
                  </Box>
              )}
              <Chip
                label={formatName(contact.owner.profile.first_name, contact.owner.profile.last_name)}
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
                  transition: 'opacity 0.15s ease',
                  '&:hover': { opacity: 0.85 },
                }}
              />
            </Box>
            {!isEditingNotes ? (
              <Box
                onMouseEnter={() => setHoveredNotes(true)}
                onMouseLeave={() => setHoveredNotes(false)}
                sx={(theme) => ({
                  display: 'flex',
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? '#242424' : '#f7f8fa',
                  p: '8px 10px',
                  mt: 1
                })}>
                <Typography title="Notes" fontWeight={500} fontSize={12} color="text.secondary" sx={{cursor: 'pointer', minHeight: 40, width: '95%' }}>
                  {contact?.notes}
                </Typography>
                <Box width={'5%'} >
                  <IconButton onClick={() => {
                    setIsEditingNotes(true)
                    handleEditNotes()
                  }}
                  title='Edit Notes' sx={{opacity: hoveredNotes ? 1 : 0, p: '2px',  transition: "all 0.3s ease", transform: hoveredNotes ? "translateX(0)" : "translateX(8px)",}}>
                    <EditNoteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              ) : (
                <Box sx={{display: 'flex', mt: 1}}>
                  <TextField
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    size="small"
                    multiline
                    fullWidth
                    rows={3}
                    sx={{ 
                      '& .MuiInputBase-input': {
                          fontSize: '12px',
                        },
                        "& .MuiInputBase-inputMultiline": {
                          lineHeight: 1.1,
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "5px 10px",
                          borderRadius: 2,
                        },
                      }}
                  />
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                      <IconButton title='Confirm Update' onClick={handleNewNotes} sx={{p:'2px'}}>
                        <CheckIcon sx={{fontSize: '13px'}}/>
                      </IconButton>
                      <IconButton title='Cancel' onClick={() => setIsEditingNotes(false)} sx={{p:'2px'}}>
                        <CancelIcon sx={{fontSize: '13px'}}/>
                      </IconButton>
                  </Box>
                </Box>
                )}
          </Box>
          <Box sx={{ display: 'flex', flexShrink: 0, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            {!isEditingPersonal && (
              <Button
                variant='outlined'
                color='error'
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.06),
                  },
                }}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Collapse in={!isEditingPersonal} unmountOnExit>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" onEdit={handleEditStart} />
            <Box sx={twoColSx}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <InfoRow icon={<PersonIcon fontSize="small" />} label="Full name" value={`${fullName} ${contact.suffix ?? ''}`} />
                <InfoRow icon={<EmailIcon fontSize="small" />} label="Email address" value={contact.email || 'Not Provided'} />
                <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone number" value={contact.phone || 'Not Provided'} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
        </Collapse>

        <Collapse in={isEditingPersonal} unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: 'column',
              width: '100%',
              justifyContent: "center",
              gap: 1.5,
            }}>
            <SectionHeader icon={<PersonOutlineIcon fontSize="small" />} title="Personal Details" />
            <Box sx={twoFieldRowSx}>
              <TextField
                label="First Name"
                name="first_name"
                required
                onChange={handleChange}
                value={formPersonal.first_name || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Last Name"
                name="last_name"
                required
                onChange={handleChange}
                value={formPersonal.last_name || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <Box sx={twoFieldRowSx}>
              <TextField
                select
                label="Suffix"
                name="suffix"
                onChange={handleChange}
                value={formPersonal.suffix ?? ''}
                size="small"
                fullWidth
                sx={fieldSx}
                slotProps={{
                  select: {
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 250,
                        },
                      },
                    },
                  },
                }}
                InputProps={{
                  endAdornment: formPersonal.suffix ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        sx={{ml: '-40px'}}
                        onClick={() =>
                          setFormPersonal(prev => ({
                            ...prev,
                            suffix: null,
                          }))
                        }
                        aria-label="Clear suffix"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
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
                value={formPersonal.phone || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              required
              onChange={handleChange}
              value={formPersonal.email || ''}
              size="small"
              fullWidth
              sx={fieldSx}
            />

            <Box sx={twoFieldRowSx}>
              <TextField
                select
                label="Gender"
                name="gender"
                onChange={handleChange}
                value={formPersonal.gender || ''}
                size="small"
                fullWidth
                sx={fieldSx}
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
                value={formPersonal.birth_date || ''}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                size="small"
                fullWidth
                sx={{
                  ...fieldSx,
                  '& input': {
                    colorScheme: themeMode === 'dark' ? 'dark' : 'light',
                  }
                }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={editActionsSx}>
              <Button
                onClick={() => {
                  setIsEditingPersonal(false)
                  setFormPersonal({})
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
                disabled={!formPersonal.first_name || !formPersonal.email || !formPersonal.last_name || !formPersonal.phone || loading}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
                sx={saveBtnSx}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Collapse>

        <Divider sx={{ mb: 1, mt: 4 }} />

        <Collapse in={!isEditingSocials} unmountOnExit>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader icon={<ShareIcon fontSize="small" />} title="Social and Messaging Accounts" onEdit={handleEditSocials} />

            <Box sx={twoColSx}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
        </Collapse>

        <Collapse in={isEditingSocials} unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', gap: 1.5 }}>
            <SectionHeader icon={<ShareIcon fontSize="small" />} title="Social and Messaging Accounts" />
            <Box sx={twoFieldRowSx}>
              <TextField
                label="Facebook"
                name="facebook"
                onChange={handleChangeSocials}
                value={formSocials.facebook || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="X / Twitter"
                name="x"
                onChange={handleChangeSocials}
                value={formSocials.x || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>
            <Box sx={twoFieldRowSx}>
              <TextField
                label="Instagram"
                name="instagram"
                onChange={handleChangeSocials}
                value={formSocials.instagram || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="LinkedIn"
                name="linkedin"
                onChange={handleChangeSocials}
                value={formSocials.linkedin || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>
            <Box sx={twoFieldRowSx}>
              <TextField
                label="Tiktok"
                name="tiktok"
                onChange={handleChangeSocials}
                value={formSocials.tiktok || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="WhatsApp"
                name="whatsapp"
                onChange={handleChangeSocials}
                value={formSocials.whatsapp || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>
            <Box sx={twoFieldRowSx}>
              <TextField
                label="Viber"
                name="viber"
                onChange={handleChangeSocials}
                value={formSocials.viber || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Telegram"
                name="telegram"
                onChange={handleChangeSocials}
                value={formSocials.telegram || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <Box sx={editActionsSx}>
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
                sx={saveBtnSx}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Collapse>

        <Divider sx={{ mb: 1, mt: 4 }} />

        {/* ---------------- Professional Details ---------------- */}
        <Collapse in={!isEditingCareer} unmountOnExit>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" onEdit={handleEditCareer} />

            <Box sx={twoColSx}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <InfoRow icon={<AccountTreeIcon fontSize="small" />} label="Industry" value={contact.industry || 'Not Provided'} />
                <InfoRow icon={<BusinessIcon fontSize="small" />} label="Company" value={contact.company_name || 'Not Provided'} />
                <InfoRow icon={<LanguageIcon fontSize="small" />} label="Website" value={contact.website || 'Not Provided'} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <InfoRow icon={<AccountTreeIcon fontSize="small" />} label="Department" value={contact.department || 'Not Provided'} />
                <InfoRow icon={<WorkIcon fontSize="small" />} label="Position" value={contact.position || 'Not Provided'} />
              </Box>
            </Box>
          </Box>
        </Collapse>

        <Collapse in={isEditingCareer} unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: 'column', width: '100%', gap: 1.5 }}>
            <SectionHeader icon={<WorkOutlineIcon fontSize="small" />} title="Professional Details" />
            <Box sx={twoFieldRowSx}>
              <Autocomplete
                freeSolo
                fullWidth
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
                fullWidth
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
            <Box sx={twoFieldRowSx}>
              <TextField
                label="Company"
                name="company_name"
                onChange={handleChangeCareer}
                value={formCareer.company_name || ''}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              
              <TextField
                label="Position"
                name="position"
                onChange={handleChangeCareer}
                value={formCareer.position || ''}
                size="small"
                fullWidth
                sx={fieldSx}
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

            <Box sx={editActionsSx}>
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
                sx={saveBtnSx}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {deleteDialogOpen && (
        <Dialog
          open={deleteDialogOpen}
          onClose={loading ? undefined : () => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          TransitionComponent={GrowTransition}
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
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              color="inherit"
              disabled={loading}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              disableElevation
              onClick={handleDeleteConfirm}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        open={updateSource}
        onClose={() => setUpdateSource(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update source for <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setUpdateSource(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="warning"
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            onClick={handleUpdateSource}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        open={updatePreferredTime}
        onClose={() => setUpdatePreferredTime(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update preferred contact time for <strong>{contact.first_name} {contact.last_name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setUpdatePreferredTime(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="warning"
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            onClick={handleUpdatePreferredTime}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
