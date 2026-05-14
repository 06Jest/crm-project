import { useNavigate } from 'react-router-dom';
import { Chip, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { MentionItem } from '../types/message';

const TYPE_CONFIG = {
  contact: {
    icon: <PeopleIcon sx={{ fontSize: 12 }} />,
    color: '#1976d2',
    label: 'Contact',
    getRoute: (id: string) => `/app/contacts/${id}`,
  },
  customer: {
    icon: <BusinessIcon sx={{ fontSize: 12 }} />,
    color: '#2e7d32',
    label: 'Company',
    getRoute: (id: string) => `/app/company/${id}`,
  },
  lead: {
    icon: <TrendingUpIcon sx={{ fontSize: 12 }} />,
    color: '#ed6c02',
    label: 'Lead',
    getRoute: (_id: string) => `/app/leads`,
  },
  deal: {
    icon: <AttachMoneyIcon sx={{ fontSize: 12 }} />,
    color: '#9c27b0',
    label: 'Deal',
    getRoute: (_id: string) => `/app/deals`,
  },
};

interface MentionChipProps {
  mention: MentionItem;
  isMyMessage?: boolean;
}

export default function MentionChip({ mention, isMyMessage = false }: MentionChipProps) {
  const navigate = useNavigate();
  const config = TYPE_CONFIG[mention.type];

  return (
    <Tooltip title={`View ${config.label}: ${mention.name}`} placement="top">
      <Chip
        icon={config.icon}
        label={mention.name}
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          navigate(config.getRoute(mention.id));
        }}
        sx={{
          height: 20,
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          mx: 0.25,
          // Style differently based on whose bubble it's in
          bgcolor: isMyMessage
            ? 'rgba(255,255,255,0.25)'
            : `${config.color}18`,
          color: isMyMessage ? 'white' : config.color,
          borderColor: isMyMessage
            ? 'rgba(255,255,255,0.4)'
            : `${config.color}44`,
          border: 1,
          '&:hover': {
            bgcolor: isMyMessage
              ? 'rgba(255,255,255,0.35)'
              : `${config.color}28`,
            transform: 'scale(1.05)',
          },
          transition: 'all 0.15s ease',
          '& .MuiChip-icon': {
            color: isMyMessage ? 'white' : config.color,
          },
        }}
      />
    </Tooltip>
  );
}