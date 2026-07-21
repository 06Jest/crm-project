import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { useNavigate } from "react-router-dom";
import {
  deleteDeal,
  moveDealLocally,
  // updateDeal,
  updateDealStage,
  updateDeal,
  fetchDealsLists,
  clearError
} from '../../../store/dealsSlice';
import { DEAL_STAGES, type Deal, type DealStage, type UpdateDeal } from '../../../types/deal';
import type { Contact } from '../../../types/contact';

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
  Snackbar,
  CircularProgress,
  Chip,
  Popover,
  IconButton,
  Divider,
  InputAdornment,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from "@mui/icons-material/Person";
// import InfoIcon from '@mui/icons-material/Info';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import HandshakeIcon from "@mui/icons-material/Handshake";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { Priority } from '../../../types/global';
import ErrorAlert from '../../../components/Error';
import { formatCurrency } from '../../../utils/formatCurrency';
import { calculateAge } from '../../../utils/calculateAge';

import { fetchContactsLists } from '../../../store/contactsSlice';
import { formatName, formatTitle } from '../../../utils/formatText';

 const PRIORITY_COLORS: Record<Priority, string> = {
    Highest: '#df3232',
    High: '#cc9e1fd0',
    Low: '#ffffff00',
  }

type DealForm = Partial<UpdateDeal>;

