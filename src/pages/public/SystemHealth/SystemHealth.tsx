import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

import {
  fetchSystemHealthAPI,
  type SystemHealth,
} from '../../../services/healthService';

type ServiceStatus = 'ok' | 'down';

interface StatusItemProps {
  label: string;
  description: string;
  status: ServiceStatus;
  icon: React.ReactNode;
}

function StatusItem({
  label,
  description,
  status,
  icon,
}: StatusItemProps) {
  const isOk = status === 'ok';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 0,
        }}
      >
        <Box
          sx={(theme) => ({
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            bgcolor:
              theme.palette.mode === 'dark'
                ? isOk
                  ? 'rgba(46, 125, 50, 0.15)'
                  : 'rgba(211, 47, 47, 0.15)'
                : isOk
                  ? '#edf7ed'
                  : '#fdeded',
            color: isOk ? 'success.main' : 'error.main',
          })}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700}>
            {label}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </Box>
      </Box>

      <Chip
        size="small"
        icon={
          isOk ? (
            <CheckCircleRoundedIcon />
          ) : (
            <ErrorRoundedIcon />
          )
        }
        label={isOk ? 'Operational' : 'Down'}
        color={isOk ? 'success' : 'error'}
        variant="outlined"
        sx={{
          fontWeight: 700,
          flexShrink: 0,
        }}
      />
    </Box>
  );
}

export default function SystemStatus() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    setError(null);

    try {
      const result = await fetchSystemHealthAPI();
      setHealth(result);
    } catch {
      setHealth(null);
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const isOperational = health?.status === 'operational';

  return (
    <Box
      sx={{
        width: '84vw',
        maxWidth: 900,
        mx: 'auto',
        mt: 10,
        pt: 4,
        pb: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            letterSpacing={-0.3}
          >
            System Status
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Monitor the availability of your CRM services.
          </Typography>
        </Box>

        <Tooltip title="Check system status">
          <Box
            onClick={!checking ? checkHealth : undefined}
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: checking ? 'default' : 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
              flexShrink: 0,
              transition: 'all 0.15s ease',

              '&:hover': checking
                ? {}
                : {
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
            }}
          >
            {checking ? (
              <CircularProgress size={18} />
            ) : (
              <RefreshRoundedIcon fontSize="small" />
            )}
          </Box>
        </Tooltip>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <CircularProgress size={22} />

            <Typography fontWeight={600}>
              Checking system status...
            </Typography>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              alignItems: 'center',
            }}
          >
            {error}
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={(theme) => ({
                width: 46,
                height: 46,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,

                bgcolor: isOperational
                  ? theme.palette.mode === 'dark'
                    ? 'rgba(46, 125, 50, 0.15)'
                    : '#edf7ed'
                  : theme.palette.mode === 'dark'
                    ? 'rgba(237, 108, 2, 0.15)'
                    : '#fff4e5',

                color: isOperational
                  ? 'success.main'
                  : 'warning.main',
              })}
            >
              {isOperational ? (
                <CheckCircleRoundedIcon />
              ) : (
                <ErrorRoundedIcon />
              )}
            </Box>

            <Box>
              <Typography
                fontWeight={800}
                fontSize={17}
              >
                {isOperational
                  ? 'All systems operational'
                  : 'Some services are experiencing issues'}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {health?.message ||
                  'System health information is currently available.'}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Services */}
      {!loading && health && (
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography fontWeight={800}>
              Services
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Current availability of CRM services.
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ px: 2.5 }}>
            <StatusItem
              label="API Server"
              description="Application server"
              status={health.server}
              icon={<CloudRoundedIcon fontSize="small" />}
            />

            <Divider />

            <StatusItem
              label="Database"
              description="Supabase PostgreSQL database"
              status={health.database}
              icon={<StorageRoundedIcon fontSize="small" />}
            />

            <Divider />

            <StatusItem
              label="Authentication"
              description="User authentication service"
              status={health.authentication}
              icon={<LockRoundedIcon fontSize="small" />}
            />
          </Box>
        </Paper>
      )}

      {health?.timestamp && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 1.5,
          }}
        >
          Last checked:{' '}
          {new Date(health.timestamp).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}