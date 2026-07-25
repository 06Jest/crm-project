import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Badge,
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

interface Chat {
  id: string;
  name: string;
  online: boolean;
  messages: Message[];
  unread: number;
}

const seedChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Lee',
    online: true,
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey, did you see the updated designs?', timestamp: Date.now() - 1000 * 60 * 20 },
      { id: 'm2', from: 'me', text: 'Not yet, sending me the link?', timestamp: Date.now() - 1000 * 60 * 18 },
      { id: 'm3', from: 'them', text: 'Just shared it in the drive folder', timestamp: Date.now() - 1000 * 60 * 15 },
    ],
  },
  {
    id: '2',
    name: 'Dev Team',
    online: true,
    unread: 0,
    messages: [
      { id: 'm4', from: 'them', text: 'Deploy is done, staging is live', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
      { id: 'm5', from: 'me', text: 'Nice, testing it now', timestamp: Date.now() - 1000 * 60 * 60 * 2 + 60000 },
    ],
  },
  {
    id: '3',
    name: 'Devon Park',
    online: false,
    unread: 0,
    messages: [
      { id: 'm6', from: 'me', text: 'Lunch tomorrow?', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
      { id: 'm7', from: 'them', text: 'Sure, 12:30?', timestamp: Date.now() - 1000 * 60 * 60 * 23 },
    ],
  },
];

const autoReplies = [
  "Sounds good, thanks!",
  "Let me take a look and get back to you.",
  "Haha for sure.",
  "Can we hop on a quick call?",
  "Got it 👍",
];

type ViewMode = 'list' | 'thread' | 'newChat';

export default function ChatsPanel() {
  const [chats, setChats] = useState<Chat[]>(seedChats);
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ViewMode>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [typing, setTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeId, view, typing]);

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

  const visibleChats = useMemo(() => {
    return chats
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.timestamp ?? 0;
        const bLast = b.messages[b.messages.length - 1]?.timestamp ?? 0;
        return bLast - aLast;
      });
  }, [chats, query]);

  const openChat = (id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setActiveId(id);
    setView('thread');
    setDraft('');
    setTyping(false);
  };

  const deleteChat = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setView('list');
      setActiveId(null);
    }
  };

  const queueReply = (chatId: string, isViewing: boolean) => {
    // "they" start typing shortly after your message lands
    typingTimeoutRef.current = setTimeout(() => {
      if (isViewing) setTyping(true);

      replyTimeoutRef.current = setTimeout(() => {
        setTyping(false);
        const reply: Message = {
          id: crypto.randomUUID(),
          from: 'them',
          text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
          timestamp: Date.now(),
        };
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [...c.messages, reply],
                  unread: isViewing ? 0 : c.unread + 1,
                }
              : c
          )
        );
      }, 1600 + Math.random() * 1400);
    }, 500);
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeId) return;

    const msg: Message = { id: crypto.randomUUID(), from: 'me', text, timestamp: Date.now() };
    setChats((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c))
    );
    setDraft('');
    queueReply(activeId, true);
  };

  const startNewChat = () => {
    setNewRecipient('');
    setDraft('');
    setView('newChat');
  };

  const createChatAndSend = () => {
    const recipient = newRecipient.trim();
    const text = draft.trim();
    if (!recipient) return;

    const newId = crypto.randomUUID();
    const messages: Message[] = text
      ? [{ id: crypto.randomUUID(), from: 'me', text, timestamp: Date.now() }]
      : [];

    setChats((prev) => [
      { id: newId, name: recipient, online: Math.random() > 0.4, unread: 0, messages },
      ...prev,
    ]);
    setActiveId(newId);
    setDraft('');
    setView('thread');

    if (text) queueReply(newId, true);
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
              placeholder="Search chats..."
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
            <Tooltip title="New chat">
              <IconButton color="primary" onClick={startNewChat}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {visibleChats.length === 0 ? (
              <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', mt: 4 }}>
                No conversations
              </Typography>
            ) : (
              visibleChats.map((chat) => {
                const last = chat.messages[chat.messages.length - 1];
                return (
                  <Box
                    key={chat.id}
                    onClick={() => openChat(chat.id)}
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
                      bgcolor: chat.unread > 0 ? 'action.hover' : 'transparent',
                      '&:hover': { bgcolor: 'action.selected' },
                    }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-dot': {
                          bgcolor: chat.online ? '#4caf50' : '#9e9e9e',
                          border: '2px solid',
                          borderColor: 'background.paper',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                        },
                      }}
                    >
                      <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem' }}>
                        {chat.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: chat.unread > 0 ? 700 : 500, maxWidth: '70%' }}
                        >
                          {chat.name}
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
                        sx={{ opacity: 0.6, fontWeight: chat.unread > 0 ? 700 : 400, display: 'block' }}
                      >
                        {last ? (last.from === 'me' ? `You: ${last.text}` : last.text) : 'No messages yet'}
                      </Typography>
                    </Box>
                    {chat.unread > 0 && (
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
                        {chat.unread}
                      </Box>
                    )}
                    <IconButton size="small" onClick={(e) => deleteChat(chat.id, e)}>
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
      {view === 'thread' && activeChat && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <IconButton size="small" onClick={() => setView('list')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-dot': {
                  bgcolor: activeChat.online ? '#4caf50' : '#9e9e9e',
                  border: '2px solid',
                  borderColor: 'background.paper',
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                },
              }}
            >
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                {activeChat.name.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {activeChat.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {activeChat.online ? 'Active now' : 'Offline'}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => deleteChat(activeChat.id)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            ref={scrollRef}
            sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75, px: 0.5 }}
          >
            {activeChat.messages.map((msg) => (
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

            {typing && (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Box
                  sx={{
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    px: 1.5,
                    py: 1,
                    display: 'flex',
                    gap: 0.4,
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: 'text.secondary',
                        animation: 'dockTypingBounce 1.2s infinite',
                        animationDelay: `${i * 0.15}s`,
                        '@keyframes dockTypingBounce': {
                          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
                          '30%': { transform: 'translateY(-3px)', opacity: 1 },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Message"
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

      {/* NEW CHAT VIEW */}
      {view === 'newChat' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton size="small" onClick={() => setView('list')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" fontWeight={700} sx={{ ml: 0.5 }}>
              New chat
            </Typography>
          </Box>

          <TextField
            size="small"
            placeholder="To: name"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            sx={{ mb: 1 }}
          />

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  createChatAndSend();
                }
              }}
              multiline
              maxRows={3}
            />
            <IconButton color="primary" onClick={createChatAndSend} disabled={!newRecipient.trim()}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}