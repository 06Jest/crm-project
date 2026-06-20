import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
// import { useAuthContext } from '../../../hooks/useAuthContext'
import { supabase } from "../../../services/supabase";

import {
  fetchLeads,
  // addLead,
  updateLead,
  deleteLead,
  moveLeadLocally,
} from '../../../store/leadsSlice';
import {
 addContactFromLeads,
} from '../../../store/contactsSlice';
import type { Lead,  LeadsStatus, Gender, Priority, LeadsSource } from '../../../types/lead';

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
  // Paper,
  Snackbar,
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
  Chip,
  Popover,
  InputAdornment,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';

const COLUMNS: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Closed'];

const COLUMN_COLORS: Record<Lead['status'], string> ={
  New: '#406adf',
  Contacted: '#ceb440',
  Qualified: '#41ac47',
  Closed: '#ec5757',
};
const STATUS_OPTIONS: LeadsStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Closed",
];

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const SOURCE_OPTIONS: LeadsSource[] = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Google Search",
  "Google Ads",
  "Email Campaign",
  "Cold Call",
  "Trade Show",
  "Webinar",
  "Partner",
  "Walk-in",
  "WhatsApp",
  "Messenger",
  "Personal Network",
  "Direct Conversation",
  "Networking Event",
  "Conference",
  "Friend",
  "Family",
  "Other",
]

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

type LeadForm = Partial<
    Omit<Lead, "id" | "created_at" | "owner_id" | "org_id" | "owner_name" | "full_name">
  >;

