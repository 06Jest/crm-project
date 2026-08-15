import { useEffect, useRef, useState } from 'react';
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
import { DEAL_STAGES, type Deal, type DealListItem, type DealStage, type UpdateDeal } from '../../../types/deal';
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
  Chip,
  Popover,
  IconButton,
  Divider,
  InputAdornment,
  Skeleton,
  Fade,
  Grow,
  Tooltip,
  useMediaQuery,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchContactsLists } from '../../../store/contactsSlice';
import { formatName, formatTitle } from '../../../utils/formatText';

 const PRIORITY_COLORS: Record<Priority, string> = {
    Highest: '#df3232',
    High: '#cc9e1fd0',
    Low: '#ffffff00',
  }

const STAGE_COLORS: Record<DealStage, string> = {
  Prospecting: '#3b82f6',
  Proposal: '#8b5cf6',
  Negotiation: '#e08a1f',
  'Closed Won': '#1f9d55',
  'Closed Lost': '#d9424b',
};

type DealForm = Partial<UpdateDeal>;

function useInViewOnce(
  rootRef: React.RefObject<HTMLDivElement | null>,
  rootMargin = '500px'
) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    if (inView) return;

    const node = nodeRef.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        root: rootRef.current ?? null,
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [inView, rootMargin, rootRef]);

  return { nodeRef, inView };
}

function DealCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{ mb: 1, borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Box sx={{ display: 'flex', gap: 1.25 }}>
          <Skeleton variant="circular" width={42} height={42} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={16} />
            <Skeleton variant="rounded" width="80%" height={12} sx={{ mt: 1 }} />
            <Skeleton variant="rounded" width="35%" height={18} sx={{ mt: 1, borderRadius: 5 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface LazyColumnBodyProps {
  stage: DealStage;
  deals: DealListItem[];
  contacts: Contact[];
  stageColor: string;
  scrollRoot: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  onHoverEnter: (event: React.MouseEvent<HTMLDivElement>, deal: Deal) => void;
  onHoverLeave: () => void;
  onNavigateContact: (contactId: string) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
  onQuickAction: () => void;
}

function LazyColumnBody({
  stage,
  deals,
  contacts,
  stageColor,
  scrollRoot,
  reduceMotion,
  onHoverEnter,
  onHoverLeave,
  onNavigateContact,
  onEdit,
  onDelete,
  onQuickAction,
}: LazyColumnBodyProps) {
  const { nodeRef, inView } = useInViewOnce(scrollRoot);

  return (
    <Droppable droppableId={stage}>
      {(provided, snapshot) => (
        <Box
          ref={(node: HTMLDivElement | null) => {
            provided.innerRef(node);
            nodeRef.current = node;
          }}
          {...provided.droppableProps}
          sx={{
            minHeight: 300,
            bgcolor: snapshot.isDraggingOver
              ? `${stageColor}12`
              : 'background.paper',
            overflowY: 'auto',
            borderRadius: '0 0 8px 8px',
            p: 1,
            transition: reduceMotion ? 'none' : 'background-color 0.2s ease',
            height: 850,
          }}
        >
          {!inView ? (
            <>
              <DealCardSkeleton />
              <DealCardSkeleton />
              <DealCardSkeleton />
            </>
          ) : deals.length === 0 ? (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.5,
            }}>
              <Typography variant="body2" color="text.secondary">
                No deals here yet
              </Typography>
            </Box>
          ) : (
            <Fade in={inView} timeout={reduceMotion ? 0 : 400}>
              <Box>
                {deals.map((deal, index) => {
                  const contact = contacts.find((c) => c.id === deal.contact_id);
                  if (!contact) return null;

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
                          sx={(theme) => ({
                            mb: 1,
                            borderRadius: 2.5,
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#eaeaea'}`,
                            borderLeft: `3px solid ${stageColor}`,
                            boxShadow: snapshot.isDragging
                              ? '0 8px 20px rgba(0,0,0,0.18)'
                              : '0 1px 2px rgba(0,0,0,0.06)',
                            cursor: 'grab',
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            transition: reduceMotion ? 'none' : 'box-shadow 0.2s ease, transform 0.15s ease',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
                              transform: reduceMotion || snapshot.isDragging ? 'none' : 'translateY(-1px)',
                            },
                          })}
                        >
                          <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, display: 'flex' }}>
                            <Box sx={{display: 'flex', width: '100%'}}>
                              <Box sx={{display: 'flex', flexDirection: 'column', width: '18%'}}>
                                <Box 
                                  onMouseEnter={(e) => onHoverEnter(e, deal)}
                                   onClick={()=> onNavigateContact(contact.id)}
                                  onMouseLeave={onHoverLeave}
                                  sx={(theme) => ({
                                    width: 42,
                                    height: 42,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${stageColor}55`,
                                    bgcolor: theme.palette.mode === 'dark' ? '#2c2c2c' : `${stageColor}0d`,
                                    borderRadius: 100,
                                    transition: reduceMotion ? 'none' : 'border-color 0.15s ease',
                                    '&:hover': { borderColor: stageColor },
                                  })}>
                                  <PersonIcon sx={{width: '62%', height: '62%', opacity: 0.75}}/>
                                </Box>
                              </Box>
                              
                              <Box sx={{display: 'flex', flexDirection: 'column', flex: 1}} >
                                <Box sx={{display: 'flex', width: '100%'}}>
                                  <Box sx={{display: 'flex', width: '90%', flexDirection: 'column'}}>
                                    <Typography sx={{cursor: 'pointer', fontSize: '15px'}} title="Deal Title" fontWeight={700}>
                                    {(deal.title.length > 25
                                      ? `${deal.title.slice(0, 25)}...`
                                      : formatTitle(deal.title).toUpperCase())}
                                    </Typography>
                                    <Typography sx={{cursor: 'pointer'}} title="Contact name" variant="body2" color="text.secondary">
                                      {formatName(contact.first_name, contact.last_name)} {contact.suffix}
                                    </Typography>
                                  </Box>
                                  <Box sx={{display: 'flex', width: '10%', flexDirection: 'column'}}>
                                    <Tooltip title="Edit deal" arrow>
                                      <IconButton
                                        sx={{
                                          height: 25,
                                          width: 25,
                                          mr: '5px',
                                          transition: reduceMotion ? 'none' : 'background-color 0.15s ease',
                                          '&:hover': { bgcolor: `${stageColor}1f` },
                                        }}
                                        size="small"
                                        onClick={() => onEdit(deal)}
                                      >
                                        <EditIcon titleAccess="Edit deal" sx={{fontSize: '14px'}} />
                                      </IconButton>
                                    </Tooltip>
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
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                  }}
                                  >{formatName(deal.owner.profile.first_name, deal.owner.profile.last_name) ?? "unknown"}</Typography>
                                </Box>
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: '6px',
                                }}>
                                  <Box sx={{
                                    display: 'flex',
                                    gap: 0.25,
                                  }}>
                                    <Tooltip title="Email lead" arrow>
                                      <IconButton sx={{p: '4px', transition: reduceMotion ? 'none' : 'background-color 0.15s ease', '&:hover': { bgcolor: `${stageColor}1f` }}}>
                                        <EmailIcon
                                          titleAccess="Email lead"
                                          onClick={onQuickAction}
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 17}}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Call lead" arrow>
                                      <IconButton sx={{p: '4px', transition: reduceMotion ? 'none' : 'background-color 0.15s ease', '&:hover': { bgcolor: `${stageColor}1f` }}}>
                                        <CallIcon
                                          onClick={onQuickAction}
                                          titleAccess="Call lead"
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 17}}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Message lead" arrow>
                                      <IconButton sx={{p: '4px', transition: reduceMotion ? 'none' : 'background-color 0.15s ease', '&:hover': { bgcolor: `${stageColor}1f` }}}>
                                        <SmsIcon
                                          onClick={onQuickAction}
                                          titleAccess="Message lead"
                                          sx={{cursor: 'pointer', color: 'primary.main', fontSize: 17}}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  <Box 
                                    sx={{
                                      backgroundColor: 'primary.main', 
                                      color: '#FFFFFF', 
                                      p: '3px 10px', 
                                      borderRadius: 1.5,
                                      display: 'flex', 
                                      cursor: 'pointer',
                                      alignItems: 'center'}}>
                                      <Typography variant='body2' title="Deal Value" fontWeight={700} fontSize={13}>
                                        {formatCurrency(deal.value)}
                                      </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex' }}>
                                    <Tooltip title="Delete deal" arrow>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        sx={{ transition: reduceMotion ? 'none' : 'background-color 0.15s ease', '&:hover': { bgcolor: 'error.main', color: '#fff' } }}
                                        onClick={() => onDelete(deal)}
                                      >
                                        <DeleteIcon titleAccess="Delete lead" fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box> 
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
              </Box>
            </Fade>
          )}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}

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

  // UI-only additions: reduced-motion preference and the ref used as the
  // IntersectionObserver root so each column lazy-mounts as it scrolls
  // into view. Neither is read by, or affects, any business logic below.
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const boardScrollRef = useRef<HTMLDivElement>(null);


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

  const refreshDeals = async () => {
    try {
      await dispatch(fetchDealsLists()).unwrap();
    } catch {
      // Error handled by Redux state
    }
  }


  
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
    dispatch(moveDealLocally({ id: dealId, newStage }));
    await dispatch(updateDealStage({ id: dealId, stage: newStage })).unwrap();
    dispatch(clearError())
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
      <Box sx={{ pb: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: { xs: '92%', sm: '85vw' },
          justifySelf: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 2 }} />
            <Box>
              <Skeleton variant="text" width={90} height={28} />
              <Skeleton variant="text" width={170} height={16} />
            </Box>
          </Box>
          <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: 10 }} />
        </Box>
        <Box sx={{
          overflow: 'auto',
          width: '85vw',
          mb: 2,
          p: '10px',
          borderRadius: 2,
          display: 'flex',
          justifySelf: 'center'
        }}>
          <Box sx={{ display: 'flex', gap: 1.5, pb: 2, overflow: 'auto', width: '100%' }}>
            {DEAL_STAGES.map((stage) => (
              <Box
                key={stage}
                sx={{
                  minWidth: 300,
                  flex: 1,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Skeleton variant="rectangular" height={78} />
                <Box sx={{ p: 1 }}>
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ mb: 1, borderRadius: 2.5 }} />
                  <Skeleton variant="rounded" height={92} sx={{ borderRadius: 2.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
  

  return (
    <Box sx={{ pb: 2 }}>
      {(error || invalid) && (
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              order: { xs: 3, sm: 2 },
            }}
          >
            <ErrorAlert
              message={
                (error || invalid) ?? "An unknown error occurred."
              }
            />
          </Box>
        )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2 },
          width: { xs: "98%", sm: "84vw" },
          maxWidth: "100%",
          mx: "auto",
          px: { xs: 1, sm: 0 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.25 },
            minWidth: 0,
          }}
        >
          <Box
            sx={(theme) => ({
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark" ? "#2a2a2a" : "#eef1f6",
              color: "primary.main",
            })}
          >
            <HandshakeIcon
              sx={{
                fontSize: { xs: 20, sm: 24 },
              }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              letterSpacing={-0.3}
              lineHeight={1.2}
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                whiteSpace: "nowrap",
              }}
            >
              Deals
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {deals.length}{" "}
              {deals.length === 1 ? "deal" : "deals"} across your pipeline
            </Typography>
          </Box>
        </Box>

        <Box>
          <IconButton
            onClick={() => navigate(`/app/deals/adddeal`)}
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              backgroundColor: 'primary.main',
              borderRadius: "50%",
              flexShrink: 0,
              p: 0,
              color: 'white',

              "& svg": {
                fontSize: { xs: 20, sm: 22 },
              },

              transition: "transform 0.15s ease, box-shadow 0.15s ease",

              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
              },

              "&:active": {
                transform: "scale(0.96)",
              },
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={refreshDeals}
            disabled={loading}
            size="small"
            sx={{
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              color: "text.secondary",

              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={17} />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>
      <Box 
        ref={boardScrollRef}
        sx={{
          overflow: 'auto', 
          width: {md: '85vw', sm: '90vw', xs: '98vw' }, 
          mb: 2,  
          p: '10px', 
          borderRadius: 2, 
          display: 'flex', 
          justifySelf: 'center'
          }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{display: 'flex', gap: 1.5, pb: 2, overflow: 'auto',  width: '100%' }}>
            {DEAL_STAGES.map((stage, columnIndex) => {

              const stageDeals = getDealsByStage(stage);
              const stageValue = getStageValue(stage);
              const stageColor = STAGE_COLORS[stage];

              return (
                <Grow key={stage} in timeout={reduceMotion ? 0 : 250 + columnIndex * 80}>
                  <Box
                    sx={(theme) => ({
                      minWidth: 300,
                      flex: 1,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#3a3a3a' : '#e3e3e3'}`,
                      bgcolor: 'background.paper',
                    })}
                  >
                    <Box
                     sx={(theme) => ({
                      py: 1.25,
                      borderTop: `3px solid ${stageColor}`,
                      borderRadius: '3px 3px 0 0 ',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width:'100%',
                      bgcolor: theme.palette.mode === 'dark'
                        ? '#2c2c2c'
                        : `${stageColor}14`,
                    })}
                    >
                      <Box sx={{display: 'flex', px: 2, alignItems: 'center',
                         width: '100%', justifyContent: 'space-between', gap: 1}}>
                        <Typography fontWeight={700} variant="subtitle1" noWrap>
                          {stage}
                        </Typography>
                        <Typography
                          title={`Total possible value if won`}
                          variant="body2"
                          fontWeight={600}
                          sx={{ opacity: 0.85, cursor:'pointer', whiteSpace: 'nowrap' }}>
                          {formatCurrency(stageValue)}
                        </Typography>
                        <Chip
                        title={`${stage} Deals count`}
                        label={stageDeals.length}
                        size="small"
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          bgcolor: stageColor,
                          color: '#fff',
                          minWidth: 28,
                        }}
                        />
                      </Box>
                      <Box sx={{px: 2, width: '100%'}}>
                        <TextField 
                          size="small"
                          placeholder="Search this stage..."
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
                                  <SearchIcon sx={{ borderRadius: 10, p: 0.3, color: '#7a7a7a'}} fontSize="small" />
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
                              border: '1px solid #e2e2e2',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: stageColor,
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: stageColor,
                            },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              paddingRight: '4px !important',
                              transition: reduceMotion ? 'none' : 'border-color 0.15s ease',
                            },
                            '& .MuiInputBase-input': {
                              py: '6px',
                              paddingLeft: '12px',
                              paddingRight: 0,
                              color: 'black',
                              fontSize: 13,
                            },
                          }}>
                            <SearchIcon/>
                        </TextField>
                      </Box>
                    </Box>

                    <LazyColumnBody
                      stage={stage}
                      deals={stageDeals}
                      contacts={contacts}
                      stageColor={stageColor}
                      scrollRoot={boardScrollRef}
                      reduceMotion={reduceMotion}
                      onHoverEnter={handleMouseEnter}
                      onHoverLeave={handleMouseLeave}
                      onNavigateContact={(contactId) => navigate(`/app/contacts/${contactId}`)}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      onQuickAction={() => setOpenSnackbar(true)}
                    />
                  </Box>
                </Grow>
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
            borderRadius: 3,
          }
        }}
        transitionDuration={reduceMotion ? 0 : undefined}
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
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />   
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{mx: '15px', mb: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <Button
                onClick={() => {
                dispatch(clearError())
                setIsEditing(false)}
              }
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                disableElevation
                onClick={() => setConfirmEdit(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2.5,
                  transition: reduceMotion ? 'none' : 'transform 0.1s ease',
                  '&:active': { transform: reduceMotion ? 'none' : 'scale(0.97)' },
                }}
                >
                Submit
              </Button>
            </DialogActions>
          </Box>
      </Dialog>
      <Dialog
        sx={{position: "absolute"}}
        PaperProps={{ sx: { borderRadius: 3 } }}
        transitionDuration={reduceMotion ? 0 : undefined}
        open={confirmClose} 
        onClose={() => {
          setConfirmClose(false);
        }}>
        <DialogTitle sx={{fontWeight: 700}}>
          Confirm stage change
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
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button
              onClick={() => {
              setConfirmClose(false)
            }}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              color="warning"
              variant="contained"
              disableElevation
              onClick={() => {
                setConfirmClose(false)
                handleClose();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                transition: reduceMotion ? 'none' : 'transform 0.1s ease',
                '&:active': { transform: reduceMotion ? 'none' : 'scale(0.97)' },
              }}
            >
              Yes
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        sx={{position: "absolute"}}
        PaperProps={{ sx: { borderRadius: 3 } }}
        transitionDuration={reduceMotion ? 0 : undefined}
        open={confirmEdit} 
        onClose={() => {
          setConfirmEdit(false);
          setIsEditing(false);
        }}>
        <DialogTitle sx={{fontWeight: 700}}>
          Confirm edit
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
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={() => setConfirmEdit(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              color="warning"
              variant="contained"
              disableElevation
              onClick={() => {
                setConfirmEdit(false)
                setIsEditing(false)
                handleEdit();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                transition: reduceMotion ? 'none' : 'transform 0.1s ease',
                '&:active': { transform: reduceMotion ? 'none' : 'scale(0.97)' },
              }}
            >
              Yes
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        PaperProps={{ sx: { borderRadius: 3 } }}
        transitionDuration={reduceMotion ? 0 : undefined}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete deal?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedDeal?.title}</strong>? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={handleDeleteConfirm}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              transition: reduceMotion ? 'none' : 'transform 0.1s ease',
              '&:active': { transform: reduceMotion ? 'none' : 'scale(0.97)' },
            }}
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
        transitionDuration={reduceMotion ? 0 : undefined}
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
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
          elevation={0}
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
            <Box sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: 75,
              border: '1px solid #ccc',
              bgcolor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#f4f5f7',
              borderRadius: 50,
            })}>
              <PersonIcon sx={{width: '55%', height: '55%', opacity: 0.8}}/>
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
              <Typography variant="body2" color="text.secondary">
                Email: {showDetails?.email}
              </Typography>
              )}
              {showDetails?.phone && (
              <Typography variant="body2" color="text.secondary">
                Phone: { showDetails?.phone}
              </Typography>
              )}
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {showDetails?.gender !== 'Prefer not to say' &&(
              <Typography variant="body2" color="text.secondary">
                {showDetails?.gender}
              </Typography>
              )}
              {showDetails?.birth_date && (
              <Typography variant="body2" color="text.secondary">
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
          <Typography marginBottom={1} variant="body1" fontWeight={700} color="primary.main">
            {formatCurrency(Number(hoveredDeal?.value))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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