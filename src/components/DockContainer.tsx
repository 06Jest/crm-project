import { Box } from '@mui/material';
import DockWindow from './DockWindow';
import { type ReactNode } from 'react';
import useDock from '../hooks/useDock';
// import { MOBILE_BOTTOM_NAV_HEIGHT } from './Sidebar';

interface DockContainerProps {
  renderContent: (id: string) => ReactNode;
}

export default function DockContainer({ renderContent }: DockContainerProps) {
  const { windows, closeWindow, toggleMinimize } = useDock();

  if (windows.length === 0) return null;

  return (
    <Box
      sx={{
      position: 'fixed',
      bottom: { xs: 'auto', md: 0 },
      right: { xs: 'auto', md: 90 },
      left: { xs: 0, md: 'auto' },
      top: { xs: 0, md: 'auto' },
      width: { xs: '100%', md: 'auto' },
      display: 'flex',
      flexDirection: 'row-reverse',
      gap: 1.5,
      alignItems: 'flex-end',
      zIndex: { xs: 2400, md: 2300 },
    }}
    >
      {windows.map((win, index) => (
        <DockWindow
          key={win.id}
          minimizedIndex={index}
          title={win.title}
          Icon={win.Icon}
          minimized={!!win.minimized}
          width={win.width}
          height={win.height}
          onClose={() => closeWindow(win.id)}
          onToggleMinimize={() => toggleMinimize(win.id)}
        >
          {renderContent(win.id)}
        </DockWindow>
      ))}
    </Box>
  );
}