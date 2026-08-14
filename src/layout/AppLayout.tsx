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
      <Box component="main" sx={{ mt: 12, pt: 2, width: '100%', display: 'flex' }}>
        <Box
          sx={{
            width: { xs: 0, md: collapsed ? 70 : 200 },
            transition: "width 0.3s ease",
          }}
        >
          <Sidebar />
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 900,
            pb: { xs: `${MOBILE_BOTTOM_NAV_HEIGHT + 16}px`, md: 0 },
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