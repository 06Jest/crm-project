import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import FloatingAIChat from '../components/FloatingAIChat';
import { useSidebar } from '../hooks/useSidebar';



 function AppLayout() {
  const { collapsed } = useSidebar();
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Topbar />   
        <Box component= "main" sx={{mt: 12,pt: 2, width: '100%', display: 'flex'}}>
          <Box sx={{flex: 1}}>
            <Outlet/>
          </Box>
          <Box sx={{
            width: collapsed ? 70 : 350,
            transition: "width 0.3s ease",
          }}>
            <Sidebar />
          </Box>
        </Box>
        <Footer/>
        <FloatingAIChat />
      </Box>
    
  );
};

export default AppLayout