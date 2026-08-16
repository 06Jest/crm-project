import { Box, Collapse, Grow, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { type ElementType, type ReactNode } from 'react';

interface DockWindowProps {
  title: string;
  Icon?: ElementType;
  minimized: boolean;
  minimizedIndex?: number;
  width?: number;
  height?: number;
  onClose: () => void;
  onToggleMinimize: () => void;
  children: ReactNode;
}

// const MOBILE_VERTICAL_SAFE_OFFSET = 180;

export default function DockWindow({
  title,
  Icon,
  minimized,
  minimizedIndex = 0,
  width = 280,
  height = 380,
  onClose,
  onToggleMinimize,
  children,
}: DockWindowProps) {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);

  if (minimized) {
    return (
      <Grow timeout={250} in={minimized}>
        <Paper
          title={`Open ${title}`}
          onClick={onToggleMinimize}
          sx={{
            display: 'flex',
            position: 'fixed',
            right: 20,
            bottom: 80 + minimizedIndex * 60,
            width: 50,
            height: 50,
            borderRadius: 100,
            cursor: 'pointer',
            justifyContent: 'center',
            alignItems: 'center',
            color: "#fff",
            backgroundColor: 'primary.main',
          }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

          }}>
            {Icon && <Icon sx={{ color: '#fff' }} />}
          </Box>
        </Paper>
      </Grow>
    )
  }

  return (
    <Collapse timeout={250} in={!minimized}>
      <Grow timeout={250} in={!minimized}>
        <Box
          sx={{
            width: { xs: '100vw', md: width },
            height: { xs: '100dvh', md: height },
            position: { xs: 'fixed', md: 'static' },
            top: { xs: 0, md: 'auto' },
            left: { xs: 0, md: 'auto' },
            borderRadius: { xs: 0, md: '10px 10px 0 0' },
            zIndex: { xs: 1200, md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
            backgroundColor: themeMode === 'dark' ? '#2b2b2b' : '#ffffff',
            border: '1px solid',
            borderColor: '#63636338',
            flexShrink: 0,
          }}
        >
          <Box
            onClick={onToggleMinimize}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 1,
              cursor: 'pointer',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
              {Icon && <Icon sx={{ color: '#fff' }} />}
              <Typography variant="body2" fontWeight={700} noWrap>
                {title}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>  
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMinimize();
                }}
                sx={{ color: 'inherit' }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Tooltip title="Coming soon">
                <span>
                  <IconButton
                    size="small"
                    disabled
                    sx={{
                      color: "inherit",
                      opacity: 0.6,
                      position: "relative",
                    }}
                  >
                    <FullscreenIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {!minimized && (
            <Box
              sx={{
                 flex: 1,
                  minHeight: 0,
                  minWidth: 0,
                  p: 1.5,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
              }}
            >
              {children}
            </Box>
          )}
        </Box>
      </Grow>
    </Collapse>
  );
}