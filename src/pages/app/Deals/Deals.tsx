import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { supabase } from "../../../services/supabase";
import { useNavigate } from "react-router-dom";
import {
  fetchDeals,
  deleteDeal,
  moveDealLocally,
  updateDeal
} from '../../../store/dealsSlice';
import {
  fetchContacts
} from '../../../store/contactsSlice';
import type { Deal, DealStage } from '../../../types/deal';
import type { Contact, Priority } from '../../../types/contact';

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
  Paper,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Popover,
  IconButton,
  Divider,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from '@mui/icons-material/Info';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import HandshakeIcon from "@mui/icons-material/Handshake";
import AddIcon from '@mui/icons-material/Add';

const STAGES: DealStage[] = [
  'Prospecting',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];


const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

export default function Deals() {
  const { items: deals, loading, loaded, error } = useSelector(
    (state: RootState) => state.deals);
  const { 
    items: contacts, 
    loaded: contactsLoaded, 
  } = useSelector(
  (state: RootState) => state.contacts);

  const dispatch = useDispatch<AppDispatch>();;
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const [hoveredDeal, setHoveredDeal] = useState<Deal | null>(null);
  const [showDetails, setShowDetails] = useState<Contact | null>(null);
  const [search, setSearch] = useState<Record<DealStage, string>>({
      Prospecting: '',
      Proposal: '',
      Negotiation: '',
      'Closed Won': '',
      'Closed Lost': '',
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
         dispatch(fetchDeals(token));
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

 useEffect(() => {
   if (contactsLoaded) return;
 
   let mounted = true;
 
   const load = async () => {
     try {
       const {
         data: { session },
       } = await supabase.auth.getSession();
 
       if (!mounted) return;
 
       const token = session?.access_token;
 
       if (token) {
         dispatch(fetchContacts(token));
       }
     } catch (err) {
       console.error(err);
     }
   };
 
   load();
 
   return () => {
     mounted = false;
   };
 }, [contactsLoaded, dispatch]);

  const handleMouseEnter = (
    event: React.MouseEvent<SVGSVGElement | null>,
    deal: Deal
  ) => {
    setAnchorEl(event.currentTarget as SVGSVGElement);
    setHoveredDeal(deal);
    const contact = contacts.find((c) => (c.id === deal.contact_id))

    if (!contact) return null;
    
    setShowDetails(contact);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setHoveredDeal(null);
  };

  const handleOpenDelete = (deal: Deal) => {
      setSelectedDeal(deal); 
      setDeleteOpen(true);
      };
    const handleCloseDelete = () => {
      setDeleteOpen(false);
    }
  
  const handleDragEnd = (result: DropResult) => {
  
      if (!result.destination) return;
  
      const dealId = result.draggableId;
      const newStage = result.destination.droppableId as DealStage;
      const oldStage = result.source.droppableId as DealStage;
  
      if (newStage === oldStage) return;
  
      const deal = deals.find((d) => d.id === dealId);

      if (!deal) return;
      dispatch(moveDealLocally({id: dealId, newStage}));

        dispatch(updateDeal({id: dealId, deal: {...deal, stage: newStage}}));
    };
  
  const getDealsByStage = (stage: DealStage) => {
      const query = search[stage].toLowerCase().trim();
  
      return deals
        .filter((deal) => deal.stage === stage)
        .filter((deal) => {
          if (!query) return true;

          const contact = contacts.find((contact) => contact.id === deal.contact_id)


  
          const searchableText = [
            deal.title,
            deal.notes,
            contact?.first_name,
            contact?.last_name,
            contact?.suffix
          ]
            .join(' ')
            .toLowerCase();
  
          return searchableText.includes(query);
        });
    };

  const handleDeleteConfirm = () => {
    if (selectedDeal) dispatch(deleteDeal(selectedDeal.id));
    setDeleteOpen(false);
    setSelectedDeal(null);
  };


  const getStageValue = (stage: DealStage) => 
    getDealsByStage(stage).reduce((sum, d) => sum + d.value, 0);


  const PRIORITY_COLORS: Record<Priority, string> = {
    Highest: '#df3232',
    High: '#cc9e1fd0',
    Low: '#ffffff00',
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


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, height: 850 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1,
        mx: '3vw',
      }}>
        <Typography variant="h5" fontWeight={700}>
          Deals
        </Typography>
        <IconButton
          title="Add Deal"
          onClick={() => navigate(`/app/adddeal`)}
          sx={{
          fontSize: 12,
          py: 1,
          px: 2,
          pl: 1,  
          border: '1px solid #bbbbbb88',
          borderRadius: 2,
          fontWeight: 700
        }}>
          <AddIcon sx={{fontSize: '14px', fontWeight: 700, marginRight: "-3px"}}/>
          <HandshakeIcon/>
        </IconButton>
      </Box>
      <Paper 
        sx={{
          overflow: 'auto', 
          width: '90vw', 
          mb: 2,  
          p: '10px', 
          borderRadius: 2, 
          display: 'flex', 
          justifySelf: 'center'
          }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{display: 'flex', gap: 2,  width: '100%' }}>
            {STAGES.map((stage) => {

              const stageDeals = getDealsByStage(stage);
              const stageValue = getStageValue(stage);

              return (
                <Box key={stage} sx={{ minWidth: 300, flex: 1 }}> 
                  <Box
                    sx={{
                      border: '1px solid #cccccc5b',
                      px: 2,
                      py: 1.5,
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography fontWeight={700} variant="h6">
                        {stage}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {formatCurrency(stageValue)}
                      </Typography>
                      <Chip
                      label={stageDeals.length}
                      size="small"
                      />
                    </Box>
                    <TextField 
                      size="small"
                      value={search[stage]}
                      onChange={(e) =>
                        setSearch((prev) => ({
                          ...prev,
                          [stage]: e.target.value,
                        }))
                      }
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment sx={{paddingRight: '1px'}} position="end">
                              <SearchIcon sx={{ borderRadius: 10, p: 0.3, color: '#383838'}} fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        border: '1px solid #cecece8f',
                        borderRadius: 4,
                        mt: 1,
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
                    
                  </Box>
                  <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        minHeight: 300,
                        bgcolor: snapshot.isDraggingOver
                          ? 'action.hover'
                          : 'background.paper',
                        border: '1px solid #cccccc5b' ,
                        borderTop: 0,
                        overflowY: 'auto',
                        borderColor: 'divider',
                        borderRadius: '0 0 8px 8px',
                        p: 1,
                        transition: 'background-color 0.2s ease',
                        height: 850,
                      }}
                    >
                      {getDealsByStage(stage).map((deal, index) => {
                        const contact = contacts.find((c) => c.id === deal.contact_id)
                        if (!contact) return;

                        return (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
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
                                <Box flex={'1'} >
                                  <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography fontWeight={600} variant="body2">
                                    {(deal.title.length > 25
                                      ? `${deal.title.slice(0, 25)}...`
                                      : deal.title).toUpperCase()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                      <Typography variant="body2">
                                        {contact.first_name} {contact.last_name} {contact.suffix}
                                      </Typography>
                                      <IconButton sx={{p: '8px', border: '1px solid #bbbbbb88', borderRadius: 10,}}>
                                        <PersonIcon 
                                          sx={{fontSize: 20, cursor: 'pointer'}} 
                                          onMouseEnter={(e) => handleMouseEnter(e, deal)}
                                          onMouseLeave={handleMouseLeave}
                                        />
                                      </IconButton>
                                  </Box>
                                  
                                  <Typography variant="caption">
                                    (owner name, to be updated)
                                  </Typography>
                                  {deal.notes && (
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
                                      {deal.notes.length > 40
                                      ? `${deal.notes.slice(0, 40)}...`
                                      : deal.notes}
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
                                    }}>
                                      <IconButton sx={{p: '1px 5px'}}>
                                        <EmailIcon
                                          titleAccess="Email lead"
                                          onClick={() => setOpenSnackbar(true)}
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 18}}
                                        />
                                      </IconButton>
                                      <IconButton sx={{p: '1px 5px'}}>
                                        <CallIcon
                                          onClick={() => setOpenSnackbar(true)}
                                          titleAccess="Call lead"
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 18}}
                                        />
                                      </IconButton>
                                      <IconButton sx={{p: '1px 5px'}}>
                                        <SmsIcon
                                          onClick={() => setOpenSnackbar(true)}
                                          titleAccess="Message lead"
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 18}}
                                        />
                                      </IconButton>
                                    </Box>
                                    <Box sx={{
                                      backgroundColor: '#3ce058', 
                                      color: 'white', p: '0 10px', 
                                      borderRadius: 1,
                                      display: 'flex', 
                                      alignItems: 'center'}}>
                                      <Typography fontWeight={700}>
                                        {formatCurrency(deal.value)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex' }}>
                                      <IconButton
                                      size="small"
                                      onClick={()=> (navigate(`/app/contacts/${contact.id}`, {
                                        state: {
                                          scrollTo: `${deal.id}`,
                                        },
                                      }))}
                                    >
                                      <InfoIcon titleAccess="Full details" fontSize="small" />
                                    </IconButton>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleOpenDelete(deal)}
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
                        )
                    })}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
                </Box>
              )
          })}
          </Box>
        </DragDropContext>
      </Paper>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        sx={{opacity: 0.3}}
      >
        <DialogTitle>Delete deal?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedDeal?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDelete}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
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
              maxHeight: 500,
              overflow: 'auto'
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
                {showDetails?.first_name} {showDetails?.last_name} {showDetails?.suffix}
                {showDetails?.priority === 'High' ? (
                <PriorityIcon 
                sx={{
                  fontSize: '15px',
                  ml: 1, 
                  color: PRIORITY_COLORS['High'],
                  border: `1px solid ${PRIORITY_COLORS['High']}`,
                  borderRadius: 20,
                }}/>
              ) : showDetails?.priority === 'Highest' ? (
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
                Email: {!showDetails?.email ? '————' : showDetails?.email}
              </Typography>

              <Typography variant="body2">
                Phone: {!showDetails?.phone ? '————' : showDetails?.phone}
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="body2">
                {showDetails?.gender === 'Prefer not to say' ? '————' : showDetails?.gender }
              </Typography>
              <Typography variant="body2">
                Age: {!showDetails?.birth_date
                ? '0'
                : calculateAge(showDetails.birth_date)}

              </Typography>
            </Box>
          </Box>
          <Divider sx={{mt: 2, mb: 1}}></Divider>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
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
            {hoveredDeal?.title.toUpperCase()}
          </Typography>
          <Typography marginBottom={1} variant="body1" fontWeight={700}>
            {formatCurrency(Number(hoveredDeal?.value))}
          </Typography>
          <Typography variant="body2">
            {hoveredDeal?.notes}
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