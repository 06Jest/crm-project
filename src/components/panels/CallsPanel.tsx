import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DialpadIcon from '@mui/icons-material/Dialpad';
import SearchIcon from '@mui/icons-material/Search';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';

type CallStatus = 'dialing' | 'ringing' | 'active' | 'ended';
type LogType = 'outgoing' | 'incoming' | 'missed';

interface CallLogEntry {
  id: string;
  name: string;
  type: LogType;
  timestamp: number;
  duration: number; // seconds, 0 for missed
}

const seedLog: CallLogEntry[] = [
  { id: '1', name: 'Sarah Lee', type: 'outgoing', timestamp: Date.now() - 1000 * 60 * 45, duration: 184 },
  { id: '2', name: 'Unknown', type: 'missed', timestamp: Date.now() - 1000 * 60 * 60 * 5, duration: 0 },
  { id: '3', name: 'Devon Park', type: 'incoming', timestamp: Date.now() - 1000 * 60 * 60 * 22, duration: 512 },
];

const dialpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CallsPanel() {
  const [log, setLog] = useState<CallLogEntry[]>(seedLog);
  const [query, setQuery] = useState('');
  const [dialInput, setDialInput] = useState('');

  const [status, setStatus] = useState<CallStatus | null>(null); // null = no active call screen
  const [activeName, setActiveName] = useState('');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    };
  }, []);

  const visibleLog = useMemo(() => {
    return log
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [log, query]);

  const startCall = (name: string) => {
    if (!name.trim()) return;
    setActiveName(name.trim());
    setStatus('dialing');
    setMuted(false);
    setSpeaker(false);
    setElapsed(0);
    setDialInput('');

    // simulate dialing -> ringing -> answered, after random-ish delays
    ringTimeoutRef.current = setTimeout(() => {
      setStatus('ringing');
      ringTimeoutRef.current = setTimeout(() => {
        setStatus('active');
        timerRef.current = setInterval(() => {
          setElapsed((prev) => prev + 1);
        }, 1000);
      }, 1800);
    }, 1000);
  };

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);

    if (activeName) {
      setLog((prev) => [
        {
          id: crypto.randomUUID(),
          name: activeName,
          type: 'outgoing',
          timestamp: Date.now(),
          duration: elapsed,
        },
        ...prev,
      ]);
    }

    setStatus(null);
    setActiveName('');
    setElapsed(0);
  };

  const redial = (entry: CallLogEntry) => startCall(entry.name);

  const logIcon = (type: LogType) => {
    if (type === 'missed') return <CallMissedIcon sx={{ fontSize: 16, color: '#e0453c' }} />;
    if (type === 'incoming') return <CallReceivedIcon sx={{ fontSize: 16, color: '#4caf50' }} />;
    return <CallMadeIcon sx={{ fontSize: 16, color: '#6a6a6a' }} />;
  };

  // ---------- ACTIVE CALL SCREEN ----------
  if (status) {
    const statusLabel =
      status === 'dialing' ? 'Dialing…' : status === 'ringing' ? 'Ringing…' : formatDuration(elapsed);

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: '1.5rem', mb: 1.5 }}>
            {activeName.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700}>
            {activeName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.6,
              mt: 0.5,
              ...(status === 'active' && { fontVariantNumeric: 'tabular-nums' }),
            }}
          >
            {statusLabel}
          </Typography>
        </Box>

        {status === 'active' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={muted ? 'Unmute' : 'Mute'}>
              <IconButton
                onClick={() => setMuted((m) => !m)}
                sx={{
                  bgcolor: muted ? 'primary.main' : 'action.hover',
                  color: muted ? 'primary.contrastText' : 'inherit',
                }}
              >
                {muted ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title={speaker ? 'Speaker off' : 'Speaker on'}>
              <IconButton
                onClick={() => setSpeaker((s) => !s)}
                sx={{
                  bgcolor: speaker ? 'primary.main' : 'action.hover',
                  color: speaker ? 'primary.contrastText' : 'inherit',
                }}
              >
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <IconButton
          onClick={endCall}
          sx={{
            bgcolor: '#e0453c',
            color: '#fff',
            width: 52,
            height: 52,
            '&:hover': { bgcolor: '#c53a32' },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Box>
    );
  }

  // ---------- LIST / DIALPAD SCREEN ----------
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TextField
        size="small"
        placeholder="Search or enter name/number..."
        value={query || dialInput}
        onChange={(e) => {
          setQuery(e.target.value);
          setDialInput(e.target.value);
        }}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (dialInput || query) && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  setQuery('');
                  setDialInput('');
                }}
              >
                <BackspaceOutlinedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* recent log */}
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
        {visibleLog.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', mt: 4 }}>
            No call history
          </Typography>
        ) : (
          visibleLog.map((entry) => (
            <Box
              key={entry.id}
              onClick={() => redial(entry)}
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
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                {entry.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    color: entry.type === 'missed' ? '#e0453c' : 'inherit',
                  }}
                >
                  {entry.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {logIcon(entry.type)}
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>
                    {new Date(entry.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {entry.duration > 0 && ` · ${formatDuration(entry.duration)}`}
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Call">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    redial(entry);
                  }}
                >
                  <CallIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        )}
      </Box>

      {/* mini dialpad, always visible at bottom */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0.5,
          mb: 1,
        }}
      >
        {dialpadKeys.map((key) => (
          <Box
            key={key}
            onClick={() => setDialInput((prev) => prev + key)}
            sx={{
              textAlign: 'center',
              py: 0.75,
              borderRadius: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            {key}
          </Box>
        ))}
      </Box>

      <IconButton
        onClick={() => startCall(dialInput || 'Unknown')}
        disabled={!dialInput.trim()}
        sx={{
          bgcolor: dialInput.trim() ? '#4caf50' : 'action.disabledBackground',
          color: '#fff',
          alignSelf: 'center',
          width: 44,
          height: 44,
          '&:hover': { bgcolor: '#43a047' },
        }}
      >
        <DialpadIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}