import { Card, CardContent, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

export default function StatCard ({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        height: '100%',
        width: 238
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography sx={{ my: 2 }} variant="h3" fontWeight={800}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              bgcolor: color,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
              ml:5
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}