export default function Leads() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const {items: leads, loading, loaded,  error } = useSelector((state: RootState) => state.leads);
  const dispatch = useDispatch<AppDispatch>();
  // const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<LeadForm>({});
  const [dropResult, setDropResult] = useState<DropResult | null>(null)
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openEditConfirmation, setOpenEditConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [search, setSearch] = useState<Record<LeadsStatus, string>>({
    New: '',
    Contacted: '',
    Qualified: '',
    Closed: '',
  });
  useEffect(() => {
    
    if (loaded) return;
    
    let mounted = true;
  
    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
  
        if (!mounted) return;
  
        const token = session?.access_token;
  
        if (token) {
          dispatch(fetchLeads(token));
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    load();
  
    return () => {
      mounted = false;
    };
  }, [loaded, dispatch]);


  const handleOpenDelete = (lead: Lead) => {
    setSelectedLead(lead); 
    setOpenDelete(true);
    };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  }
  const handleOpenEditConfirmation = () => {
    setOpenEditConfirmation(true);
  }
  const handleCloseEditConfirmation = () => {
    setOpenEditConfirmation(false);
  } 
  const handleOpenAddContact = (result: DropResult) => {
    setOpenAddContact(true);
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadsStatus;
    const oldStatus = result.source.droppableId as LeadsStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (newStatus === oldStatus) return;
  }

  const handleCloseAddContact = (result: DropResult) => {
    const leadId = result.draggableId;
    const oldStatus = result.source.droppableId as LeadsStatus;

    const newStatus = oldStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    dispatch(moveLeadLocally({id: leadId, newStatus}));
    setOpenAddContact(false);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteLead(id));
  };

  const handleOpenEdit = (lead: Lead) => {
    setForm({
      title: lead.title,
      first_name: lead.first_name,
      last_name: lead.last_name,
      suffix: lead.suffix,
      gender: lead.gender as Gender,
      birth_date: lead.birth_date || null || '',
      email: lead.email,
      phone: lead.phone,
      company_name: lead.company_name || '',
      position: lead.position || '',
      department: lead.department || '',
      source: lead.source as LeadsSource,
      status: lead.status as LeadsStatus,
      priority: lead.priority as Priority,
      notes: lead.notes || '',
    });
    setEditingLead(lead);
    setIsEditing(true);
    setEdit(false);
  };

  const handleCloseEdit = () => {
    setEdit(false);
    setIsEditing(false);
    setOpenEditConfirmation(false);
  } 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditable = () => {
    setEdit(true);
  }
  const handleNotEditable = () => {
    setEdit(false);
  }
  const handleEdit = () => {
    setEdit(false);
    if (!editingLead) return;

    const leadId = editingLead.id;

    dispatch(updateLead({ id: leadId, lead: form as Lead }));
    setIsEditing(false);
  };

  const handleMouseEnter = (
    event: React.MouseEvent<SVGSVGElement | null>,
    lead: Lead
  ) => {
    setAnchorEl(event.currentTarget as SVGSVGElement);
    setHoveredLead(lead);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setHoveredLead(null);
  };

  const handleAddContact = (result: DropResult) => {

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadsStatus;
    const oldStatus = result.source.droppableId as LeadsStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    
    if (newStatus === oldStatus) return;

    if (newStatus === 'Qualified') {
      dispatch(updateLead({id: leadId, lead: {...lead, status:newStatus}}));
      dispatch(addContactFromLeads({
        lead_id: lead.id,
        first_name: lead.first_name,
        last_name: lead.last_name,
        suffix: lead.suffix,
        gender: lead.gender,
        birth_date: lead.birth_date,
        email: lead.email,
        phone: lead.phone,
        company_name: lead.company_name,
        position: lead.position,
        department: lead.department,
        source: lead.source,
        priority: lead.priority,
        notes: lead.notes,
      }));
      navigate('/app/contacts');
    }
  }

  const handleDragEnd = (result: DropResult) => {
    setDropResult(result);

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadsStatus;
    const oldStatus = result.source.droppableId as LeadsStatus;

    if (newStatus === oldStatus) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (oldStatus === 'Qualified' && newStatus === 'New' || newStatus === 'Contacted' ) {
      alert(`This lead is already in Contacts, Unable to change the status back to '${newStatus}'`)
      return;
    }
    if (oldStatus === 'Qualified' && newStatus === 'Closed'  ) {
      alert(`This lead is already in Contacts, Unable to change the status to '${newStatus}'. Please proceed to change the status in Contacts Instead`)
      return;
    }
    if (oldStatus === 'Closed' &&  newStatus === 'New'  ) {
      alert(`This lead is already in already Existed, Unable to change the status back to '${newStatus}'`)
      return;
    }
    dispatch(moveLeadLocally({id: leadId, newStatus}));
    
    if (newStatus === 'Qualified') {
      handleOpenAddContact(result);
    } else {
      dispatch(updateLead({id: leadId, lead: {...lead, status:newStatus}}));
    }
  };
  

  const getLeadsByStatus = (status: LeadsStatus) => {
    const query = search[status].toLowerCase().trim();

    return leads
      .filter((lead) => lead.status === status)
      .filter((lead) => {
        if (!query) return true;

        const searchableText = [
          lead.first_name,
          lead.last_name,
          lead.suffix,
          lead.email,
          lead.phone,
          lead.title,
          lead.notes
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age <= 0) {
      return '—';
    }
    return age;
  };

  return (
    <Box sx={{height: 1200}}>
      {error && (
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      )}
      <Box sx={{
        display: 'flex', 
        justifyContent: 'space-between', 
        pb: 2, 
        ml: '3vw', 
        mr: '3vw', 
        overflowY: 'auto' }}>
        <Typography marginLeft={1} variant="h5" fontWeight={700}>
          Leads
        </Typography>
        <Button variant="contained" onClick={() => navigate(`/app/addlead`)}>
          Add lead
        </Button>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{display: 'flex', gap: 2, pb: 2, ml: '3vw', mr: '3vw', overflowY: 'auto' }}>
          {COLUMNS.map((column) =>(
            <Box
              key={column}
              sx={{ minWidth: 260, flex: 1}}
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
                <TextField 
                  size="small"
                  value={search[column]}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      [column]: e.target.value,
                    }))
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment sx={{paddingRight: '1px'}} position="end">
                          <SearchIcon sx={{backgroundColor: '#c7c7c785', borderRadius: 10, p: 0.3, color: '#383838'}} fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    backgroundColor: '#ffffffd8',
                    borderRadius: 5,
                    mx: 2,
                    color: '#383838',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiOutlinedInput-root': {
                      paddingRight: '4px !important',
                    },
                    '& .MuiInputBase-input': {
                      py: '2px',
                      paddingLeft: '15px',
                      paddingRight: 0,
                      color: 'black'
                    },
                  }}>
                    <SearchIcon/>
                </TextField>
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
                      minHeight: 500,
                      bgcolor: snapshot.isDraggingOver
                        ? 'action.hover'
                        : 'background.paper',
                      border: 1,
                      borderTop: 0,
                      overflowY: 'auto',
                      borderColor: 'divider',
                      borderRadius: '0 0 8px 8px',
                      p: 1,
                      transition: 'background-color 0.2s ease',
                      height: 1000,
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
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, display: 'flex' }}>
                              <Box sx={{ width: 60}}>
                                <Box sx={{width: 50, height: 50, mt: 1, border: '1px solid #a3a3a3', borderRadius: 100}}>
                                  <PersonIcon sx={{width: '100%', height: '90%', opacity: 0.7}}/>
                                </Box>
                              </Box>
                              <Box flex={'1'}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography fontWeight={600} variant="body2">
                                  {lead.title.length > 25
                                    ? `${lead.title.slice(0, 25)}...`
                                    : lead.title}
                                  </Typography>
                                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    {lead.priority === 'High' ? (
                                    <PriorityIcon 
                                    sx={{
                                      fontSize: '15px',
                                      mr: 1, 
                                      color: PRIORITY_COLORS['High'],
                                      border: `1px solid ${PRIORITY_COLORS['High']}`,
                                      borderRadius: 20,
                                    }}/>
                                  ) : lead.priority === 'Highest' ? (
                                    <PriorityIcon sx={{
                                      fontSize: '15px',
                                      mr: 1, 
                                      color: PRIORITY_COLORS['Highest'],
                                      border: `1px solid ${PRIORITY_COLORS['Highest']}`,
                                      borderRadius: 20,
                                    }} />
                                  ) : null}
                                    <VisibilityIcon 
                                    sx={{cursor: 'pointer', opacity: 0.6}}
                                    onMouseEnter={(e) => handleMouseEnter(e, lead)}
                                    onMouseLeave={handleMouseLeave}
                                  />
                                  </Box>
                                  
                                </Box>
                                <Box sx={{ display: 'flex'}}>
                                    <Typography variant="caption" color="text.secondary">
                                    {lead.first_name} {lead.last_name} {lead.suffix} 
                                  </Typography>
                                </Box>
                                
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
                                    {lead.notes.length > 40
                                    ? `${lead.notes.slice(0, 40)}...`
                                    : lead.notes}
                                  </Typography>
                                )}
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mt: 1,
                                }}>
                                  <Box sx={{
                                    display: 'flex',
                                    gap: 1,
                                    
                                    '& .MuiButton-root': {
                                      minWidth: 30,
                                      padding: '1px 2px',
                                      fontSize: '0.75rem',
                                    }
                                  }}>
                                    <IconButton>
                                      <EmailIcon
                                        titleAccess="Email lead"
                                        fontSize="small"
                                        onClick={() => setOpenSnackbar(true)}
                                        sx={{cursor: 'pointer', color: 'primary.main'}}
                                      />
                                    </IconButton>
                                    <IconButton>
                                      <CallIcon
                                        onClick={() => setOpenSnackbar(true)}
                                        titleAccess="Call lead"
                                        fontSize="small"
                                        sx={{cursor: 'pointer', color: 'primary.main'}}
                                      />
                                    </IconButton>
                                    <IconButton>
                                      <SmsIcon
                                        onClick={() => setOpenSnackbar(true)}
                                        titleAccess="Message lead"
                                        fontSize="small"
                                        sx={{cursor: 'pointer', color: 'primary.main'}}
                                      />
                                    </IconButton>
                                  </Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenEdit(lead)}
                                    >
                                      <InfoIcon titleAccess="Full details" fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleOpenDelete(lead)}
                                    >
                                      <DeleteIcon titleAccess="Delete lead" fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box> 
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
      <Dialog sx={{position: "absolute"}} open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle sx={{fontWeight: 700}}>
          CONFIRMATION
        </DialogTitle>

        <DialogContent
          sx = {{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            maxwidth: 600,
          }}
          >
            Are you sure you want to delete this lead: <b>{selectedLead?.first_name} {selectedLead?.last_name}?</b>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="error"
              onClick={() => {
                if (selectedLead) {
                  handleDelete(selectedLead.id);
                }
                handleCloseDelete();
              }}
              >
                Yes
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog  sx={{position: "absolute", }} maxWidth="md" open={isEditing} onClose={handleCloseEdit}>
          <DialogActions sx={{
            '& .MuiButton-root': {
              fontSize: '0.75rem',
              padding: '2px 3px',
              minWidth: 30,
              marginRight: 1,
            },
          }}>
            <Button size="small" >  
              <EditIcon 
              onClick={handleEditable}
              titleAccess="Edit" 
              sx={{ fontSize: 20}}  />
            </Button>
            <Button size="small" sx={{ m: 0}}>
              <CloseIcon 
              color="error"
              onClick={handleCloseEdit}
              titleAccess="Close" 
              sx={{ 
                backgroundColor: '#e45353',
                color: 'white', 
                borderRadius: 1, 
                p: 0.5}}    />
            </Button>
          </DialogActions>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            border: '1px solid #ccc',
            borderRadius: 3,
            p: 2,
            mx: 5,
            mb: 3,
          }}>
              
              <DialogContent
                sx = {{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mt: 1,
                  width: {
                    xs: 300,
                    sm: 450,
                    md: 650,
                    lg: 800
                  },
                }}>
                <Box sx={{
                  display: "flex",
                  width: '100%',
                  flexDirection: 'column',
                  justifyContent: "center",
                  gap: 1,
                  '& .MuiTextField-root': {
                      userSelect: edit === true ? 'auto' : 'none',
                    },
                }}>
                  <Typography variant="h6" fontWeight={700}>
                  Personal Details
                  </Typography>
                  <Box sx={{
                    display: "flex",
                    width: '100%',
                    justifyContent: "space-between",
                    gap: 1,
                  }}>
                    <TextField
                      disabled={!edit}
                      label="First Name"
                      name="first_name"
                      required
                      value={form.first_name}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        fontSize: 13,
                        width: '50%'
                      }}
                    />

                    <TextField
                      disabled={!edit}
                      label="Last Name"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
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
                      disabled={!edit}
                      label="Suffix"
                      name="suffix"
                      onChange={handleChange}
                      value={form.suffix}
                      size="small"
                      sx={{
                        fontSize: 13,
                        width: '50%'
                      }}
                    />

                    <TextField
                      disabled={!edit}
                      type="tel"
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        fontSize: 13,
                        width: '50%'
                      }}
                    />
                  </Box>
                  
                  <TextField
                    disabled={!edit}
                    label="Email"
                    name="email"
                    value={form.email}
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
                      select
                      disabled={!edit}
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
                      disabled={!edit}
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
                  <Typography variant="h6" fontWeight={700} mt={2}>
                    Professional Details
                  </Typography>
                  <TextField
                    disabled={!edit}
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
                      disabled={!edit}
                      label="Department"
                      name="department"
                      value={form.company_name}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        fontSize: 13,
                        width: '50%'
                      }}
                    />

                    <TextField
                      disabled={!edit}
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
                  <Typography variant="h6" fontWeight={700} mt={2}>
                    Additional Details
                  </Typography>
                  <TextField
                    disabled={!edit}
                      label="Title"
                      value={form.title}
                      name="title"
                      required
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      rows={3}
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
                      disabled={!edit}
                      label="Source"
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={{
                        fontSize: 13,
                      }}
                    >
                      {SOURCE_OPTIONS.map((source) => (
                        <MenuItem key={source} value={source}>
                          {source}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      disabled={!edit}
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
                      disabled={!edit}
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
                      required
                      disabled={!edit}
                      value={form.notes}
                      onChange={handleChange}
                      size="small"
                      multiline
                      rows={3}
                      sx={{
                        fontSize: 13,
                      }}
                  />    
              </Box > 
              </DialogContent>
              <DialogActions sx={{ display: edit === true ? 'flex' : 'none'}}>
                <Button onClick={handleNotEditable}>
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    handleOpenEditConfirmation();
                  }}
                  >
                  Submit
                </Button>
              </DialogActions>
              </Box>
          
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openAddContact} onClose={handleCloseAddContact}>
          <DialogTitle sx={{fontWeight: 700}}>
            CONFIRMATION
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxwidth: 600,
            }}
            >
              Moving this to Qualified will automatically added as Contact
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                  if (!dropResult) return;
                  handleCloseAddContact(dropResult);
                }}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  if (!dropResult) return;
                  handleAddContact(dropResult);
                }}
              >
                Proceed
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openEditConfirmation} onClose={handleCloseEditConfirmation}>
          <DialogTitle sx={{fontWeight: 700}}>
            CONFIRMATION
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxwidth: 600,
            }}
            >
              Are you sure you want to edit this lead?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditConfirmation}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  handleCloseEditConfirmation();
                  handleEdit();
                }}
              >
                Yes
              </Button>
          </DialogActions>
        </Dialog>
        <Popover
          disableRestoreFocus
          sx={{ pointerEvents: 'none' }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMouseLeave}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Card sx={{ p: 2, width: 350,
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
              }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 75
            }}>
              <Box sx={{
                height: '100%',
                width: 75,
                border: '1px solid #ccc',
                borderRadius: 50,
              }}>
                <PersonIcon sx={{width: '100%', height: '90%', opacity: 0.8}}/>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" fontWeight={700}>
                  {hoveredLead?.first_name} {hoveredLead?.last_name} {hoveredLead?.suffix}
                  {hoveredLead?.priority === 'High' ? (
                  <PriorityIcon 
                  sx={{
                    fontSize: '15px',
                    ml: 1, 
                    color: PRIORITY_COLORS['High'],
                    border: `1px solid ${PRIORITY_COLORS['High']}`,
                    borderRadius: 20,
                  }}/>
                ) : hoveredLead?.priority === 'Highest' ? (
                  <PriorityIcon sx={{
                    fontSize: '15px',
                    ml: 1, 
                    color: PRIORITY_COLORS['Highest'],
                    border: `1px solid ${PRIORITY_COLORS['Highest']}`,
                    borderRadius: 20,
                  }} />
                ) : null}
                </Typography>

                <Typography variant="body2">
                  {!hoveredLead?.email ? '————' : hoveredLead?.email}
                </Typography>

                <Typography variant="body2">
                  {!hoveredLead?.phone ? '————' : hoveredLead?.phone}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="body2">
                  {hoveredLead?.gender === 'Prefer not to say' ? '————' : hoveredLead?.gender }
                </Typography>
                <Typography variant="body2">
                  Age: {!hoveredLead?.birth_date
                  ? '0'
                  : calculateAge(hoveredLead.birth_date)}

                </Typography>
              </Box>
            </Box>
            <Divider sx={{mt: 2, mb: 1}}></Divider>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              opacity: 0.3
            }}>
              <Typography variant="body2">Facebook: facebook.com/username</Typography>
              <Typography variant="body2">Instagram: @username</Typography>
              <Typography variant="body2">TikTok: @username</Typography>
              <Typography variant="body2">Telegram: @username</Typography>
              <Typography variant="body2">WhatsApp: +63 XXX XXX XXXX</Typography>
              <Typography variant="body2">Viber: +63 XXX XXX XXXX</Typography>
            </Box>
            <Divider sx={{mt: 2, mb: 1}}></Divider>
            <Typography marginBottom={1} variant="body1" fontWeight={700}>
              {hoveredLead?.title.toUpperCase()}
            </Typography>
            <Typography variant="body2">
              {hoveredLead?.notes}
            </Typography>
          </Card>
        </Popover>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="This feature is coming soon!"
        />
    </Box>
  );
}
