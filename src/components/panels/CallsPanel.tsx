import  { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Typography,
  Chip,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Close as CloseIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import type { CallFilters, CallListItem, CallOutcome, CallPriority, CallStatus, CallType, CreateCall, CreateCallInput } from '../../types/call';
import type { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { addCall, clearError as clearCallsError, endCall, fetchCalls, startCall } from '../../store/callsSlice';
import { fetchContactsLists } from '../../store/contactsSlice';
import { fetchLeadsLists } from '../../store/leadsSlice';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AddCallIcon from '@mui/icons-material/AddCall';
import ErrorAlert from '../Error';
import { formatName, formatShortTitle} from '../../utils/formatText';
import { fetchMembersIDNames } from '../../store/ProfileSlice';



const formatDuration = (seconds: number | null): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getStatusColor = (status: CallStatus): string => {
  switch (status) {
    case 'active':
      return '#7bce7e';
    case 'dialing':
      return '#75a1c5';
    case 'scheduled':
      return '#c5aa80';
    case 'completed':
      return 'primary.main';
    case 'cancelled':
      return '#c06e68';
    default:
      return '#9e9e9e';
  }
};

const getPriorityLabel = (priority: CallPriority): string => {
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return priority;
  }
};

const getPriorityColor = (priority: CallPriority): 'error' | 'warning' | 'default' => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'default';
  }
};

