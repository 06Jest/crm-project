import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { aiApi } from '../services/backendApi';


import {
  Box, Typography, TextField,  Avatar,
  IconButton, Paper, CircularProgress, Chip,
  Fade, Tooltip, Badge, Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import PersonIcon from '@mui/icons-material/Person';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

const SUGGESTIONS = [
  'Summarize my pipeline',
  'Which leads are cold?',
  'What is my win rate?',
  'Top contacts this month',
  'Draft a follow-up email',
]

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit'});

export default function FloatingAIChat() {

  const contacts = useSelector((s: RootState) => s.contacts.items);
  const leads = useSelector((s: RootState) => s.leads.items);
  const deals = useSelector((s: RootState) => s.deals.items);
  const activities = useSelector((s: RootState) => s.activities.items);

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(()=> {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setMinimized(false);
      setUnreadCount(0);
    } else if (minimized) {
      setMinimized(false);
      setUnreadCount(0);
    } else {
      setMinimized(true)
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  }

  const handleSend = useCallback(async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await aiApi.chat({
        message: messageText,
        history,
        crmContext:{
          totalContacts: contacts.length,
          totalLeads: leads.length,
          totalDeals: deals.length,
          totalActivities: activities.length,
        },
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (minimized || !open) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error
        ? err.message
        : 'AI unavailable. Make sure the backend is running.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorText,
        timestamp: new Date(),
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, contacts, leads, deals, minimized, open, activities]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    setUnreadCount(0);
  };
  

  const isExpanded = open && !minimized;

  return (
    <>

      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            height: minimized ? 56 : { xs: '70vh', sm: 520 },
            maxHeight: '80vh',
            borderRadius: 3,
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1300,
            transition: 'height 0.25s ease',
            border: 1,
            borderColor: 'divider',
          }}
        >

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.5,
              bgcolor: 'secondary.main',
              color: 'white',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={() => minimized && setMinimized(false)}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={700}>
                MiniCRM AI Assistant
              </Typography>
              {!minimized && (
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {contacts.length} contacts · {leads.length} leads · {deals.length} deals
                </Typography>
              )}
            </Box>


            <Box sx={{ display: 'flex', gap: 0.25 }}>
              {messages.length > 0 && !minimized && (
                <Tooltip title="Clear chat">
                  <IconButton
                    size="small"
                    sx={{ color: 'white', opacity: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); handleClear(); }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={minimized ? 'Expand' : 'Minimize'}>
                <IconButton
                  size="small"
                  sx={{ color: 'white', opacity: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
                >
                  <MinimizeIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  sx={{ color: 'white', opacity: 0.8 }}
                  onClick={(e) => { e.stopPropagation(); handleClose(); }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>


          {isExpanded && (
            <>
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  bgcolor: 'background.default',
                }}
              >

                {messages.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <AutoAwesomeIcon
                      sx={{ fontSize: 36, color: 'secondary.main', mb: 1, opacity: 0.7 }}
                    />
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Hi! Ask me anything about your CRM.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                      I have context on your {contacts.length} contacts,
                      {' '}{leads.length} leads, and {deals.length} deals.
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
                      {SUGGESTIONS.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          variant="outlined"
                          clickable
                          onClick={() => handleSend(s)}
                          sx={{
                            fontSize: 11,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'secondary.main', color: 'white', borderColor: 'secondary.main' },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}


                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 0.75,
                      }}
                    >
                      {/* AI avatar */}
                      {!isUser && (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: msg.error ? 'error.main' : 'secondary.main',
                            flexShrink: 0,
                          }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                        </Avatar>
                      )}

                      <Box sx={{ maxWidth: '82%' }}>
                        {/* Bubble */}
                        <Box
                          sx={{
                            bgcolor: isUser
                              ? 'primary.main'
                              : msg.error
                              ? 'error.light'
                              : 'background.paper',
                            color: isUser ? 'white' : 'text.primary',
                            border: !isUser ? 1 : 0,
                            borderColor: 'divider',
                            borderRadius: isUser
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 13 }}
                          >
                            {msg.content}
                          </Typography>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            textAlign: isUser ? 'right' : 'left',
                            mt: 0.25,
                            px: 0.5,
                            fontSize: 10,
                          }}
                        >
                          {formatTime(msg.timestamp)}
                        </Typography>
                      </Box>

                      {isUser && (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'primary.main',
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >
                          <PersonIcon/>
                        </Avatar>
                      )}
                    </Box>
                  );
                })}


                {loading && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                      <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                    </Avatar>
                    <Box
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: '16px 16px 16px 4px',
                        px: 1.5,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                      }}
                    >
                      <CircularProgress size={12} color="secondary" />
                      <Typography variant="caption" color="text.secondary">
                        Thinking...
                      </Typography>
                    </Box>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              <Divider />


              <Box
                sx={{
                  p: 1.5,
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-end',
                  bgcolor: 'background.paper',
                  flexShrink: 0,
                }}
              >
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask about your CRM..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  size="small"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': { fontSize: 13 },
                  }}
                />
                <IconButton
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  color="secondary"
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    '&:hover': { bgcolor: 'secondary.dark' },
                    '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                  }}
                >
                  <SendIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      </Fade>


      <Tooltip
        title={open ? (minimized ? 'Open chat' : 'Minimize') : 'AI Assistant'}
        placement="left"
      >
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1301,
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: 10,
                height: 18,
                minWidth: 18,
              },
            }}
          >
            <IconButton
              onClick={handleToggle}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'secondary.main',
                color: 'white',
                boxShadow: 4,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                  transform: 'scale(1.08)',
                  boxShadow: 8,
                },
                ...(messages.length > 0 && !open ? {
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(156,39,176,0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(156,39,176,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(156,39,176,0)' },
                  },
                } : {}),
              }}
            >
              {isExpanded ? (
                <MinimizeIcon />
              ) : (
                <AutoAwesomeIcon />
              )}
            </IconButton>
          </Badge>
        </Box>
      </Tooltip>
    </>
  );
}