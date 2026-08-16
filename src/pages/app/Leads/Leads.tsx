import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";


import {
  updateLead,
  deleteLead, 
  moveLeadLocally,
  updateLeadStatus,
  clearError,
  fetchLeadsLists,
} from '../../../store/leadsSlice';
import { LEAD_STATUSES, type Lead, type LeadStatus, type UpdateLead } from '../../../types/lead';

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
  Snackbar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Popover,
  InputAdornment,
  Divider,
  Autocomplete,
  Avatar,
  Stack,
  Tooltip,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import ShareIcon from '@mui/icons-material/Share';
import NotesIcon from '@mui/icons-material/Notes';
// import { useAuth } from "../../../hooks/useAuth";
import ErrorAlert from "../../../components/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from "../../../types/global";
import { formatName, formatShortTitle } from "../../../utils/formatText";
import { calculateAge } from "../../../utils/calculateAge";

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const LAZY_CHUNK = 8;
const LOAD_MORE_DELAY = 220;
const CARD_TRANSITION =
  'box-shadow 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s ease, opacity 0.2s ease';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  },
  '& .MuiInputBase-input': { py: '6px', fontSize: 14 },
  '& .Mui-disabled': { opacity: 1 },
  '& .MuiOutlinedInput-root.Mui-disabled': { backgroundColor: 'transparent' },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiInputBase-input': { color: 'text.secondary' },
} as const;

function SectionHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 0.25 }}>
      {icon}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority !== 'High' && priority !== 'Highest') return null;
  const color = PRIORITY_COLORS[priority];
  return (
    <Chip
      size="small"
      icon={<PriorityIcon style={{ fontSize: 12, color }} />}
      label={priority}
      variant="outlined"
      sx={{
        height: 18,
        fontSize: 9,
        fontWeight: 700,
        color,
        bgcolor: alpha(color, 0.08),
        borderColor: alpha(color, 0.5),
        transition: 'background-color 0.2s ease',
        "& .MuiChip-label": { px: 0.5 },
      }}
    />
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

function RevealOnScroll({
  children,
  delay = 0,
  disabled = false,
}: {
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [disabled]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s ease ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}

function LoadMoreSentinel({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { rootMargin: '160px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return <Box ref={ref} aria-hidden sx={{ height: 1 }} />;
}

function LeadCardSkeleton({ reducedMotion }: { reducedMotion: boolean }) {
  const anim = reducedMotion ? false : 'wave';
  return (
    <Card
      sx={{
        mb: 1.25,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, display: 'flex', gap: 1.25 }}>
        <Skeleton
          variant="circular"
          width={38}
          height={38}
          animation={anim}
          sx={{ flexShrink: 0, mt: '2px' }}
        />
        <Box flex={1} minWidth={0}>
          <Skeleton variant="text" width="65%" height={18} animation={anim} />
          <Skeleton variant="text" width="40%" height={14} animation={anim} sx={{ mt: 0.5 }} />
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75 }}>
            <Skeleton variant="rounded" width={58} height={18} animation={anim} />
            <Skeleton variant="rounded" width={68} height={18} animation={anim} />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.75 }}>
            <Stack direction="row" spacing={0.5}>
              <Skeleton variant="circular" width={22} height={22} animation={anim} />
              <Skeleton variant="circular" width={22} height={22} animation={anim} />
              <Skeleton variant="circular" width={22} height={22} animation={anim} />
            </Stack>
            <Skeleton variant="circular" width={22} height={22} animation={anim} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Leads() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const {items: leads, loading, loaded,  error } = useSelector((state: RootState) => state.leads);
  const dispatch = useDispatch<AppDispatch>();
  // const { user } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openCloseConfirmation, setOpenCloseConfirmation] = useState(false);
  const [dropResult, setDropResult] = useState<DropResult | null>(null)
  const [openDelete, setOpenDelete] = useState(false);
  const [invalid, setInvalid] = useState('');
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openInvalid, setOpenInvalid] = useState(false);
  const [openEditConfirmation, setOpenEditConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<UpdateLead | null>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [visibleCounts, setVisibleCounts] = useState<Record<LeadStatus, number>>({
    New: LAZY_CHUNK,
    Contacted: LAZY_CHUNK,
    Qualified: LAZY_CHUNK,
    Closed: LAZY_CHUNK,
  });

  const revealMore = useCallback((status: LeadStatus) => {
    setVisibleCounts((prev) => ({ ...prev, [status]: prev[status] + LAZY_CHUNK }));
  }, []);

  const [loadingMore, setLoadingMore] = useState<Record<LeadStatus, boolean>>({
    New: false,
    Contacted: false,
    Qualified: false,
    Closed: false,
  });
  const loadMoreTimers = useRef<Partial<Record<LeadStatus, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    const timers = loadMoreTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const handleLoadMore = useCallback((status: LeadStatus) => {
    if (loadMoreTimers.current[status]) return;

    setLoadingMore((prev) => (prev[status] ? prev : { ...prev, [status]: true }));

    loadMoreTimers.current[status] = setTimeout(() => {
      revealMore(status);
      setLoadingMore((prev) => ({ ...prev, [status]: false }));
      loadMoreTimers.current[status] = undefined;
    }, LOAD_MORE_DELAY);
  }, [revealMore]);
  
  const [search, setSearch] = useState<Record<LeadStatus, string>>({
    New: '',
    Contacted: '',
    Qualified: '',
    Closed: '',
  });
  const [form, setForm] = useState<UpdateLead>({
    id: "",
    title: "",
    first_name: "",
    last_name: "",
    suffix: null as Suffix,
    email: null,
    phone: null,
    gender: "Prefer not to say" as Gender,
    birth_date: null,
    industry: "",
    company_name: "",
    department: "",
    position: "",
    website: "",
    source: "Other" as Source,
    priority: "Low" as Priority,
    notes: "",
    facebook: "",
    x: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    telegram: "",
    tiktok: "",
    viber: "",
    preferred_contact_time: "Anytime" as PreferredTime,
  });



  
  
  useEffect(() => {
    if (loading) return;

    const loadData = async () => {
      try {

        if (!loaded) {
          await dispatch(fetchLeadsLists()).unwrap();
        }
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  }, [
    loading,
    loaded,
    dispatch,
  ]);

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
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (newStatus === oldStatus) return;
  }

  const handleCloseAddContact = (result: DropResult) => {
    const leadId = result.draggableId;
    const oldStatus = result.source.droppableId as LeadStatus;

    const newStatus = oldStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    dispatch(moveLeadLocally({id: leadId, newStatus}));
    setOpenAddContact(false);
  };

  const handleCloseInvalid = () => {
    setOpenInvalid(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteLead(id)).unwrap();
  };

  const handleOpenEdit = (lead: UpdateLead) => {
    setForm({
      id: lead.id,
      title: lead.title,
      first_name: lead.first_name,
      last_name: lead.last_name,
      suffix: lead.suffix as Suffix || null ,
      gender: lead.gender as Gender,
      birth_date: lead.birth_date || null ,
      email: lead.email || null || '',
      phone: lead.phone || null || '',
      industry: lead.industry || '',
      company_name: lead.company_name || '',
      position: lead.position || '',
      department: lead.department || '',
      website: lead.website || '',
      source: lead.source as Source,
      priority: lead.priority as Priority,
      notes: lead.notes || '',
      preferred_contact_time: lead.preferred_contact_time as PreferredTime,
      facebook: lead.facebook || '',
      x: lead.x || '',
      whatsapp: lead.whatsapp || '',
      linkedin: lead.linkedin || '',
      instagram: lead.instagram || '',
      telegram: lead.telegram || '',
      tiktok: lead.tiktok || '',
      viber: lead.viber || '',
    });
    setEditingLead(lead);
    setIsEditing(true);
    setEdit(false);
  };

  const handleCloseEdit = () => {
    dispatch(clearError());
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
  const handleEdit = async () => {
    if (loading) return;

    try {
      setEdit(false);
    
      if (!editingLead) return;

      const leadId = editingLead.id;
      await dispatch(updateLead({ id: leadId, lead: form as Lead })).unwrap();
      setIsEditing(false);
    } catch {
      setIsEditing(true);
      setEdit(true);
      if (!editingLead) return;
    }
    
  };

  const handleOpenCloseConfirmation = () => {
  setOpenCloseConfirmation(true);
};

const handleCloseCloseConfirmation = () => {
  setOpenCloseConfirmation(false);
  setDropResult(null);
};

const handleConfirmCloseLead = async () => {
  if (!dropResult) return;

  const leadId = dropResult.draggableId;
  const newStatus = dropResult.destination?.droppableId as LeadStatus;

  if (!newStatus) return;

  try {
    dispatch(
      moveLeadLocally({
        id: leadId,
        newStatus,
      })
    );

    await dispatch(
      updateLeadStatus({
        id: leadId,
        status: newStatus,
      })
    ).unwrap();

    handleCloseCloseConfirmation();
  } catch {
    // Error in state
  }
};

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    lead: Lead
  ) => {
    setAnchorEl(event.currentTarget);
    setHoveredLead(lead);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setHoveredLead(null);
  };

  const refreshLeads = async () => {
    try {
      await dispatch(fetchLeadsLists()).unwrap();
    } catch {
      // Error handled by Redux state
    }
  };

  const handleAddContact = async (result: DropResult) => {

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (newStatus === oldStatus) return;


    if (!lead.email?.trim() && !lead.phone?.trim()) {
      setOpenInvalid(true);
      handleCloseAddContact(result);
      return;
    }

    await dispatch(updateLeadStatus({ id: leadId, status: newStatus })).unwrap();
    
    navigate('/app/contacts');
  }

  const handleDragEnd = async (result: DropResult) => {
    setDropResult(result);

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    if (newStatus === oldStatus) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (
      oldStatus === 'Qualified' &&
      ['New', 'Contacted', 'Closed'].includes(newStatus)
    ) {
      const message =
        newStatus === 'Closed'
          ? `This lead is already in Contacts. Unable to change the status to '${newStatus}'. Please change the status in Contacts instead.`
          : `This lead is already in Contacts. Unable to change the status back to '${newStatus}'.`;

      setInvalid(message);
      setTimeout(() => setInvalid(''), 3000);
      return;
    }

    if (oldStatus === 'Closed' && 
      ['New', 'Contacted', 'Qualified'].includes(newStatus)) {
      setInvalid(
        `This lead already exists. Unable to change the status back to '${newStatus}'.`
      );
      setTimeout(() => setInvalid(''), 3000);
      return;
    }

    if (newStatus === 'Closed') {
        setDropResult(result);
        handleOpenCloseConfirmation();
        return;
      }

      dispatch(moveLeadLocally({ id: leadId, newStatus }));

      if (newStatus === 'Qualified') {
        handleOpenAddContact(result);
      } else {
        await dispatch(
          updateLeadStatus({
            id: leadId,
            status: newStatus,
          })
        ).unwrap();
      }
  }
  
  const getLeadsByStatus = (status: LeadStatus) => {
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
      <Box sx={{height: 1000}}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: "100%",
          minWidth: 0,
          mx: 'auto',
          mb: 1,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              Leads
            </Typography>
            <Skeleton
              variant="rounded"
              width={40}
              height={40}
              animation={prefersReducedMotion ? false : 'wave'}
              sx={{ borderRadius: 10 }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            pb: 2,
            overflow: 'auto',
            width: { xs: '92%', sm: '85vw', md: '80vw' },
            maxWidth: 1400,
            mb: 2,
            p: '10px',
            borderRadius: 2,
            mx: 'auto',
          }}
        >
          {LEAD_STATUSES.map((column) => (
            <Box key={column} sx={{ width: '100%', minWidth: 300, flex: 1 }}>
              <Box
                sx={(theme) => ({
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px 10px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                })}
              >
                <Typography fontWeight={700} variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                  {column}
                </Typography>
                <Skeleton
                  variant="rounded"
                  height={24}
                  animation={prefersReducedMotion ? false : 'wave'}
                  sx={{ flex: 1, mx: 1, borderRadius: 5 }}
                />
              </Box>
              <Box
                sx={{
                  minHeight: 500,
                  height: 850,
                  bgcolor: 'background.paper',
                  borderRadius: '0 0 10px 10px',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderTop: 0,
                }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <LeadCardSkeleton key={i} reducedMotion={prefersReducedMotion} />
                ))}
              </Box>
            </Box>
          ))}
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
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '92%', sm: '85vw', md: '80vw' },
        maxWidth: 1400,
        mx: 'auto',
        mb: 1,
      }}>
        
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 0.75, sm: 1 },
        }}
      >
        <Typography sx={{ fontSize: { xs: 18, sm: 21, md: 23, lg: 28 } }} fontWeight={700}>
          Leads
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.75 } }}>
          <IconButton
            title="Add lead"
            onClick={() => navigate("/app/addlead")}
            sx={{
              width: { xs: 26, sm: 32 },
              height: { xs: 26, sm: 32 },
              backgroundColor: "primary.main",
              borderRadius: "50%",
              flexShrink: 0,
              color: "white",
              "& svg": {
                fontSize: { xs: 20, sm: 22 },
              },
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                backgroundColor: "primary.light",
              },
              "&:active": {
                transform: "scale(0.96)",
              },
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            title="Refresh leads"
            onClick={refreshLeads}
            disabled={loading}
            size="small"
            sx={{
              "& svg": {
                fontSize: { xs: 18, sm: 22 },
              },
            }}
          >
            {loading ? (
              <CircularProgress size={16} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Box>
      </Box>

        
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            pb: 2,
            overflow: 'auto',
            width: {md: '85vw', sm: '90vw', xs: '98vw' }, 
            maxWidth: 1400,
            mb: 2,
            p: '10px',
            borderRadius: 2,
            mx: 'auto',
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 4 },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          }}
        >
          {LEAD_STATUSES.map((column) => {
            const columnLeads = getLeadsByStatus(column);
            const visibleLeads = columnLeads.slice(0, visibleCounts[column]);

            return (
            <Box
              key={column}
              sx={{ width: '100%' ,minWidth: 260, flex: 1}}
            >
              <Box
                sx={(theme) => ({
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px 10px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'grey.800'
                    : 'grey.200',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                })}
                >
                <Typography fontWeight={700} variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                  {column}
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search"
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
                        <InputAdornment position="end">
                          <SearchIcon sx={{ opacity: 0.5 }} fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    bgcolor: 'background.paper',
                    borderRadius: 5,
                    transition: 'box-shadow 0.2s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiInputBase-root.Mui-focused': {
                      boxShadow: (t) => `0 0 0 2px ${alpha(t.palette.primary.main, 0.25)}`,
                    },
                    '& .MuiInputBase-input': {
                      py: '4px',
                      fontSize: 12,
                    },
                  }}
                />
                <Chip
                  label={columnLeads.length}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: 'background.paper' }}
                  />
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
                      overflowY: 'auto',
                      borderRadius: '0 0 10px 10px',
                      p: 1,
                      transition: 'background-color 0.2s ease',
                      height: 850,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderTop: 0,
                      '&::-webkit-scrollbar': { width: 6 },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 3 },
                    }}
                  >
                    {visibleLeads.map((lead, index) => (
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
                              mb: 1.25,
                              borderRadius: 2.5,
                              border: '1px solid',
                              borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
                              boxShadow: snapshot.isDragging
                                ? '0 14px 28px rgba(0,0,0,0.22)'
                                : '0 1px 2px rgba(0,0,0,0.05)',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              opacity: snapshot.isDragging ? 0.97 : 1,
                              bgcolor: 'background.paper',
                              // Keep the dragged card above sibling cards. This is a
                              // visual aid only - it does not participate in the
                              // actual drag positioning, which the library owns.
                              zIndex: snapshot.isDragging ? 1300 : 'auto',
                              transition: prefersReducedMotion ? 'none' : CARD_TRANSITION,
                              '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                              },
                            }}
                          >
                            <RevealOnScroll
                              delay={Math.min(index, 6) * 35}
                              disabled={prefersReducedMotion}
                            >
                            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, display: 'flex', gap: 1.25 }}>
                              <Avatar
                                onMouseEnter={(e) => handleMouseEnter(e, lead)}
                                onMouseLeave={handleMouseLeave}
                                sx={{
                                  width: 38,
                                  height: 38,
                                  mt: '2px',
                                  cursor: 'pointer',
                                  bgcolor: 'action.hover',
                                  flexShrink: 0,
                                  transition: 'transform 0.2s ease, background-color 0.2s ease',
                                  '&:hover': { transform: 'scale(1.06)', bgcolor: 'action.selected' },
                                }}
                              >
                                <PersonIcon sx={{ opacity: 0.65, color: 'text.secondary' }}/>
                              </Avatar>
                              <Box flex={1} minWidth={0}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0.5}}>
                                  <Typography
                                  title="Lead Title"
                                  sx={{
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: '0.01em',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}>
                                  {formatShortTitle(lead.title).toUpperCase()}
                                  </Typography>
                                  <Box
                                    title={`${lead.priority} Priority`}
                                   sx={{display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer', flexShrink: 0}}>
                                    <PriorityBadge priority={lead.priority} />
                                     <IconButton
                                      size="small"
                                      onClick={() => handleOpenEdit(lead)}
                                    >
                                      <InfoIcon titleAccess="Full details" fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                </Box>
                                <Box
                                  title="Lead full name"
                                  sx={{ display: 'flex', cursor: 'pointer'}}>
                                    <Typography sx={{fontSize: '11px', fontWeight: 600, opacity: 0.75}}>
                                    {formatName(lead.first_name, lead.last_name)} {lead.suffix} 
                                  </Typography>
                                </Box>
                                {lead.notes && (
                                  <Typography
                                    title="Lead Notes"
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    sx={{
                                      mt: 0.5,
                                      width: '100%',
                                      fontStyle: 'italic',
                                      wordBreak: 'break-word',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {lead.notes.length > 100
                                    ? `${lead.notes.slice(0, 100)}...`
                                    : lead.notes}
                                  </Typography>
                                )}
                                <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.5 }}>
                                  <Chip
                                    title="Deal Owner"
                                    label={formatName(
                                      lead.owner?.profile?.first_name ?? "Unknown",
                                      lead.owner?.profile?.last_name ?? "Owner"
                                    )}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ height: 18, fontSize: 9, fontWeight: 700, cursor: 'pointer', "& .MuiChip-label": { px: 0.75 } }}
                                  />
                                  <Chip
                                    title="Preferred Time to contact"
                                    label={lead.preferred_contact_time}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 18, fontSize: 9, cursor: 'pointer', "& .MuiChip-label": { px: 0.75 } }}
                                  />
                                </Stack>
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 0.5,
                                }}>
                                  <Stack direction="row" spacing={0.25}>
                                    <Tooltip title="Email lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Call lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <CallIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Message lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <SmsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                  <Tooltip title="Delete lead">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleOpenDelete(lead)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box> 
                              </Box>
                              
                              
                            </CardContent>
                            </RevealOnScroll>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {visibleLeads.length < columnLeads.length && (
                      <>
                        <LoadMoreSentinel onVisible={() => handleLoadMore(column)} />
                        {loadingMore[column] && (
                          <>
                            <LeadCardSkeleton reducedMotion={prefersReducedMotion} />
                            <LeadCardSkeleton reducedMotion={prefersReducedMotion} />
                          </>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Droppable>
            </Box>
            );
          })}
        </Box>
      </DragDropContext>
      <Dialog
        PaperProps={{
          sx: {
            position: "absolute",
            backgroundColor: 'background.paper',
            borderRadius: 3,
            minWidth: 340,
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          },
        }}
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <DeleteIcon color="error" fontSize="small" />
          Confirm deletion
        </DialogTitle>

        <DialogContent
          sx = {{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            maxWidth: 600,
          }}
          >
            Are you sure you want to delete this lead: <b>{selectedLead?.first_name} {selectedLead?.last_name} {selectedLead?.suffix}?</b>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDelete} sx={{ textTransform: 'none', borderRadius: 2 }}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              disableElevation
              color="error"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-1px)' },
              }}
              onClick={() => {
                if (selectedLead) {
                  handleDelete(selectedLead.id);
                }
                handleCloseDelete();
              }}
              >
                Yes, delete
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog  sx={{position: "absolute", maxHeight: 800, top: 100 }} maxWidth="md" open={isEditing} onClose={handleCloseEdit} PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0,0,0,0.18)' } }}>
          
          <DialogActions sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            pt: 1.5,
          }}>
            <Tooltip title="Edit lead">
              <IconButton
                size="small"
                onClick={handleEditable}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  transition: 'background-color 0.2s ease',
                }}
              >
                <EditIcon titleAccess="Edit" color="primary" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={handleCloseEdit}
                sx={{
                  bgcolor: 'error.main',
                  color: 'common.white',
                  borderRadius: 1,
                  transition: 'background-color 0.2s ease',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <CloseIcon titleAccess="Close" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 2,
            mx: { xs: 1, sm: 3, md: 5 },
            mb: 1,
          }}>
          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              width: {
                xs: 250,
                sm: 300,
                md: 400,
                lg: 500
              },
            }}>
            <Box sx={{
              display: "flex",
              width: '100%',
              flexDirection: 'column',
              overflow: 'auto',
              justifyContent: "center",
              gap: 1,
              
              '& .MuiTextField-root': {
                  userSelect: edit === true ? 'auto' : 'none',
                },
            }}>
              {isEditing && error && (
                <ErrorAlert
                  message={error}
                />
              )}
              <SectionHeader icon={<PersonIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Personal Details
              </SectionHeader>
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
                  value={!edit && !form.first_name ? 'Not provided' : form.first_name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  disabled={!edit}
                  label="Last Name"
                  name="last_name"
                  value={!edit && !form.last_name ? 'Not provided' : form.last_name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
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
                  select
                  disabled={!edit}
                  label="Suffix"
                  name="suffix"
                  onChange={handleChange}
                  value={!edit && !form.suffix ? 'None' : form.suffix}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
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
                >
                {SUFFIXES.map((suffix) => (
                    <MenuItem key={suffix} value={suffix}>
                      {suffix}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  disabled={!edit}
                  type="tel"
                  label="Phone"
                  name="phone"
                  value={!edit && !form.phone ? 'Not provided' : form.phone}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Box>
              
              <TextField
                disabled={!edit}
                label="Email"
                name="email"
                value={!edit && !form.email ? 'Not provided' : form.email}
                onChange={handleChange}
                size="small"
                sx={fieldSx}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
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
                  value={form.gender }
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                >
                {GENDERS.map((gender) => (
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
                    width: '50%',
                    '& input' : {
                      colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
                    },
                    ...fieldSx,
                  }}
                />
              </Box>
              <SectionHeader icon={<WorkIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Professional Details
              </SectionHeader>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <Autocomplete
                  freeSolo
                  disabled={!edit}
                  sx={{ width: '50%',
                    '& .MuiOutlinedInput-root': {
                      height: 28 
                    },
                    }}
                  options={DEPARTMENTS}
                  value={!edit && !form.department ? 'Not provided' : form.department}
                  onChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      department: value ?? '',
                    }));
                  }}
                  onInputChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      department: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      slotProps={{ inputLabel: { shrink: true } }}
                      label="Department"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  disabled={!edit}
                  sx={{
                    width: '50%',
                    '& .MuiOutlinedInput-root': {
                      height: 28 
                    },
                  }}
                  options={INDUSTRIES}
                  value={!edit && !form.industry ? 'Not provided' : form.industry}
                  onChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      industry: value ?? '',
                    }));
                  }}
                  onInputChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      industry: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      slotProps={{ inputLabel: { shrink: true } }}
                      label="Industry"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
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
                  label="Company"
                  name="company_name"
                  value={!edit && !form.company_name ? 'Not provided' : form.company_name}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Position"
                  name="position"
                  value={!edit && !form.position ? 'Not provided' : form.position}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <TextField
                  disabled={!edit}
                  label="Website Url"
                  name="website"
                  value={!edit && !form.website ? 'Not provided' : form.website}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '100%',
                    ...fieldSx,
                  }}
                />
              <SectionHeader icon={<ShareIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Social and Messaging Accounts
              </SectionHeader>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  disabled={!edit}
                  label="Facebook"
                  name="facebook"
                  value={!edit && !form.facebook ? 'Not provided' : form.facebook}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
                <TextField
                  disabled={!edit}
                  label="X/ Twitter"
                  name="x"
                  value={!edit && !form.x ? 'Not provided' : form.x}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
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
                  label="Instagram"
                  name="instagram"
                  value={!edit && !form.instagram ? 'Not provided' : form.instagram}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Whatsapp"
                  name="whatsapp"
                  value={!edit && !form.whatsapp ? 'Not provided' : form.whatsapp}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
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
                  label="Tiktok"
                  name="tiktok"
                  value={!edit && !form.tiktok ? 'Not provided' : form.tiktok}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Telegram"
                  name="telegram"
                  value={!edit && !form.telegram ? 'Not provided' : form.telegram}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
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
                  label="Linkedin"
                  name="linkedin"
                  value={!edit && !form.linkedin ? 'Not provided' : form.linkedin}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Viber"
                  name="viber"
                  value={!edit && !form.viber ? 'Not provided' : form.viber}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <SectionHeader icon={<NotesIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Additional Details
              </SectionHeader>
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
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={fieldSx}
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
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
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
                >
                  {SOURCES.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  disabled={!edit}
                  label="Preferred Time"
                  name="preferred_contact_time"
                  onChange={handleChange}
                  value={form.preferred_contact_time}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '25%',
                    ...fieldSx,
                  }}
                >
                  {PREFERRED_CONTACT_TIMES.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
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
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '25%',
                    ...fieldSx,
                  }}
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
                required
                disabled={!edit}
                value={form.notes}
                onChange={handleChange}
                size="small"
                multiline
                rows={3}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldSx}
              />    
          </Box > 
          </DialogContent>
          <DialogActions sx={{ display: edit === true ? 'flex' : 'none', px: 3, pb: 2 }}>
            <Button onClick={handleNotEditable} sx={{ textTransform: 'none', borderRadius: 2 }}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              disableElevation
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-1px)' },
              }}
              onClick={() => {
                handleOpenEditConfirmation();
              }}
              >
              Submit
            </Button>
          </DialogActions>
          </Box>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openAddContact} onClose={handleCloseAddContact} PaperProps={{ sx: { borderRadius: 3, minWidth: 340, boxShadow: '0 20px 40px rgba(0,0,0,0.18)' } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Move to Qualified?
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Moving this to Qualified will automatically add it as a Contact.
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button sx={{ textTransform: 'none', borderRadius: 2 }} onClick={() => {
                  if (!dropResult) return;
                  handleCloseAddContact(dropResult);
                }}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                }}
                onClick={() => {
                  if (!dropResult) return;
                  handleAddContact(dropResult);
                }}
              >
                Proceed
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          sx={{ position: "absolute" }}
          open={openCloseConfirmation}
          onClose={handleCloseCloseConfirmation}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 340,
              boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Close this lead?
          </DialogTitle>

          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
          >
            Are you sure you want to mark this lead as Closed?
            This action indicates that the lead was lost and cannot
            be moved back to an earlier stage.
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              sx={{ textTransform: "none", borderRadius: 2 }}
              onClick={handleCloseCloseConfirmation}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              disableElevation
              sx={{
                textTransform: "none",
                borderRadius: 2,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-1px)' },
              }}
              onClick={handleConfirmCloseLead}
            >
              Yes, close lead
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openInvalid} onClose={handleCloseInvalid} PaperProps={{ sx: { borderRadius: 3, minWidth: 340, boxShadow: '0 20px 40px rgba(0,0,0,0.18)' } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Unable to update as Qualified
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Please update the lead's contact details first before moving to Qualified (email or phone).
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                }}
                onClick={() => {
                  handleCloseInvalid();
                }}
              >
                OK
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openEditConfirmation} onClose={handleCloseEditConfirmation} PaperProps={{ sx: { borderRadius: 3, minWidth: 340, boxShadow: '0 20px 40px rgba(0,0,0,0.18)' } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Confirm changes
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Are you sure you want to edit this lead?
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button sx={{ textTransform: 'none', borderRadius: 2 }} onClick={handleCloseEditConfirmation}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                disableElevation
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  transition: 'transform 0.15s ease',
                  '&:hover': { transform: 'translateY(-1px)' },
                }}
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
          <Card sx={{ p: 2, width: 340,
                borderRadius: 3,
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                boxShadow: '0 16px 32px rgba(0,0,0,0.14)',
              }}>
            <Stack alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'action.hover' }}>
                <PersonIcon sx={{ fontSize: 32, opacity: 0.7, color: 'text.secondary' }}/>
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                  {formatName(hoveredLead?.first_name, hoveredLead?.last_name)} {hoveredLead?.suffix}
                  {hoveredLead && <PriorityBadge priority={hoveredLead.priority} />}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
              }}>
                {hoveredLead?.email && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, opacity: 0.6 }} /> {hoveredLead?.email}
                </Typography>
                )}
                {hoveredLead?.phone && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CallIcon sx={{ fontSize: 14, opacity: 0.6 }} /> {hoveredLead?.phone}
                </Typography>
                )}
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
              }}>
                {hoveredLead?.gender !== 'Prefer not to say' && (
                <Typography variant="body2" color="text.secondary">
                  {hoveredLead?.gender }
                </Typography>
                )}
                {hoveredLead?.birth_date && (
                <Typography variant="body2" color="text.secondary">
                  Age: {!hoveredLead?.birth_date
                  ? ''
                  : calculateAge(hoveredLead.birth_date)}
                </Typography>
                )}
              </Box>
            </Box>
            <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: hoveredLead?.email || hoveredLead?.phone ? 1 : 0,
            }}>
              {hoveredLead?.facebook && (
                <Typography variant="body2" color="text.secondary">
                  Facebook: facebook.com/{hoveredLead.facebook}
                </Typography>
              )}
              {hoveredLead?.instagram && (
                <Typography variant="body2" color="text.secondary">
                  Instagram: @{hoveredLead.instagram}
                </Typography>
              )}
              {hoveredLead?.tiktok && (
                <Typography variant="body2" color="text.secondary">
                  TikTok: @{hoveredLead.tiktok}
                </Typography>
              )}
              {hoveredLead?.x && (
                <Typography variant="body2" color="text.secondary">
                  X/Twitter: @{hoveredLead.x}
                </Typography>
              )}
              {hoveredLead?.linkedin && (
                <Typography variant="body2" color="text.secondary">
                  LinkedIn: linkedin.com/in/{hoveredLead.linkedin}
                </Typography>
              )}
              {hoveredLead?.telegram && (
                <Typography variant="body2" color="text.secondary">
                  Telegram: @{hoveredLead.telegram}
                </Typography>
              )}
              {hoveredLead?.whatsapp && (
                <Typography variant="body2" color="text.secondary">
                  WhatsApp: {hoveredLead.whatsapp}
                </Typography>
              )}
              {hoveredLead?.viber && (
                <Typography variant="body2" color="text.secondary">
                  Viber: {hoveredLead.viber}
                </Typography>
              )}
            </Box>
            <Divider sx={{mt: 2, mb: 1}}></Divider>
            <Typography marginBottom={1} variant="body1" fontWeight={700}>
              {hoveredLead?.title.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hoveredLead?.notes}
            </Typography>
          </Card>
        </Popover>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="This feature is coming soon!"
          ContentProps={{ sx: { borderRadius: 2 } }}
        />
    </Box>
  );
}