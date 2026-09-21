import { Box } from '@mui/material';
import DockWindow from './DockWindow';
import { type ReactNode } from 'react';
import useDock from '../hooks/useDock';
// import { MOBILE_BOTTOM_NAV_HEIGHT } from './Sidebar';

interface DockContainerProps {
  renderContent: (id: string) => ReactNode;
}

export default function DockContainer({ renderContent }: DockContainerProps) {
  const {
  windows,
  closeWindow,
  toggleMinimize,
  updateWindow,
  focusWindow,
} = useDock();

  if (windows.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: { xs: 2400, md: 2300 },
      }}
    >
      {windows.map((win, index) => (
       <DockWindow
        key={win.id}
        id={win.id}
        minimizedIndex={index}
        title={win.title}
        Icon={win.Icon}
        minimized={!!win.minimized}
        width={win.width}
        height={win.height}
        x={win.x}
        y={win.y}
        zIndex={win.zIndex}
        onClose={() => closeWindow(win.id)}
        onToggleMinimize={() => toggleMinimize(win.id)}
        onUpdate={(updates) => updateWindow(win.id, updates)}
        onFocus={() => focusWindow(win.id)}
      >
          {renderContent(win.id)}
        </DockWindow>
      ))}
    </Box>
  );
}