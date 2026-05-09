import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';

interface AgentBadgeProps {
  agentName?: string;
  employeeId?: string;
  size?: 'small' | 'medium';
  label?: string; 
}

export default function AgentBadge({
  agentName,
  employeeId,
  size = 'small',
  label,
}: AgentBadgeProps) {
  if (!agentName && !employeeId) return null;

  const displayText = employeeId
    ? `${employeeId}${agentName ? ` — ${agentName}` : ''}`
    : agentName || '';

  if (size === 'small') {
    return (
      <Tooltip title={label ? `${label}: ${displayText}` : displayText}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BadgeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {employeeId || agentName}
          </Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar
        sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: 11 }}
      >
        {agentName?.[0]?.toUpperCase() || '?'}
      </Avatar>
      <Box>
        {label && (
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
        )}
        <Typography variant="body2" fontWeight={600}>
          {displayText}
        </Typography>
      </Box>
    </Box>
  );
}