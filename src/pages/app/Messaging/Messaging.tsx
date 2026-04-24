import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchProfiles,
  fetchConversation,
  sendMessage,
  markMessagesRead,
  fetchUnreadCounts,
  receiveMessage,
  setActiveConversation,
} from '../../../store/messagingSlice';
import { subscribeToMessages } from '../../../services/messagingService';
import { useAuthContext } from '../../../hooks/useAuthContext';

import {
  Box, Typography, TextField, Button, Avatar,
  List, ListItem, ListItemAvatar, ListItemText,
  Paper, Chip, CircularProgress, Badge, Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';

const formatTime = (dateStr: string): string => {
  const date = new Date (dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleDateString('en-PH' , {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
  export default function Messaging() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuthContext();

    const {
      profiles,
      conversations,
      unreadCounts,
      activeConversationId,
      loading,
    } = useSelector((state: RootState) => state.messaging);

    const [messageText, setMessageText] = useState('');
    const [selectedContact, setSelectedContact] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (user) {
        dispatch(fetchProfiles());
        dispatch(fetchUnreadCounts(user.id));
      }
    }, [dispatch, user]);

    useEffect(() => {
      if (!user) return;

      const unsubscribe = subscribeToMessages(user.id, (newMessage) => {
        dispatch(receiveMessage(newMessage));
      });

      return unsubscribe;
    }, [user, dispatch]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'});
    }, [conversations, activeConversationId]);

    const handleSelectUser = (otherUserId: string) => {
      if (!user) return;;
      dispatch(setActiveConversation(otherUserId));
      dispatch(fetchConversation({
        currentUserId: user.id,
        otherUserId,
      }));
      
      dispatch(markMessagesRead({
        senderId: otherUserId,
        receiverId: user.id,
      }));
    };

    const handleSend = () => {
      if (!messageText.trim() || !activeConversationId || !user) return;

      dispatch(sendMessage({
        sender_id: user.id,
        receiver_id: activeConversationId,
        content: messageText.trim(),
        contact_id: selectedContact || undefined,
        contact_name: selectedContact
          ? contacts.find((c) => c.id === selectedContact)?.name
          : undefined,
      }));

      setMessageText('');
      setSelectedContact('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };


    const contacts = useSelector((state: RootState) => state.contacts.items);
    const otherProfiles = profiles.filter((p) => p.id !== user?.id);
    const currentMessages = activeConversationId
      ? (conversations[activeConversationId] || [] )
      : [];
    
    const activeProfile = profiles.find((p) => p.id === activeConversationId);
    
    return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', gap: 0 }}>
      <Paper
        elevation={0}
        sx={{
          width: 280,
          flexShrink: 0,
          border: 1,
          borderColor: 'divider',
          borderRadius: '12px 0 0 12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>
            Messages
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {otherProfiles.length} agent{otherProfiles.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {otherProfiles.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No other agents yet.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Agents appear here once they register.
              </Typography>
            </Box>
          )}

          {otherProfiles.map((profile) => {
            const unreadCount = unreadCounts[profile.id] || 0;
            const isActive = activeConversationId === profile.id;
            const lastMessage = conversations[profile.id]?.slice(-1)[0];

            return (
              <ListItem
                key={profile.id}
                onClick={() => handleSelectUser(profile.id)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    badgeContent={unreadCount}
                    color="error"
                    invisible={unreadCount === 0}
                  >
                    <Avatar
                      src={profile.avatar_url}
                      sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}
                    >
                      {profile.name[0]?.toUpperCase() || '?'}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={unreadCount > 0 ? 700 : 400}>
                      {profile.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        maxWidth: 140,
                      }}
                    >
                      {lastMessage?.content || profile.email}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          border: 1,
          borderLeft: 0,
          borderColor: 'divider',
          borderRadius: '0 12px 12px 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {!activeConversationId && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">
              Select an agent to start chatting
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Messages are visible to both participants
            </Typography>
          </Box>
        )}

        {activeConversationId && (
          <>
            <Box
              sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                {activeProfile?.name[0]?.toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {activeProfile?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activeProfile?.email}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {!loading && currentMessages.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No messages yet. Say hello! 👋
                  </Typography>
                </Box>
              )}

              {currentMessages.map((msg) => {
                const isMe = msg.sender_id === user?.id;

                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      gap: 1,
                    }}
                  >
                    {!isMe && (
                      <Avatar
                        sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: 12 }}
                      >
                        {activeProfile?.name[0]?.toUpperCase()}
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: '70%' }}>
                      {msg.contact_name && (
                        <Chip
                          label={`Re: ${msg.contact_name}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{
                            mb: 0.5,
                            display: 'flex',
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          bgcolor: isMe ? 'primary.main' : 'action.hover',
                          color: isMe ? 'white' : 'text.primary',
                          borderRadius: isMe
                            ? '18px 18px 4px 18px'
                            : '18px 18px 18px 4px',
                          px: 2,
                          py: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {msg.content}
                        </Typography>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          textAlign: isMe ? 'right' : 'left',
                          mt: 0.25,
                          px: 0.5,
                        }}
                      >
                        {formatTime(msg.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}

              <div ref={messagesEndRef} />
            </Box>

            <Divider />

            <Box sx={{ p: 2 }}>
              {contacts.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <TextField
                    select
                    size="small"
                    label="Link to contact (optional)"
                    value={selectedContact}
                    onChange={(e) => setSelectedContact(e.target.value)}
                    sx={{ minWidth: 220 }}
                    SelectProps={{ native: false }}
                  >
                    <option value="">No contact linked</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </TextField>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder={`Message ${activeProfile?.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  size="small"
                  helperText="Press Enter to send, Shift+Enter for new line"
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  sx={{ minWidth: 'auto', px: 2, py: 1.5 }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
  }