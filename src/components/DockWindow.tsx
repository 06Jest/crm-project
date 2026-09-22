import {
  Box,
  Grow,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { type ElementType, type ReactNode } from 'react';
import { Rnd } from 'react-rnd';

interface DockWindowProps {
  id: string;
  title: string;
  Icon?: ElementType;
  minimized: boolean;
  minimizedIndex?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  zIndex?: number;
  onClose: () => void;
  onToggleMinimize: () => void;
  onFocus: () => void;
  onUpdate: (
    updates: Partial<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>
  ) => void;
  children: ReactNode;
}

// const MOBILE_VERTICAL_SAFE_OFFSET = 180;

export default function DockWindow({
  id,
  title,
  Icon,
  minimized,
  minimizedIndex = 0,
  width = 280,
  height = 380,
  x,
  y,
  zIndex = 1200,
  onClose,
  onToggleMinimize,
  onFocus,
  onUpdate,
  children,
}: DockWindowProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
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
            pointerEvents: "auto",
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
    <Rnd
      position={{
        x: isSmallScreen
          ? (window.innerWidth - window.innerWidth * 0.8) / 2
          : x ?? window.innerWidth - width - 90 - minimizedIndex * (width + 12),
        y: isSmallScreen
          ? (window.innerHeight - window.innerHeight * 0.8) / 2
          : y ?? window.innerHeight - height,
      }}
      size={{
        width: isSmallScreen ? "80vw" : width,
        height: isSmallScreen ? "80vh" : height,
      }}
      disableDragging={isSmallScreen}
      enableResizing={!isSmallScreen}
      onMouseDown={onFocus}
      bounds="window"
      dragHandleClassName={!isSmallScreen ? "dock-window-header" : undefined}
      onDragStop={(_e, data) => {
        onUpdate({
          x: data.x,
          y: data.y,
        });
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        onUpdate({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      style={{
        zIndex,
        pointerEvents: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "10px 10px 0 0",
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          className="dock-window-header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1,
            cursor: "grab",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
            "&:active": {
              cursor: "grabbing",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflow: "hidden",
            }}
          >
            {Icon && <Icon sx={{ color: "#fff" }} />}

            <Typography variant="body2" fontWeight={700} noWrap>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMinimize();
              }}
              sx={{ color: "inherit" }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Tooltip title="Open full page">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();

                  if (isSmallScreen) {
                    window.location.href = `/app/communication/${id}`;
                    return;
                  }

                  window.open(`/app/communication/${id}`, "_blank");
                }}
                sx={{ color: "inherit" }}
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              sx={{ color: "inherit" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            p: 1.5,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </Box>
      </Box>
    </Rnd>
  );
}