export default function CallsPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeCall, setActiveCall] = useState<CallListItem | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CallFilters>({});
  const [callOutcome, setCallOutcome] = useState<CallOutcome>('other');
  const [callNotes, setCallNotes] = useState('');
  const [recipientType, setRecipientType] = useState<"lead" | "contact">("lead");
  
  const [formData, setFormData] = useState<CreateCallInput>({
    subject: '',
    type: 'other',
    priority: 'medium',
    notes: '',
    assigned_to: '',
    lead_id: '',
    contact_id: '',
    scheduled_for: '',
  });

  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads,  loaded:lLd } = useSelector((s: RootState) => s.leads);
   const { items: calls, loading: caL, loaded: caLd, error } = useSelector(
    (state: RootState) => state.calls
  );
  const {
  items: members,
  loaded: mLd,
} = useSelector((state: RootState) => state.profile);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
      const loadData = async () => {
        try {
          if (!caLd) await dispatch(fetchCalls()).unwrap();
          if (!cLd) await dispatch(fetchContactsLists()).unwrap();
          if (!lLd) await dispatch(fetchLeadsLists()).unwrap();
          if (!mLd) await dispatch(fetchMembersIDNames()).unwrap();
        } catch {
          // Error handled by Redux state
        } 
      };
      loadData();
    }, [caLd, cLd, lLd, mLd,  dispatch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (dialTimeoutRef.current) clearTimeout(dialTimeoutRef.current);
    };
  }, []);


  useEffect(() => {
    if (callStatus === 'active') {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [callStatus]);

  type RecipientOption = {
    id: string;
    type: "lead" | "contact";
    label: string;
    phone: string;
  };

  const recipientOptions: RecipientOption[] = [
    ...contacts.map((contact) => ({
      id: contact.id,
      type: "contact" as const,
      label: `${contact.first_name} ${contact.last_name}`,
      phone: contact.phone,
    })),
    ...leads.map((lead) => ({
      id: lead.id,
      type: "lead" as const,
      label: `${lead.first_name} ${lead.last_name}`,
      phone: lead.phone,
    })),
  ];
  
  const selectedRecipient = recipientOptions.find(option =>
    option.id === formData.lead_id ||
    option.id === formData.contact_id
  );

  const selectedPhone = selectedRecipient?.phone ?? "";
  console.log(activeCall)

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      if (filters.status && call.status !== filters.status) return false;
      if (filters.type && call.type !== filters.type) return false;
      if (filters.priority && call.priority !== filters.priority) return false;
      if (filters.assigned_to && call.assigned_to !== filters.assigned_to) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        const searchable = [
          call.subject,
          call.type,
          call.priority,
          call.notes,
          call.assigned_user.first_name,
          call.assigned_user.last_name,
          call.creator.first_name,
          call.creator.last_name,
          call.lead?.first_name,
          call.lead?.last_name,
          call.contact?.first_name,
          call.contact?.last_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [calls, searchQuery, filters]);

  const visibleCalls = useMemo(() => {
    switch (filters.status) {
      case "scheduled":
        return filteredCalls.filter(c => c.status === "scheduled");

      case "completed":
        return filteredCalls.filter(c => c.status === "completed");

      case "active":
        return filteredCalls.filter(c => c.status === "active");

      default:
        return filteredCalls;
    }
  }, [filteredCalls, filters.status]);

  const emptyState = useMemo(() => {
    switch (filters.status) {
      case "scheduled":
        return {
          icon: <ScheduleIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />,
          text: "No scheduled calls",
        };

      case "completed":
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />,
          text: "No completed calls",
        };

      case "active":
        return {
          icon: <CallIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />,
          text: "No active calls",
        };

      default:
        return {
          icon: <CallIcon sx={{ fontSize: 48, color: "#ccc", mb: 1 }} />,
          text: "No calls found",
        };
    }
  }, [filters.status]);

  const contactsMap = useMemo(
      () => new Map(contacts.map(c => [c.id, c])),
      [contacts]
    );
  
    const leadsMap = useMemo(
      () => new Map(leads.map(l => [l.id, l])),
      [leads]
    );
  
  const getName = (call: CallListItem) => {
  if (call.contact_id) {
    const contact = contactsMap.get(call.contact_id);

    return contact
      ? formatName(contact.first_name, contact.last_name)
      : "";
  }

  if (call.lead_id) {
    const lead = leadsMap.get(call.lead_id);

    return lead
      ? formatName(lead.first_name, lead.last_name)
      : "";
  }

  return "Unknown";
};


  const handleStartCall = useCallback(
    async (call: CallListItem) => {
      try {
        setActiveCall(call);
        setCallStatus("dialing");
        setElapsed(0);
        setMuted(false);
        setSpeaker(true);
        setCallOutcome(call.outcome || 'other'); 
        setCallNotes(call.notes ?? '');            

        const updatedCall: CallListItem = await dispatch(startCall(call.id)).unwrap();
        setActiveCall(updatedCall);

        dialTimeoutRef.current = setTimeout(() => {
          setCallStatus("ringing");
          dialTimeoutRef.current = setTimeout(() => {
            setCallStatus("active");
          }, 1800);
        }, 1000);
      } catch {
        setActiveCall(null);
        setCallStatus(null);
      }
    },
    [dispatch]
  );

  const handleEndCall = useCallback(
    async (call: CallListItem) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (dialTimeoutRef.current) clearTimeout(dialTimeoutRef.current);

      await dispatch(
        endCall({
          id: call.id,
          call: {
            outcome: callOutcome,
            notes: callNotes,
          },
        })
      ).unwrap();

      if (activeCall?.id === call.id) {
        setActiveCall(null);
        setCallStatus(null);
        setElapsed(0);
        setCallOutcome("other");
        setCallNotes("");
      }
    },
    [dispatch, activeCall, callOutcome, callNotes]
  );

  const handleCreateCall = async () => {
    if (!formData.subject.trim()) return;

    const payload: CreateCall = {
      assigned_to: formData.assigned_to,
      lead_id: formData.lead_id || null,
      contact_id: formData.contact_id || null,
      subject: formData.subject,
      notes: formData.notes || "",
      type: formData.type,
      priority: formData.priority || "medium",
      scheduled_for: formData.scheduled_for
      ? new Date(formData.scheduled_for).toISOString()
      : null,
    };

    try {
      const createdCall = await dispatch(addCall(payload)).unwrap();

      setOpenCreateDialog(false);

      setFormData({
        subject: "",
        type: "sales",
        priority: "medium",
        notes: "",
        assigned_to: "",
        lead_id: "",
        contact_id: "",
        scheduled_for: "",
      });

      if (!payload.scheduled_for) {
        handleStartCall(createdCall);
      }

    } catch  {
      // Error from state
    }
  };

  if (callStatus && activeCall) {
  const statusLabel =
    callStatus === 'dialing' ? 'Dialing…' : callStatus === 'ringing' ? 'Ringing…' : formatDuration(elapsed);

  const contactName = getName(activeCall);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: '#fff',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            fontSize: '1rem',
            fontWeight: 700,
            border: '2px solid rgba(255,255,255,0.5)',
            bgcolor: 'rgba(255,255,255,0.15)',
          }}
        >
          {contactName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap>
            {callStatus === 'active' ? contactName : `Calling ${contactName}`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            {callStatus === 'active' && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#92e695',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                    '100%': { opacity: 1 },
                  },
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            )}
            <Typography
              variant="caption"
              sx={{ opacity: 0.85, fontVariantNumeric: callStatus === 'active' ? 'tabular-nums' : 'normal' }}
            >
              {statusLabel}
            </Typography>
          </Box>
        </Box>

        {callStatus === 'active' && (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={muted ? 'Unmute' : 'Mute'}>
              <IconButton
                size="small"
                onClick={() => setMuted((m) => !m)}
                sx={{
                  color: '#fff',
                  bgcolor: muted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                {muted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title={speaker ? 'Speaker Off' : 'Speaker On'}>
              <IconButton
                size="small"
                onClick={() => setSpeaker((s) => !s)}
                sx={{
                  color: '#fff',
                  bgcolor: speaker ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                }}
              >
                {speaker ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Stack>
        )}

        <Tooltip title="End Call">
          <IconButton
            size="small"
            onClick={() => handleEndCall(activeCall)}
            sx={{
              bgcolor: '#c97771',
              color: '#fff',
              '&:hover': { bgcolor: '#b56560' },
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}
          >
            <CallEndIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={1.5} sx={{ p: 1.5, flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {activeCall.subject && (
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
              Subject
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatShortTitle(activeCall.subject)}
            </Typography>
          </Box>
        )}

        <FormControl
          size="small"
          fullWidth
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
          }}
        >
          <InputLabel>Outcome</InputLabel>
          <Select value={callOutcome} label="Outcome" onChange={(e) => setCallOutcome(e.target.value)}>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="interested">Interested</MenuItem>
            <MenuItem value="not_interested">Not Interested</MenuItem>
            <MenuItem value="callback_requested">Requested call back</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            p: 1.2,
          }}
        >
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5, mb: 0.5 }}>
            Notes
          </Typography>
          <TextField
            placeholder="Jot down details while you talk…"
            multiline
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            value={callNotes}
            onChange={(e) => setCallNotes(e.target.value)}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' },
              '& .MuiInputBase-input': { height: '100% !important', overflowY: 'auto' },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 470, overflowY: 'auto' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2  }}>
            Calls
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.90rem',
              },
            }}
          />
          <IconButton
            onClick={() => setOpenCreateDialog(true)}
            sx={{
              background: 'primary.main',
              p: '5px'
            }}
          >
            <AddCallIcon  sx={{fontSize: '1.5rem'}}/>
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 0.8, display: 'flex', gap: 1, overflowX: 'auto', pt: 2, borderBottom: '1px solid #e0e0e0' }}>
         <FormControl size="small">
            <InputLabel sx={{ fontSize: "0.85rem", mt: "-5px" }}>
              Status
            </InputLabel>

            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: (e.target.value as CallStatus) || undefined,
                })
              }
              sx={{
                width: 120,
                "& .MuiInputBase-input": {
                  py: "3px",
                  fontSize: 11,
                  fontWeight: 700,
                },
              }}
            >
              <MenuItem value="">All ({calls.length})</MenuItem>
              <MenuItem value="scheduled">
                Scheduled ({calls.filter(c => c.status === "scheduled").length})
              </MenuItem>
              <MenuItem value="completed">
                Completed ({calls.filter(c => c.status === "completed").length})
              </MenuItem>
              <MenuItem value="active">
                Active ({calls.filter(c => c.status === "active").length})
              </MenuItem>
            </Select>
          </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{fontSize: '0.85rem', mt: '-5px'}}>Type</InputLabel>
          <Select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: (e.target.value as CallType) || undefined })}
            sx={{
              width: 120,
              "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
            <MenuItem value="support">Support</MenuItem>
            <MenuItem value="follow_up">Follow Up</MenuItem>
            <MenuItem value="demo">Demo</MenuItem>
            <MenuItem value="onboarding">Onboarding</MenuItem>
            <MenuItem value="renewal">Renewal</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{fontSize: '0.85rem', mt: '-5px'}}>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: (e.target.value as CallPriority) || undefined })}
            sx={{
              width: 120,
              "& .MuiInputBase-input": { py: "3px", fontSize: 11, fontWeight: 700 },
            }}
            
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          sx={{p: "2px"}}
          onClick={() => setFilters({})}
        >
          <ClearAllIcon sx={{fontSize: '1.5rem'}}/>
        </IconButton>
      </Box>
      {error && (
        <Box sx={{ width: "100%", my: 1 }}>
          <ErrorAlert message={error} />
        </Box>
      )}
      {caL && !caLd ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={22} />
        </Box>
      ) : (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          p: 0.2,
        }}
      >
        
        {visibleCalls.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            {emptyState.icon}
            <Typography color="text.secondary">
              {emptyState.text}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1} >
            {visibleCalls.map((call) => (
              <Card
                key={call.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 10px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => {
                  console.log(call);
                  setSelectedCall(call);
                  setOpenDetailDialog(true);
                }}
              >
                <CardContent sx={{ p: 1, "&:last-child": {pb: 1,}}}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar>
                      {(call.contact?.first_name || call.lead?.first_name || '?').charAt(0)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {call.subject}
                        </Typography>
                        <Chip
                          label={call.type}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                          }}
                        />
                        <Chip
                          label={call.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(call.status),
                            color: '#fff',
                            height: 18,
                            fontSize: '0.6rem',
                          }}
                        />
                      </Box>

                      <Typography color="textSecondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                        {getName(call)}
                        {" • "}
                        Assigned to{" "}
                        {formatName(
                          call.assigned_user.first_name,
                          call.assigned_user.last_name
                        )}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {call.priority && (
                          <Chip
                            icon={<FlagIcon  />}
                            label={getPriorityLabel(call.priority)}
                            size="small"
                            color={getPriorityColor(call.priority)}
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              "& .MuiChip-icon": {fontSize: "0.75rem"}
                            }}
                          />
                        )}
                        {call.duration_seconds && (
                          <Chip
                            icon={<TimerIcon />}
                            label={formatDuration(call.duration_seconds)}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              "& .MuiChip-icon": {fontSize: "0.75rem"}
                            }}
                          />
                        )}
                        {call.outcome && (
                          <Chip
                            icon={<CheckCircleIcon 
                                />}
                            label={call.outcome}
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              "& .MuiChip-icon": {fontSize: "0.75rem"}
                            }}
                          />
                        )}
                        {call.scheduled_for && (
                          <Chip
                            icon={<ScheduleIcon  />}
                            label={new Date(call.scheduled_for).toLocaleString()}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              "& .MuiChip-icon": {fontSize: "0.75rem"}
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {call.status !== 'completed' && call.status !== 'active' && (
                        <Tooltip title="Call">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartCall(call);
                            }}
                            sx={{ color: '#4caf50' }}
                          >
                            <CallIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {call.status === 'active' && (
                        <Tooltip title="End Call">
                          <IconButton
                            size="small"
                            color='error'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEndCall(call);
                            }}
                          >
                            <CallEndIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      )}

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: '#fff',
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32,color: 'white' , bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AddCallIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="subtitle1" fontWeight={700}>
              New Call
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => {
              dispatch(clearCallsError());
              setOpenCreateDialog(false);
            }}
            sx={{ color: '#fff' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2}}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && (
              <Box sx={{ width: '100%' }}>
                <ErrorAlert message={error} />
              </Box>
            )}

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: 0.5, display: 'block', mb: 1 }}
              >
                Recipient
              </Typography>

              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ width: '50%' }}>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                      value={formData.assigned_to || ''}
                      label="Assigned To"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assigned_to: e.target.value,
                        })
                      }
                    >
                      {members.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {member.display_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel>Recipient Type</InputLabel>
                    <Select
                      size="small"
                      value={recipientType}
                      onChange={(e) => setRecipientType(e.target.value as 'lead' | 'contact')}
                      label="Recipient Type"
                    >
                      <MenuItem value="lead">Lead</MenuItem>
                      <MenuItem value="contact">Contact</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Autocomplete
                    size="small"
                    options={recipientOptions}
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option) => (
                      <li {...props}>
                        {option.label} ({option.type})
                      </li>
                    )}
                    onChange={(_, option) => {
                      if (!option) {
                        setFormData({
                          ...formData,
                          lead_id: undefined,
                          contact_id: undefined,
                        });
                        return;
                      }

                      if (option.type === 'lead') {
                        setFormData({
                          ...formData,
                          lead_id: option.id,
                          contact_id: undefined,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          contact_id: option.id,
                          lead_id: undefined,
                        });
                      }
                    }}
                    sx={{ width: '50%' }}
                    renderInput={(params) => <TextField {...params} label="Recipient" />}
                  />

                  <TextField
                    sx={{ width: '50%' }}
                    size="small"
                    label="Phone Number"
                    value={selectedPhone}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CallIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: 0.5, display: 'block', mb: 1 }}
              >
                Call Info
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subject: e.target.value,
                    })
                  }
                />

                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Call Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Call Type"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as CallType,
                        })
                      }
                    >
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="follow_up">Follow Up</MenuItem>
                      <MenuItem value="support">Support</MenuItem>
                      <MenuItem value="demo">Demo</MenuItem>
                      <MenuItem value="onboarding">Onboarding</MenuItem>
                      <MenuItem value="renewal">Renewal</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as CallPriority,
                        })
                      }
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: 0.5, display: 'block', mb: 1 }}
              >
                Notes &amp; Scheduling
              </Typography>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                />

                <TextField
                  fullWidth
                  size="small"
                  type="datetime-local"
                  label="Schedule Call"
                  value={formData.scheduled_for || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduled_for: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2}}>
          <Button
            onClick={() => {
              dispatch(clearCallsError());
              setOpenCreateDialog(false);
            }}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateCall}
            disabled={
              caL ||
              !formData.subject ||
              (!formData.lead_id && !formData.contact_id) ||
              !formData.assigned_to
            }
            sx={{ borderRadius: 2 }}
            startIcon={!caL ? (formData.scheduled_for ? <ScheduleIcon /> : <CallIcon />) : undefined}
          >
            {caL ? (
              <CircularProgress size={15} color="inherit" />
            ) : formData.scheduled_for ? (
              'Schedule Call'
            ) : (
              'Start Call'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      

      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: '#fff',
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
              <CallIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Typography variant="subtitle1" fontWeight={700}>
              Call Details
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenDetailDialog(false)} sx={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {selectedCall && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ my: 1.2 }}>
                  {selectedCall.subject}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={selectedCall.type} size="small" variant="outlined" />
                  <Chip
                    label={selectedCall.status}
                    size="small"
                    sx={{ bgcolor: getStatusColor(selectedCall.status), color: '#fff'}}
                  />
                  <Chip
                    icon={<FlagIcon />}
                    label={getPriorityLabel(selectedCall.priority)}
                    size="small"
                    color={getPriorityColor(selectedCall.priority)}
                    variant="outlined"
                  />
                  {selectedCall.outcome && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={selectedCall.outcome}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>

              {(selectedCall.duration_seconds || selectedCall.scheduled_for) && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    flexWrap: 'wrap',
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {selectedCall.duration_seconds && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimerIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Duration
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatDuration(selectedCall.duration_seconds)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {selectedCall.scheduled_for && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Scheduled For
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {new Date(selectedCall.scheduled_for).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                  People
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatName(selectedCall.assigned_user.first_name, selectedCall.assigned_user.last_name)}
                    </Typography>
                  </Box>
                  {(selectedCall.contact || selectedCall.lead) && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCall.contact ? 'Contact' : 'Lead'}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedCall.contact
                          ? `${selectedCall.contact.first_name} ${selectedCall.contact.last_name}`
                          : selectedCall.lead
                          ? `${selectedCall.lead.first_name} ${selectedCall.lead.last_name}`
                          : 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {selectedCall.notes && (
                <Box
                  sx={{
                    p: 1.5,
                    height: 150,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                    {selectedCall.notes}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pt: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created By
                  </Typography>
                  <Typography variant="body2">
                    {formatName(selectedCall.creator.first_name, selectedCall.creator.last_name)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedCall.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, }}>
          {selectedCall && selectedCall.status !== 'completed' && (
            <Button
              variant="contained"
              startIcon={<CallIcon />}
              onClick={() => {
                handleStartCall(selectedCall);
                setOpenDetailDialog(false);
              }}
              sx={{ borderRadius: 2 }}
            >
              Call
            </Button>
          )}
          <Button onClick={() => setOpenDetailDialog(false)} sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
