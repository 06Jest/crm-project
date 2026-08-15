import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import Sidebar, { MOBILE_BOTTOM_NAV_HEIGHT } from '../components/Sidebar';
import { useSidebar } from '../hooks/useSidebar';



function AppLayout() {
  const { collapsed } = useSidebar();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Topbar />
      <Box
          component="main"
          sx={{
            mt: 12,
            pt: 1,
            width: '99vw',
            display: "flex",
            minWidth: 0,
            px: 1.3
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: {
                xs: 0,
                md: collapsed ? 60 : 180,
              },
              transition: "width 0.3s ease",
              overflow: "hidden",
            }}
          >
            <Sidebar />
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              pb: {
                xs: `${MOBILE_BOTTOM_NAV_HEIGHT + 16}px`,
                md: 0,
              },
              transition: "width 0.3s ease",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      <Footer />
    </Box>

  );
};

export default AppLayout