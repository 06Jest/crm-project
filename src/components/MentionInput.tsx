import { useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { MentionItem, MentionSuggestion } from '../types/message';

import {
  Box, TextField, Typography, Paper,
  Chip, ClickAwayListener,
  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// ── Icon per type ─────────────────────────────────────────
const TYPE_CONFIG = {
  contact: {
    icon: <PeopleIcon sx={{ fontSize: 14 }} />,
    color: '#1976d2',
    label: 'Contact',
    getRoute: (id: string) => `/app/contacts/${id}`,
  },
  customer: {
    icon: <BusinessIcon sx={{ fontSize: 14 }} />,
    color: '#2e7d32',
    label: 'Company',
    getRoute: (id: string) => `/app/company/${id}`,
  },
  lead: {
    icon: <TrendingUpIcon sx={{ fontSize: 14 }} />,
    color: '#ed6c02',
    label: 'Lead',
    getRoute: () => `/app/leads`,
  },
  deal: {
    icon: <AttachMoneyIcon sx={{ fontSize: 14 }} />,
    color: '#9c27b0',
    label: 'Deal',
    getRoute: () => `/app/deals`,
  },
};

interface MentionInputProps {
  onSend: (content: string, mentions: MentionItem[]) => void;
  disabled?: boolean;
  placeholder?: string;
  recipientName?: string;
}

export default function MentionInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  recipientName,
}: MentionInputProps) {
  // Redux data for building suggestions
  const contacts = useSelector((s: RootState) => s.contacts.items);
  const customers = useSelector((s: RootState) => s.customers.items);
  const leads = useSelector((s: RootState) => s.leads.items);
  const deals = useSelector((s: RootState) => s.deals.items);

  // Input state
  const [inputValue, setInputValue] = useState('');
  const [mentions, setMentions] = useState<MentionItem[]>([]);

  // Mention dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState(-1);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [highlightedIdx, setHighlightedIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Build suggestions from Redux state ───────────────
  const buildSuggestions = useCallback((query: string): MentionSuggestion[] => {
    const q = query.toLowerCase();
    const results: MentionSuggestion[] = [];

    // Contacts
    contacts
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => results.push({
        type: 'contact',
        id: c.id,
        name: c.name,
        subtitle: c.email,
      }));

    // Customers
    customers
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach(c => results.push({
        type: 'customer',
        id: c.id,
        name: c.name,
        subtitle: c.industry || 'Company',
      }));

    // Leads
    leads
      .filter(l => l.name.toLowerCase().includes(q) ||
                   l.title.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach(l => results.push({
        type: 'lead',
        id: l.id,
        name: l.title || l.name,
        subtitle: `Lead · ${l.status}`,
      }));

    // Deals
    deals
      .filter(d => d.title.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach(d => results.push({
        type: 'deal',
        id: d.id,
        name: d.title,
        subtitle: `Deal · ${d.stage}`,
      }));

    return results.slice(0, 8);
  }, [contacts, customers, leads, deals]);

  // ── Handle input change ───────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart || 0;
    setInputValue(val);

    // Detect @ trigger
    const textBeforeCursor = val.slice(0, cursor);
    const atIdx = textBeforeCursor.lastIndexOf('@');

    if (atIdx !== -1) {
      const textAfterAt = textBeforeCursor.slice(atIdx + 1);
      // Only show dropdown if no space after @ (still typing the query)
      if (!textAfterAt.includes(' ') || textAfterAt.length === 0) {
        setMentionStart(atIdx);
        setMentionQuery(textAfterAt);
        const newSuggestions = buildSuggestions(textAfterAt);
        setSuggestions(newSuggestions);
        setShowDropdown(newSuggestions.length > 0);
        setHighlightedIdx(0);
        return;
      }
    }

    setShowDropdown(false);
    setMentionStart(-1);
  };

  // ── Select a mention from dropdown ───────────────────
  const selectMention = useCallback((suggestion: MentionSuggestion) => {
    // Replace @query with @Name in the input text
    const before = inputValue.slice(0, mentionStart);
    const after = inputValue.slice(
      mentionStart + 1 + mentionQuery.length
    );
    const newValue = `${before}@${suggestion.name}${after} `;
    setInputValue(newValue);

    // Add to mentions array (for structured storage)
    const mentionItem: MentionItem = {
      type: suggestion.type,
      id: suggestion.id,
      name: suggestion.name,
    };
    setMentions(prev => {
      // Avoid duplicate mentions
      const exists = prev.some(m => m.id === suggestion.id);
      return exists ? prev : [...prev, mentionItem];
    });

    setShowDropdown(false);
    setMentionStart(-1);
    setMentionQuery('');

    // Refocus the input
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [inputValue, mentionStart, mentionQuery]);

  // ── Keyboard navigation in dropdown ──────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIdx(i => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIdx(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[highlightedIdx]) {
          selectMention(suggestions[highlightedIdx]);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        return;
      }
    }

    // Send on Enter (no shift)
    if (e.key === 'Enter' && !e.shiftKey && !showDropdown) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    onSend(text, mentions);
    setInputValue('');
    setMentions([]);
    setShowDropdown(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* ── Mention dropdown ──────────────────────── */}
      {showDropdown && (
        <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              right: 0,
              mb: 1,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              overflow: 'hidden',
              zIndex: 100,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Mention a contact, company, lead, or deal
              </Typography>
            </Box>

            {suggestions.length === 0 ? (
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  No matches found
                </Typography>
              </Box>
            ) : (
              suggestions.map((s, i) => {
                const config = TYPE_CONFIG[s.type];
                return (
                  <Box
                    key={`${s.type}-${s.id}`}
                    onClick={() => selectMention(s)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.25,
                      cursor: 'pointer',
                      bgcolor: i === highlightedIdx ? 'action.selected' : 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Type icon */}
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1,
                        bgcolor: `${config.color}18`,
                        color: config.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </Box>

                    {/* Name + subtitle */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {s.name}
                      </Typography>
                      {s.subtitle && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {s.subtitle}
                        </Typography>
                      )}
                    </Box>

                    {/* Type label */}
                    <Chip
                      label={config.label}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        bgcolor: `${config.color}18`,
                        color: config.color,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Paper>
        </ClickAwayListener>
      )}

      {/* ── Text input ──────────────────────────── */}
      <TextField
        inputRef={inputRef}
        fullWidth
        multiline
        maxRows={4}
        placeholder={
          recipientName
            ? `Message ${recipientName}... (type @ to mention)`
            : `${placeholder} (type @ to mention)`
        }
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        size="small"
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': { fontSize: 13 },
        }}
        helperText={
          mentions.length > 0
            ? `${mentions.length} mention${mentions.length > 1 ? 's' : ''} — Enter to send · Shift+Enter for new line`
            : 'Enter to send · Shift+Enter for new line · @ to mention'
        }
      />
      <Button onClick={handleSend}>
        <SendIcon/>
      </Button>
    </Box>
  );
}