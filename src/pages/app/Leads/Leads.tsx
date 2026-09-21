import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import TableRowsIcon from '@mui/icons-material/TableRows';

import {
  deleteLead,
  deleteBulkLeads,
  archiveBulkLeads,
  moveLeadLocally,
  updateLeadStatus,
  clearError,
  fetchLeadsLists,
  archiveLead,
} from '../../../store/leadsSlice';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '../../../types/lead';

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
  IconButton,
  Chip,
  Popover,
  InputAdornment,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Skeleton,
  CircularProgress,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import FlagIcon from '@mui/icons-material/Flag';
import AddIcon from '@mui/icons-material/Add';
import ErrorAlert from "../../../components/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import { type Priority } from "../../../types/global";
import { formatName } from "../../../utils/formatText";
import { calculateAge } from "../../../utils/calculateAge";
import ArchiveIcon from "@mui/icons-material/Archive";

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

const LAZY_CHUNK = 8;
const LOAD_MORE_DELAY = 220;
const CARD_TRANSITION =
  'box-shadow 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s ease, opacity 0.2s ease';

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority !== 'High' && priority !== 'Highest') return null;
  const color = PRIORITY_COLORS[priority];
  return (
    <Box
      title={`${priority} Priority`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        bgcolor: alpha(color, 0.08),
      }}
    >
      <FlagIcon
        sx={{
          fontSize: 14,
          color,
        }}
      />
    </Box>
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
      <CardContent
        sx={{
          p: 1.25,
          '&:last-child': { pb: 1.25 },
          display: 'flex',
          gap: 1.25,
        }}
      >
        {/* Avatar + priority */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            width={38}
            height={38}
            animation={anim}
            sx={{ flexShrink: 0, mt: '2px' }}
          />

          <Skeleton
            variant="circular"
            width={20}
            height={20}
            animation={anim}
            sx={{ mb: 0.7 }}
          />
        </Box>

        {/* Lead content */}
        <Box flex={1} minWidth={0}>
          {/* Name + ID */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Skeleton
              variant="text"
              width="58%"
              height={20}
              animation={anim}
            />

            <Skeleton
              variant="text"
              width={42}
              height={14}
              animation={anim}
            />
          </Box>

          {/* Notes */}
          <Skeleton
            variant="text"
            width="88%"
            height={15}
            animation={anim}
            sx={{ mt: 0.25 }}
          />

          {/* Chips */}
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              mt: 0.5,
              flexWrap: 'wrap',
            }}
          >
            <Skeleton
              variant="rounded"
              width={82}
              height={18}
              animation={anim}
              sx={{ borderRadius: 1.5 }}
            />

            <Skeleton
              variant="rounded"
              width={96}
              height={18}
              animation={anim}
              sx={{ borderRadius: 1.5 }}
            />
          </Stack>

          {/* Bottom actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5,
            }}
          >
            <Stack direction="row" spacing={0.25}>
              <Skeleton
                variant="circular"
                width={28}
                height={28}
                animation={anim}
              />
              <Skeleton
                variant="circular"
                width={28}
                height={28}
                animation={anim}
              />
              <Skeleton
                variant="circular"
                width={28}
                height={28}
                animation={anim}
              />
            </Stack>

            <Stack direction="row" spacing={0.25}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation={anim}
              />
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation={anim}
              />
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Leads() {
  const {items: leads, loading, loaded,  error } = useSelector((state: RootState) => state.leads);
  const dispatch = useDispatch<AppDispatch>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [openCloseConfirmation, setOpenCloseConfirmation] = useState(false);
  const [dropResult, setDropResult] = useState<DropResult | null>(null)
  const [openDelete, setOpenDelete] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkArchiveOpen, setBulkArchiveOpen] = useState(false);
  const [invalid, setInvalid] = useState('');
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openInvalid, setOpenInvalid] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [selectedLeadIds, setSelectedLeadIds] =
    useState<GridRowSelectionModel>({
      type: 'include',
      ids: new Set(),
    });
  const [statusAnchorEl, setStatusAnchorEl] =
    useState<null | HTMLElement>(null);

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
      .filter((lead) => !lead.is_archived)
      .filter((lead) => lead.status === status)
      .filter((lead) => {
        if (!query) return true;

        const searchableText = [
          lead.first_name,
          lead.last_name,
          lead.suffix,
          lead.email,
          lead.phone,
          lead.notes
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
  };


  const handleArchive = async (id: string) => {
    try {
      await dispatch(archiveLead(id)).unwrap();
      await dispatch(fetchLeadsLists()).unwrap();
    } catch (error) {
      console.error("Archive failed:", error);
    }
  };

  const getSelectedLeadIds = () => {
    if (selectedLeadIds.type === 'include') {
      return Array.from(selectedLeadIds.ids).map(String);
    }

    const excludedIds = new Set(
      Array.from(selectedLeadIds.ids).map(String)
    );

    return tableRows
      .map((lead) => String(lead.id))
      .filter((id) => !excludedIds.has(id));
  };

  const handleBulkArchive = async () => {
    if (loading) return;

    try {
      const ids = getSelectedLeadIds();

      await dispatch(archiveBulkLeads(ids)).unwrap();

      setSelectedLeadIds({
        type: 'include',
        ids: new Set(),
      });

      setBulkArchiveOpen(false);
    } catch {
      // Error handled by Redux state
    }
  };

  const handleBulkDelete = async () => {
    if (loading) return;

    try {
      const ids = getSelectedLeadIds();

      await dispatch(deleteBulkLeads(ids)).unwrap();

      setSelectedLeadIds({
        type: 'include',
        ids: new Set(),
      });

      setBulkDeleteOpen(false);
    } catch {
      // Error handled by Redux state
    }
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (!selectedLead) return;

    const lead = selectedLead;
    const oldStatus = lead.status;

    setStatusAnchorEl(null);

    if (status === oldStatus) return;

    if (
      oldStatus === 'Qualified' &&
      ['New', 'Contacted', 'Closed'].includes(status)
    ) {
      const message =
        status === 'Closed'
          ? `This lead is already in Contacts. Unable to change the status to '${status}'. Please change the status in Contacts instead.`
          : `This lead is already in Contacts. Unable to change the status back to '${status}'.`;

      setInvalid(message);
      setTimeout(() => setInvalid(''), 3000);
      setSelectedLead(null);
      return;
    }

    if (
      oldStatus === 'Closed' &&
      ['New', 'Contacted', 'Qualified'].includes(status)
    ) {
      setInvalid(
        `This lead already exists. Unable to change the status back to '${status}'.`
      );
      setTimeout(() => setInvalid(''), 3000);
      setSelectedLead(null);
      return;
    }

    if (status === 'Qualified') {
      if (!lead.email?.trim() && !lead.phone?.trim()) {
        setOpenInvalid(true);
        setSelectedLead(null);
        return;
      }

      setSelectedLead(null);
      setDropResult({
        draggableId: lead.id,
        source: {
          droppableId: oldStatus,
          index: 0,
        },
        destination: {
          droppableId: status,
          index: 0,
        },
        combine: null,
        reason: 'DROP',
        type: 'DEFAULT',
        mode: 'FLUID',
      });

      setOpenAddContact(true);
      return;
    }

    if (status === 'Closed') {
      setSelectedLead(null);
      setDropResult({
        draggableId: lead.id,
        source: {
          droppableId: oldStatus,
          index: 0,
        },
        destination: {
          droppableId: status,
          index: 0,
        },
        combine: null,
        reason: 'DROP',
        type: 'DEFAULT',
        mode: 'FLUID',
      });

      setOpenCloseConfirmation(true);
      return;
    }

    try {
      dispatch(
        moveLeadLocally({
          id: lead.id,
          newStatus: status,
        })
      );

      await dispatch(
        updateLeadStatus({
          id: lead.id,
          status,
        })
      ).unwrap();

      setSelectedLead(null);
    } catch {
      // Error in state
    }
  };

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

  function getInitials(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return "?";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function stringToAvatarColor(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) hash = input.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  }

  const columns: GridColDef[] = [
    {
      field: 'display_id',
      headerName: 'ID',
      width: 70,
      cellClassName: 'display-id-cell',
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: 1,
          }}
        >
          <Avatar
            src={params.row.avatar_url ?? undefined}
            sx={{
              width: 24,
              height: 24,
              fontSize: 10.5,
              fontWeight: 700,
              bgcolor: stringToAvatarColor(params.value ?? ""),
            }}
          >
            {!params.row.avatar_url && getInitials(params.value ?? "")}
          </Avatar>

          <Typography
            sx={{
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
            color="primary"
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
      flex: 1,
      display: 'flex',
      align: 'left',
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.72rem',
            fontWeight: 700,
            borderRadius: 1.5,
            border: value === 'New'
              ? '1px solid #888888c2'
              : 'none',
            color: value === 'New'
              ? '#303030'
              : '#f7f6f6',
            backgroundColor:
              value === 'New'
                ? '#ffffff'
                : value === 'Contacted'
                  ? '#ffbb29'
                  : value === 'Qualified'
                    ? '#AD7450'
                    : '#7a0000',
          }}
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'preferred_contact_time',
      headerName: 'Preferred Time',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'actions',
      headerName: 'Action',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '4px',
          }}
        >
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setStatusAnchorEl(e.currentTarget);
              setSelectedLead(params.row);
            }}
            disableElevation
            sx={{
              py: '2px',
              px: 1.75,
              borderRadius: 999,
              textTransform: 'none',
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: '11px',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Change Status
          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{height: 800}}>
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
          }}>
            <Typography sx={{ fontSize: { sm: 16, md: 18, lg: 20 } }} fontWeight={700}>
              Leads
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 0.75 },
              }}
            >
              <Skeleton
                variant="circular"
                width={32}
                height={32}
                animation={prefersReducedMotion ? false : "wave"}
              />

              <Skeleton
                variant="circular"
                width={32}
                height={32}
                animation={prefersReducedMotion ? false : "wave"}
              />

              <Skeleton
                variant="circular"
                width={32}
                height={32}
                animation={prefersReducedMotion ? false : "wave"}
              />

              <Skeleton
                variant="circular"
                width={32}
                height={32}
                animation={prefersReducedMotion ? false : "wave"}
              />
            </Box>
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
                  height: 700,
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

  const tableRows = leads.map((lead) => ({
    id: lead.id,
    display_id: lead.display_id,
    name: `${formatName(lead.first_name, lead.last_name)} ${lead.suffix || ''}`,
    avatar_url: lead.avatar_url,
    email: lead.email || '',
    phone: lead.phone || '',
    status: lead.status,
    priority: lead.priority,
    preferred_contact_time: lead.preferred_contact_time,
  }));

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
        <Typography sx={{ fontSize: { sm: 16, md: 18, lg: 20 } }} fontWeight={700}>
          Leads
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 0.75 } }}>
          <IconButton
            title="Kanban view"
            onClick={() => setView('kanban')}
            size="small"
            sx={{
              color: view === 'kanban' ? 'primary.main' : 'text.secondary',
              backgroundColor: view === 'kanban' ? 'action.selected' : 'transparent',
            }}
          >
            <ViewKanbanIcon />
          </IconButton>

          <IconButton
            title="Table view"
            onClick={() => setView('table')}
            size="small"
            sx={{
              color: view === 'table' ? 'primary.main' : 'text.secondary',
              backgroundColor: view === 'table' ? 'action.selected' : 'transparent',
            }}
          >
            <TableRowsIcon />
          </IconButton>
          <IconButton
            title="Add lead"
            onClick={() => {
              clearError()
              navigate("/app/leads/addlead")
            }}
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
          {view === 'table' && (
            <>
              <Tooltip
                title={
                  selectedLeadIds.type === "exclude" ||
                  selectedLeadIds.ids.size > 0
                    ? "Archive selected"
                    : "Select leads to archive"
                }
              >
                <span>
                  <IconButton
                    onClick={() => setBulkArchiveOpen(true)}
                    disabled={
                      selectedLeadIds.type !== "exclude" &&
                      selectedLeadIds.ids.size === 0
                    }
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <ArchiveIcon
                      sx={{
                        opacity:
                          selectedLeadIds.type === "exclude" ||
                          selectedLeadIds.ids.size > 0
                            ? 1
                            : 0.3,
                        fontSize: { xs: 15, sm: 17, md: 20 },
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip
                title={
                  selectedLeadIds.type === "exclude" ||
                  selectedLeadIds.ids.size > 0
                    ? "Delete selected"
                    : "Select leads to delete"
                }
              >
                <span>
                  <IconButton
                    onClick={() => setBulkDeleteOpen(true)}
                    disabled={
                      selectedLeadIds.type !== "exclude" &&
                      selectedLeadIds.ids.size === 0
                    }
                    sx={{
                      border: '1px solid',
                      borderColor:
                        selectedLeadIds.type === "exclude" ||
                        selectedLeadIds.ids.size > 0
                          ? alpha('#e95858', 0.4)
                          : 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <DeleteIcon
                      sx={{
                        opacity:
                          selectedLeadIds.type === "exclude" ||
                          selectedLeadIds.ids.size > 0
                            ? 1
                            : 0.3,
                        color:
                          selectedLeadIds.type === "exclude" ||
                          selectedLeadIds.ids.size > 0
                            ? '#e95858'
                            : 'text.disabled',
                        fontSize: { xs: 15, sm: 17, md: 20 },
                      }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

        
      </Box>
      {view === 'kanban' ? (
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
                      height: 700,
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
                            onClick={() => navigate(`/app/leads/${lead.id}`)}
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
                              <Box sx={{display: 'flex', flexDirection: 'column',
                                justifyContent: "space-between", alignItems: 'center',
                              }}>
                                <Avatar
                                  src={lead.avatar_url ?? undefined}
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
                                    '&:hover': {
                                      transform: 'scale(1.06)',
                                      bgcolor: 'action.selected',
                                    },
                                  }}
                                >
                                  {!lead.avatar_url && (
                                    <PersonIcon sx={{ opacity: 0.65, color: 'text.secondary' }} />
                                  )}
                                </Avatar>
                                <Box
                                    title={`${lead.priority} Priority`}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.25,
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      pb: 0.7
                                    }}
                                  >
                                    <PriorityBadge priority={lead.priority} />
                                  </Box>
                              </Box>
                              
                              <Box flex={1} minWidth={0}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    title="Lead full name"
                                    sx={{
                                      cursor: 'pointer',
                                      fontSize: 13,
                                      fontWeight: 700,
                                      letterSpacing: '0.01em',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {formatName(lead.first_name, lead.last_name)} {lead.suffix}
                                  </Typography>

                                    <Typography
                                      title="Lead ID"
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                      sx={{
                                        fontStyle: 'italic',
                                        fontSize: 9,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {lead.display_id}
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
                                    title={lead.assigned_to ? "Assigned To" : "Deal Owner"}
                                    label={formatName(
                                      lead.assigned?.profile?.first_name ??
                                        lead.owner?.profile?.first_name ??
                                        "Unknown",
                                      lead.assigned?.profile?.last_name ??
                                        lead.owner?.profile?.last_name ??
                                        "Owner"
                                    )}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                      height: 18,
                                      fontSize: 9,
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      "& .MuiChip-label": { px: 0.75 }
                                    }}
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
                                      <IconButton size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setOpenSnackbar(true)}}>
                                        <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Call lead">
                                      <IconButton size="small" onClick={(e) => {
                                          e.stopPropagation()
                                          setOpenSnackbar(true)}}>
                                        <CallIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Message lead">
                                      <IconButton size="small" onClick={(e) => {
                                          e.stopPropagation()
                                          setOpenSnackbar(true)}}>
                                        <SmsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                  <Stack direction="row">
                                    <Tooltip title="Archive lead">
                                      <IconButton
                                        size="small"
                                        sx={{ p: 0.1 }}
                                        onClick={async (e) => {
                                          e.stopPropagation();

                                          try {
                                            await handleArchive(lead.id);
                                          } catch {
                                            // Error handled by Redux state
                                          }
                                        }}
                                      >
                                        <ArchiveIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete lead">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        sx={{ p: 0.1 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenDelete(lead);
                                        }}
                                      >
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
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
      ) : (
      <Box
        sx={{
          display: 'flex',
          height: 700,
          width: '100%',
          minWidth: 0,
          overflow: 'auto',
          mb: 5,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            justifyContent: 'center',
            p: 1,
            pt: 2,
            height: 700,
            minWidth: 300,
            display: 'flex',
            flex: 1,
            borderRadius: 3,
            borderColor: 'divider',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <DataGrid
            sx={{
              border: 'none',
              borderRadius: 3,
              minWidth: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              overflow: 'auto',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: (theme) =>
                  alpha(theme.palette.text.primary, 0.03),
                borderRadius: 2,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 0.3,
                opacity: 0.7,
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, 0.05),
              },
              '& .display-id-cell': {
                fontSize: '11px',
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
            }}
            rows={tableRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedLeadIds}
            onRowSelectionModelChange={(newSelection) => {
              setSelectedLeadIds(newSelection);
            }}
            onRowClick={(params) => {
              navigate(`/app/leads/${params.row.id}`);
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[30, 50]}
            rowHeight={30}
          />
        </Paper>
      </Box>
      )}
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={() => {
          setStatusAnchorEl(null);
          setSelectedLead(null);
        }}
      >
        {LEAD_STATUSES.map((status) => (
         <MenuItem
            key={status}
            disabled={status === selectedLead?.status}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
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
           <Avatar
              src={hoveredLead?.avatar_url ?? undefined}
              sx={{ width: 64, height: 64, bgcolor: 'action.hover' }}
            >
              {!hoveredLead?.avatar_url && (
                <PersonIcon
                  sx={{
                    fontSize: 32,
                    opacity: 0.7,
                    color: 'text.secondary'
                  }}
                />
              )}
            </Avatar>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                {formatName(hoveredLead?.first_name, hoveredLead?.last_name)} {hoveredLead?.suffix}
                
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
          <Typography variant="body2" color="text.secondary">
            {hoveredLead?.notes}
          </Typography>
        </Card>
      </Popover>
      <Dialog
        open={bulkArchiveOpen}
        onClose={() => setBulkArchiveOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 340,
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
          }}
        >
          <ArchiveIcon
            sx={{
              fontSize: 22,
            }}
          />
          Archive selected leads?
        </DialogTitle>

        <DialogContent>
          Are you sure you want to archive{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {selectedLeadIds.type === 'exclude'
              ? 'all'
              : selectedLeadIds.ids.size}
          </Box>{' '}
          selected lead(s)? You can restore archived leads later.
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBulkArchiveOpen(false)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={handleBulkArchive}
            disabled={loading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Archive
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 340,
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 700,
          }}
        >
          <DeleteIcon color="error" fontSize="small" />
          Delete selected leads?
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {selectedLeadIds.type === 'exclude'
              ? 'all'
              : selectedLeadIds.ids.size}
          </Box>{' '}
          selected lead(s)? Deleted leads can be recovered from Archives.
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBulkDeleteOpen(false)}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            color="error"
            onClick={handleBulkDelete}
            disabled={loading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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