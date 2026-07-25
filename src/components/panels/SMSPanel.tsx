import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Message {
  id: string;
  from: 'me' | 'them';
  text: string;
  timestamp: number;
}

interface Thread {
  id: string;
  name: string;
  messages: Message[];
  unread: number;
}

const seedThreads: Thread[] = [
  {
    id: '1',
    name: 'Sarah Lee',
    unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey, are we still on for Thursday?', timestamp: Date.now() - 1000 * 60 * 40 },
      { id: 'm2', from: 'me', text: 'Yep, 2pm works for me', timestamp: Date.now() - 1000 * 60 * 35 },
      { id: 'm3', from: 'them', text: 'Perfect, see you then!', timestamp: Date.now() - 1000 * 60 * 30 },
    ],
  },
  {
    id: '2',
    name: '+1 (555) 019-2837',
    unread: 0,
    messages: [
      { id: 'm4', from: 'them', text: 'Your verification code is 482913', timestamp: Date.now() - 1000 * 60 * 60 * 6 },
    ],
  },
  {
    id: '3',
    name: 'Devon Park',
    unread: 0,
    messages: [
      { id: 'm5', from: 'me', text: 'Sent over the files, let me know if anything is missing', timestamp: Date.now() - 1000 * 60 * 60 * 20 },
      { id: 'm6', from: 'them', text: 'Got them, thanks!', timestamp: Date.now() - 1000 * 60 * 60 * 19 },
    ],
  },
];

const autoReplies = [
  "Sounds good!",
  "Got it, thanks.",
  "Sure, let me check and get back to you.",
  "Haha yeah, totally.",
  "Can I call you in a bit instead?",
];

type ViewMode = 'list' | 'thread' | 'newThread';

export default function SmsPanel() {
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newRecipient, setNewRecipient] = useState('');

  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
  }, []);

  const activeThread = threads.find((t) => t.id === activeId) ?? null;

  const visibleThreads = useMemo(() => {
    return threads
      .filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.timestamp ?? 0;
        const bLast = b.messages[b.messages.length - 1]?.timestamp ?? 0;
        return bLast - aLast;
      });
  }, [threads, query]);

  const openThread = (id: string) => {
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    setActiveId(id);
    setView('thread');
    setDraft('');
  };

  const deleteThread = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) {
      setView('list');
      setActiveId(null);
    }
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeId) return;

    const msg: Message = { id: crypto.randomUUID(), from: 'me', text, timestamp: Date.now() };
    setThreads((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, msg] } : t))
    );
    setDraft('');

    // simulate a reply coming back after a short delay
    const threadId = activeId;
    replyTimeoutRef.current = setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        from: 'them',
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        timestamp: Date.now(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [...t.messages, reply],
                unread: view === 'thread' && activeId === threadId ? 0 : t.unread + 1,
              }
            : t
        )
      );
    }, 1200 + Math.random() * 1500);
  };

  const startNewThread = () => {
    setNewRecipient('');
    setDraft('');
    setView('newThread');
  };

  const createThreadAndSend = () => {
    const recipient = newRecipient.trim();
    const text = draft.trim();
    if (!recipient) return;

    const newId = crypto.randomUUID();
    const messages: Message[] = text
      ? [{ id: crypto.randomUUID(), from: 'me', text, timestamp: Date.now() }]
      : [];

    setThreads((prev) => [{ id: newId, name: recipient, unread: 0, messages }, ...prev]);
    setActiveId(newId);
    setDraft('');
    setView('thread');

    if (text) {
      replyTimeoutRef.current = setTimeout(() => {
        const reply: Message = {
          id: crypto.randomUUID(),
          from: 'them',
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          timestamp: Date.now(),
        };
        setThreads((prev) =>
          prev.map((t) => (t.id === newId ? { ...t, messages: [...t.messages, reply] } : t))
        );
      }, 1200 + Math.random() * 1500);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* LIST VIEW */}
      {view === 'list' && (
        <>
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
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="New message">
              <IconButton color="primary" onClick={startNewThread}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {visibleThreads.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', mt: 4 }}>
                No conversations
              </Typography>
            ) : (
              visibleThreads.map((thread) => {
                const last = thread.messages[thread.messages.length - 1];
                return (
                  <Box
                    key={thread.id}
                    onClick={() => openThread(thread.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 0.5,
                      py: 0.75,
                      borderRadius: 1,
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: '#63636322',
                      bgcolor: thread.unread > 0 ? 'action.hover' : 'transparent',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem' }}>
                      {thread.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: thread.unread > 0 ? 700 : 500, maxWidth: '70%' }}
                        >
                          {thread.name}
                        </Typography>
                        {last && (
                          <Typography variant="caption" sx={{ opacity: 0.6, whiteSpace: 'nowrap' }}>
                            {new Date(last.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ opacity: 0.6, fontWeight: thread.unread > 0 ? 700 : 400, display: 'block' }}
                      >
                        {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : 'No messages yet'}
                      </Typography>
                    </Box>
                    {thread.unread > 0 && (
                      <Box
                        sx={{
                          minWidth: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          fontSize: '0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 0.5,
                        }}
                      >
                        {thread.unread}
                      </Box>
                    )}
                    <IconButton size="small" onClick={(e) => deleteThread(thread.id, e)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })
            )}
          </Box>
        </>
      )}

      {/* THREAD VIEW */}
      {view === 'thread' && activeThread && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconButton size="small" onClick={() => setView('list')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
              {activeThread.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ flex: 1 }}>
              {activeThread.name}
            </Typography>
            <IconButton size="small" onClick={() => deleteThread(activeThread.id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75, px: 0.5 }}>
            {activeThread.messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start',
                  maxWidth: '78%',
                }}
              >
                <Box
                  sx={{
                    bgcolor: msg.from === 'me' ? 'primary.main' : 'action.hover',
                    color: msg.from === 'me' ? 'primary.contrastText' : 'inherit',
                    borderRadius: 2,
                    px: 1.25,
                    py: 0.75,
                    fontSize: '0.8rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.5,
                    display: 'block',
                    textAlign: msg.from === 'me' ? 'right' : 'left',
                    mt: 0.25,
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
          </Box>

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
            />
            <IconButton color="primary" onClick={sendMessage} disabled={!draft.trim()}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* NEW THREAD VIEW */}
      {view === 'newThread' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton size="small" onClick={() => setView('list')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
              New message
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="To: name or phone number"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Box sx={{ flex: 1 }} />

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
            />
            <IconButton color="primary" onClick={createThreadAndSend} disabled={!newRecipient.trim()}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}