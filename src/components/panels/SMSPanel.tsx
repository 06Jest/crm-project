import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  Tooltip,
  Chip,
  Autocomplete,
  CircularProgress,
  Divider,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchSms, addSms, clearError as clearSmsError } from '../../store/smsSlice';
import { fetchContactsLists } from '../../store/contactsSlice';
import { fetchLeadsLists } from '../../store/leadsSlice';
import type { SmsListItem, CreateSms, SmsStatus } from '../../types/sms';
import { formatName } from '../../utils/formatText';
import ErrorAlert from '../Error';

type ViewMode = 'list' | 'thread' | 'newThread';

type RecipientOption = {
  id: string;
  type: 'lead' | 'contact';
  label: string;
  phone: string;
};

interface DerivedThread {
  key: string;
  type: 'lead' | 'contact';
  id: string;
  name: string;
  phone: string;
  messages: SmsListItem[];
}

const getSmsStatusColor = (status: SmsStatus): string => {
  switch (status) {
    case 'queued':
      return '#c5aa80';
    case 'sending':
      return '#80abce';
    case 'sent':
      return '#a3d977';
    case 'delivered':
      return '#4caf50';
    case 'failed':
      return '#c97771';
    default:
      return '#9e9e9e';
  }
};
const AVATAR_PALETTE = [
  '#6C5CE7',
  '#0984E3',
  '#00B894',
  '#E17055',
  '#D63031',
  '#00A8A8',
  '#8854D0',
  '#F0932B',
  '#20BF6B',
  '#2E86AB',
];

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

const fadeInSx = {
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  animation: 'fadeIn 0.2s ease',
};

const pillInputSx = (radius: number | string) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: radius,
    bgcolor: 'action.hover',
    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
    '& fieldset': { border: 'none' },
    '&.Mui-focused': {
      bgcolor: 'background.paper',
      boxShadow: (theme: Theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
    },
  },
});

const sendButtonSx = {
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  transition: 'background-color 0.15s ease, transform 0.1s ease',
  '&:hover': { bgcolor: 'primary.dark' },
  '&:active': { transform: 'scale(0.94)' },
  '&.Mui-disabled': {
    bgcolor: 'action.disabledBackground',
    color: 'action.disabled',
  },
};