export default function Deals() {
  const { items: deals, loading, loaded, error } = useSelector(
    (state: RootState) => state.deals);
  const { 
    items: contacts,
    loaded: loadedContacts,
    loading: loadingContacts
  } = useSelector(
  (state: RootState) => state.contacts);

  const dispatch = useDispatch<AppDispatch>();;
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [dragResult, setDragResult] = useState<DropResult>()
  const [editingDeal, setEditingDeal] = useState<Deal | null>();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [hoveredDeal, setHoveredDeal] = useState<Deal | null>(null);
  const [showDetails, setShowDetails] = useState<Contact | null>(null);
  const [invalid, setInvalid] = useState('');
  const [form, setForm] = useState<DealForm>({});
  const [search, setSearch] = useState<Record<DealStage, string>>({
      Prospecting: '',
      Proposal: '',
      Negotiation: '',
      'Closed Won': '',
      'Closed Lost': '',
    });


  useEffect(() => {
    if (loading || loadingContacts) return;

      const loadData = async () => {
        try {
          const promises = [];

          if (!loaded) {
            promises.push(dispatch(fetchDealsLists()).unwrap());
          }

          if (!loadedContacts) {
            promises.push(dispatch(fetchContactsLists()).unwrap());
          }

          await Promise.all(promises);
        } catch {
        //Error in State
      }
    };
    loadData();
  }, [
    loaded,
    loading,
    loadedContacts,
    loadingContacts,
    dispatch,
  ]);


  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    deal: Deal
  ) => {
    setAnchorEl(event.currentTarget);
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

  
  const handleDragEnd = async (result: DropResult) => {
  
      if (!result.destination) return;
  
      const dealId = result.draggableId;
      const newStage = result.destination.droppableId as DealStage;
      const oldStage = result.source.droppableId as DealStage;
  
      if (newStage === oldStage) return;
  
      const deal = deals.find((d) => d.id === dealId);
      if (!deal) return;
      if (
        oldStage === 'Closed Won' &&
        ['Prospecting', 'Proposal', 'Negotiation', 'Closed Lost'].includes(newStage)
      ) {
        const message =
          newStage === 'Closed Lost'
            ? `This Deal is already saved in Statistics. Unable to change the stage to '${newStage}'. To hide, please archived it instead.`
            : `This Deal is already in marked as ${oldStage}. Unable to change the stage back to '${newStage}'.`;
  
        setInvalid(message);
        setTimeout(() => setInvalid(''), 3000);
        return;
      }
  
      if (oldStage === 'Closed Lost' && 
        ['Prospecting', 'Proposal', 'Negotiation', 'Closed Won'].includes(newStage))  {
        setInvalid(
          `This lead already exists and has already marked as ${oldStage}. Unable to change the status back to '${newStage}'.`
        );
        setTimeout(() => setInvalid(''), 3000);
        return;
      }
      if (newStage === 'Closed Won' || newStage === 'Closed Lost') {
        setConfirmClose(true);
        setDragResult(result);
        
      } else {
        dispatch(moveDealLocally({ id: dealId, newStage }));
        await dispatch(updateDealStage({ id: dealId, stage: newStage })).unwrap();
        dispatch(clearError())
      }
     
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

  const handleDeleteConfirm = async () => {
    if (selectedDeal) {
      if (loading) return;
      try {
        await dispatch(deleteDeal(selectedDeal.id)).unwrap();
        setDeleteOpen(false);
        setSelectedDeal(null);
        dispatch(clearError())
      } catch {
        //Error in state
      }
    } 
  };

  const handleClose = async() => {

    if (!dragResult) return;
    if (!dragResult.destination) return;

    const dealId = dragResult.draggableId;
    const newStage = dragResult.destination.droppableId as DealStage;
    await dispatch(updateDealStage({ id: dealId, stage: newStage })).unwrap();
  }


  const getStageValue = (stage: DealStage) => 
    getDealsByStage(stage).reduce((sum, d) => sum + d.value, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
      if (loading) return;
  
      try {
        if (!editingDeal) return;
  
        const dealId = editingDeal.id;
        await dispatch(updateDeal({ id: dealId, deal: form as UpdateDeal })).unwrap();
        setIsEditing(false);
        dispatch(clearError())
      } catch {
        //Error in state
      }
      
    };

  const handleOpenEdit = (deal: Deal) => {
      setForm({
        title: deal.title,
        value: deal.value,
        notes: deal.notes,
      });
      setEditingDeal(deal);
      setIsEditing(true);
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
        {(error  || invalid) && (
          <ErrorAlert
            message={(error  || invalid) ?? "An unknown error occurred."}
          />
        )}
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
          <AddIcon sx={{fontSize: '14px', fontWeight: 700, marginRight: "-5px"}}/>
          <HandshakeIcon/>
        </IconButton>
      </Box>
      <Box 
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
          <Box sx={{display: 'flex', gap: 1, pb: 2, overflow: 'auto',  width: '100%' }}>
            {DEAL_STAGES.map((stage) => {

              const stageDeals = getDealsByStage(stage);
              const stageValue = getStageValue(stage);

              return (
                <Box key={stage} sx={{ minWidth: 300, flex: 1 }}> 
                  <Box
                   sx={(theme) => ({
                    py: 1,
                    borderRadius: '3px 3px 0 0 ',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width:'100%',
                    bgcolor: theme.palette.mode === 'dark'
                      ? '#3a3a3a'
                      : '#d6d4d4d3',
                  })}
                  >
                    <Box sx={{display: 'flex', px: 2, alignItems: 'center',
                       width: '100%', justifyContent: 'space-between'}}>
                      <Typography fontWeight={700} variant="h6">
                        {stage}
                      </Typography>
                      <Typography
                        title={`Total possible value if won`}
                        variant="body2" sx={{ opacity: 0.85, cursor:'pointer' }}>
                        {formatCurrency(stageValue)}
                      </Typography>
                      <Chip
                      title={`${stage} Deals count`}
                      label={stageDeals.length}
                      size="small"
                      sx={{cursor: 'pointer'}}
                      />
                    </Box>
                    <Box sx={{px: 3, width: '100%'}}>
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
                          borderRadius: 4,
                          mt: 1,
                          width: '100%',
                          backgroundColor: '#ffffff',
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
                        overflowY: 'auto',
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
                                <Box sx={{display: 'flex', width: '100%'}}>
                                  <Box sx={{display: 'flex', flexDirection: 'column', width: '18%'}}>
                                    <Box 
                                      onMouseEnter={(e) => handleMouseEnter(e, deal)}
                                       onClick={()=> navigate(`/app/contacts/${contact.id}`)}
                                      onMouseLeave={handleMouseLeave}
                                      sx={{
                                        width: 42,
                                        height: 42,
                                        cursor: 'pointer',
                                        border: '1px solid #a3a3a3', 
                                        borderRadius: 100}}>
                                      <PersonIcon sx={{width: '100%', height: '90%', opacity: 0.7}}/>
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}} >
                                    <Box sx={{display: 'flex', width: '100%'}}>
                                      <Box sx={{display: 'flex', width: '90%', flexDirection: 'column'}}>
                                        <Typography sx={{cursor: 'pointer', fontSize: '16px'}} title="Deal Title" fontWeight={600}>
                                        {(deal.title.length > 25
                                          ? `${deal.title.slice(0, 25)}...`
                                          : formatTitle(deal.title).toUpperCase())}
                                        </Typography>
                                        <Typography sx={{cursor: 'pointer'}} title="Contact name" variant="body2">
                                          {formatName(contact.first_name, contact.last_name)} {contact.suffix}
                                        </Typography>
                                      </Box>
                                      <Box sx={{display: 'flex', width: '10%', flexDirection: 'column'}}>
                                        {/* <IconButton
                                          size="small"
                                          onClick={()=> (navigate(`/app/contacts/${contact.id}`, {
                                            state: {
                                              scrollTo: `${deal.id}`,
                                            },
                                          }))}
                                        >
                                          <InfoIcon titleAccess="Full details" fontSize="small" />
                                        </IconButton> */}
                                        <IconButton
                                          sx={{
                                            height: 25,
                                            width: 25,
                                            mr: '5px'
                                          }}
                                          size="small"
                                          onClick={() => handleOpenEdit(deal)}
                                        >
                                          <EditIcon titleAccess="Edit deal" sx={{fontSize: '14px'}} />
                                        </IconButton>
                                      </Box>
                                      
                                    </Box>
                                    <Box sx={{display: 'flex'}}>
                                      {deal.notes && (
                                      <Typography
                                        title="notes"
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                        sx={{
                                          mb: 1,
                                          wordBreak: 'break-word',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {deal.notes.length > 85
                                        ? `${deal.notes.slice(0, 85)}...`
                                        : deal.notes}
                                      </Typography>
                                      )}
                                      
                                    </Box>
                                  
                                  
                                    <Box sx={{
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      
                                      }}>
                                      <Typography 
                                      title="Deal Owner"
                                      color="text.secondary"
                                      sx={{ px: 1, py: '1px', 
                                        border: `1px solid`,
                                        borderColor: 'primary.main',
                                        color: 'primary.main',
                                        borderRadius: 10,
                                        fontSize: 10,
                                        cursor: 'pointer'
                                      }}
                                      >{formatName(deal.owner.first_name, deal.owner.last_name)}</Typography>
                                    </Box>
                                    <Box sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      mt: '3px',
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
                                      <Box 
                                        boxShadow={4}
                                        sx={{
                                          backgroundColor: 'primary.main', 
                                          color: '#FFFFFF', 
                                          p: '0 10px', 
                                          borderRadius: 1,
                                          display: 'flex', 
                                          cursor: 'pointer',
                                          alignItems: 'center'}}>
                                          <Typography variant='body2' title="Deal Value" fontWeight={700}>
                                            {formatCurrency(deal.value)}
                                          </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex' }}>
                                        
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
      </Box>
      <Dialog 
        sx={{position: "absolute" }} 
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '500px', // Custom width
            height: '300px',   // Custom height
          }
        }}
        open={isEditing}
        onClose={() => setIsEditing(false)}>
          <Box>
            {isEditing && error && (
              <ErrorAlert
                message={error}
              />
            )}
            <DialogContent>
              <Typography variant="h6" fontWeight={700} marginBottom={3}>
                Edit Deal
              </Typography>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                  <TextField
                    label="Title"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      width: '72%',
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    label="Value"
                    name="value"
                    required
                    value={form.value}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      width: '25%',
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <TextField
                    label="Notes"
                    name="notes"
                    required
                    value={form.notes}
                    onChange={handleChange}
                    size="small"
                    multiline
                    fullWidth
                    rows={3}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />   
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{mx: '15px', display: 'flex', justifyContent: 'space-between'}}>
              <Button onClick={() => {
                dispatch(clearError())
                setIsEditing(false)}
              }>
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={() => setConfirmEdit(true)}
                >
                Submit
              </Button>
            </DialogActions>
          </Box>
      </Dialog>
      <Dialog sx={{position: "absolute"}} open={confirmClose} 
        onClose={() => {
          setConfirmClose(false);
        }}>
        <DialogTitle sx={{fontWeight: 700}}>
          CONFIRMATION TO CLOSE
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
            Are you sure you want to update this deal to {dragResult?.destination?.droppableId}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setConfirmClose(false)
            }}>
              Cancel
            </Button>
            <Button 
              color="warning"
              variant="contained"
              onClick={() => {
                setConfirmClose(false)
                handleClose();
              }}
            >
              Yes
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog sx={{position: "absolute"}} open={confirmEdit} 
        onClose={() => {
          setConfirmEdit(false);
          setIsEditing(false);
        }}>
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
            Are you sure you want to edit this deal?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmEdit(false)}>
              Cancel
            </Button>
            <Button 
              color="warning"
              variant="contained"
              onClick={() => {
                setConfirmEdit(false)
                setIsEditing(false)
                handleEdit();
              }}
            >
              Yes
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <DialogTitle>Delete deal?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedDeal?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
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
        <Box
          display={'flex'} sx={{justifyContent: 'flex-end'}}>
          <IconButton 
            onClick={handleMouseLeave}
            sx={{cursor: 'pointer'}}>
            <CloseIcon sx={{fontSize: '15px'}}/>
          </IconButton>
        </Box>
        <Card
          sx={{ p: 2, pt: 0, width: 350,
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
              {showDetails?.email && (
              <Typography variant="body2">
                Email: {showDetails?.email}
              </Typography>
              )}
              {showDetails?.phone && (
              <Typography variant="body2">
                Phone: { showDetails?.phone}
              </Typography>
              )}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {showDetails?.gender !== 'Prefer not to say' &&(
              <Typography variant="body2">
                {showDetails?.gender}
              </Typography>
              )}
              {showDetails?.birth_date && (
              <Typography variant="body2">
                Age: {!showDetails?.birth_date
                ? '0'
                : calculateAge(showDetails.birth_date)}
              </Typography>
              )}
            </Box>
          </Box>
          <Divider sx={{mt: 2, mb: 1}}></Divider>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            {showDetails?.facebook && (<Typography variant="body2">Facebook: facebook.com/{showDetails.facebook}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">Instagram: @{showDetails.instagram}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">TikTok: @{showDetails.tiktok}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">X/Twitter: @{showDetails.x}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">Facebook: linkedin.com/in/{showDetails.linkedin}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">Telegram: @{showDetails.telegram}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">WhatsApp: {showDetails.whatsapp}</Typography>)}
            {showDetails?.facebook && (<Typography variant="body2">Viber: {showDetails.viber}</Typography>)}
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