export default function SmsPanel() {
  const dispatch = useDispatch<AppDispatch>();

  const { items: contacts, loaded: cLd } = useSelector((s: RootState) => s.contacts);
  const { items: leads, loaded: lLd } = useSelector((s: RootState) => s.leads);
  const {
    items: smsItems,
    loading: smsLoading,
    loaded: smsLd,
    error,
  } = useSelector((s: RootState) => s.sms);

  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientOption | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!smsLd) await dispatch(fetchSms()).unwrap();
        if (!cLd) await dispatch(fetchContactsLists()).unwrap();
        if (!lLd) await dispatch(fetchLeadsLists()).unwrap();
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  }, [smsLd, cLd, lLd, dispatch]);

  const recipientOptions: RecipientOption[] = useMemo(
    () => [
      ...contacts.map((c) => ({
        id: c.id,
        type: 'contact' as const,
        label: formatName(c.first_name, c.last_name),
        phone: c.phone,
      })),
      ...leads.map((l) => ({
        id: l.id,
        type: 'lead' as const,
        label: formatName(l.first_name, l.last_name),
        phone: l.phone,
      })),
    ],
    [contacts, leads]
  );


  const threads: DerivedThread[] = useMemo(() => {
    const map = new Map<string, DerivedThread>();

    for (const sms of smsItems) {
      const isLead = !!sms.lead_id;
      const refId = isLead ? sms.lead_id : sms.contact_id;
      if (!refId) continue;

      const key = `${isLead ? 'lead' : 'contact'}:${refId}`;

      if (!map.has(key)) {
        const person = isLead ? sms.lead : sms.contact;
        map.set(key, {
          key,
          type: isLead ? 'lead' : 'contact',
          id: refId,
          name: person ? formatName(person.first_name, person.last_name) : 'Unknown',
          phone: person?.phone ?? '',
          messages: [],
        });
      }

      map.get(key)!.messages.push(sms);
    }

    return Array.from(map.values())
      .map((t) => ({
        ...t,
        messages: [...t.messages].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      }))
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.created_at ?? '';
        const bLast = b.messages[b.messages.length - 1]?.created_at ?? '';
        return new Date(bLast).getTime() - new Date(aLast).getTime();
      });
  }, [smsItems]);

  const activeThread = threads.find((t) => t.key === activeKey) ?? null;

  const visibleThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;

    return threads.filter((t) => {
      const searchable = [t.name, t.phone, ...t.messages.map((m) => m.content)]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [threads, query]);

  const openThread = useCallback((key: string) => {
    setActiveKey(key);
    setView('thread');
    setDraft('');
  }, []);

  const startNewThread = useCallback(() => {
    dispatch(clearSmsError());
    setSelectedRecipient(null);
    setDraft('');
    setView('newThread');
  }, [dispatch]);

  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text || !activeThread) return;

    const payload: CreateSms =
      activeThread.type === 'lead'
        ? { lead_id: activeThread.id, content: text }
        : { contact_id: activeThread.id, content: text };

    setSending(true);
    try {
      await dispatch(addSms(payload)).unwrap();
      setDraft('');
    } catch {
      // Error surfaced via redux state
    } finally {
      setSending(false);
    }
  }, [draft, activeThread, dispatch]);

  const createThreadAndSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !selectedRecipient) return;

    const payload: CreateSms =
      selectedRecipient.type === 'lead'
        ? { lead_id: selectedRecipient.id, content: text }
        : { contact_id: selectedRecipient.id, content: text };

    setSending(true);
    try {
      await dispatch(addSms(payload)).unwrap();
      setActiveKey(`${selectedRecipient.type}:${selectedRecipient.id}`);
      setDraft('');
      setSelectedRecipient(null);
      setView('thread');
    } catch {
      // Error surfaced via redux state
    } finally {
      setSending(false);
    }
  }, [draft, selectedRecipient, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {error && (
        <Box sx={{ width: '100%', mb: 1 }}>
          <ErrorAlert message={error} />
        </Box>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...fadeInSx }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search messages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={pillInputSx(999)}
            />
            <Tooltip title="New message">
              <IconButton
                onClick={startNewThread}
                sx={{
                  color: 'primary.main',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {smsLoading && !smsLd ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 4 }}>
              <CircularProgress size={22} />
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                Loading conversations…
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 999 },
              }}
            >
              {visibleThreads.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 4,
                    opacity: 0.6,
                  }}
                >
                  <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 32 }} />
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    No conversations {query ? 'match your search' : 'yet'}
                  </Typography>
                </Box>
              ) : (
                visibleThreads.map((thread) => {
                  const last = thread.messages[thread.messages.length - 1];
                  return (
                    <Box
                      key={thread.key}
                      onClick={() => openThread(thread.key)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 0.5,
                        py: 0.75,
                        borderRadius: 1,
                        cursor: 'pointer',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          bgcolor: getAvatarColor(thread.name),
                          color: '#fff',
                        }}
                      >
                        {thread.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: '70%' }}>
                            {thread.name}
                          </Typography>
                          {last && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                whiteSpace: 'nowrap',
                                fontVariantNumeric: 'tabular-nums',
                              }}
                            >
                              {new Date(last.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            color: 'text.secondary',
                            display: 'block',
                            fontStyle: last ? 'normal' : 'italic',
                          }}
                        >
                          {last ? last.content : 'No messages yet'}
                        </Typography>
                      </Box>
                      {last && (
                        <Chip
                          label={last.status}
                          size="small"
                          sx={{
                            bgcolor: alpha(getSmsStatusColor(last.status), 0.16),
                            color: getSmsStatusColor(last.status),
                            border: '1px solid',
                            borderColor: alpha(getSmsStatusColor(last.status), 0.4),
                            height: 18,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            letterSpacing: 0.2,
                          }}
                        />
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          )}
        </Box>
      )}

      {view === 'thread' && activeThread && (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowy: 'auto', height: 470, ...fadeInSx }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => setView('list')}
              sx={{ transition: 'background-color 0.15s ease', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: getAvatarColor(activeThread.name),
                color: '#fff',
              }}
            >
              {activeThread.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {activeThread.name}
              </Typography>
              {activeThread.phone && (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.25 }}
                >
                  <PhoneRoundedIcon sx={{ fontSize: 11 }} />
                  {activeThread.phone}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              px: 0.5,
              mt: 0.75,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'action.disabled', borderRadius: 999 },
            }}
          >
            <Box height={370}></Box>
            {activeThread.messages.map((msg) => (
              <Box key={msg.id} sx={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
                
                <Box
                  sx={{
                    backgroundColor: `primary.main`,
                    color: 'primary.contrastText',
                    borderRadius: '14px 14px 4px 14px',
                    px: 1.25,
                    py: 0.75,
                    fontSize: '0.8rem',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {msg.content}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatName(msg.sender.first_name, msg.sender.last_name)} ·{' '}
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  <Chip
                    label={msg.status}
                    size="small"
                    sx={{
                      bgcolor: alpha(getSmsStatusColor(msg.status), 0.16),
                      color: getSmsStatusColor(msg.status),
                      border: '1px solid',
                      borderColor: alpha(getSmsStatusColor(msg.status), 0.4),
                      height: 16,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      letterSpacing: 0.2,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Text message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              multiline
              maxRows={3}
              disabled={sending}
              sx={pillInputSx('18px')}
            />
            <IconButton onClick={sendMessage} disabled={!draft.trim() || sending} sx={sendButtonSx}>
              {sending ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
      )}

      {/* NEW THREAD VIEW */}
      {view === 'newThread' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', ...fadeInSx }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => setView('list')}
              sx={{ transition: 'background-color 0.15s ease', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
              New message
            </Typography>
          </Box>

          <Autocomplete
            size="small"
            options={recipientOptions}
            getOptionLabel={(option) => option.label}
            value={selectedRecipient}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: getAvatarColor(option.label),
                      color: '#fff',
                    }}
                  >
                    {option.label.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                    {option.label}
                  </Typography>
                  <Chip
                    label={option.type}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      bgcolor: option.type === 'lead' ? alpha('#0984E3', 0.16) : alpha('#20BF6B', 0.16),
                      color: option.type === 'lead' ? '#0984E3' : '#20BF6B',
                    }}
                  />
                </Box>
              </li>
            )}
            onChange={(_, option) => setSelectedRecipient(option)}
            sx={{ mb: 1, ...pillInputSx('18px') }}
            renderInput={(params) => <TextField {...params} placeholder="To: lead or contact" />}
          />

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!selectedRecipient && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, opacity: 0.5 }}>
                <PersonSearchRoundedIcon sx={{ fontSize: 32 }} />
                <Typography variant="caption" sx={{ textAlign: 'center' }}>
                  Choose a lead or contact to start texting
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Text message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  createThreadAndSend();
                }
              }}
              multiline
              maxRows={3}
              disabled={sending}
              sx={pillInputSx('18px')}
            />
            <IconButton
              onClick={createThreadAndSend}
              disabled={!selectedRecipient || !draft.trim() || sending}
              sx={sendButtonSx}
            >
              {sending ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
