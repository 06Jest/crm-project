import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import FloatingAIChat from '../components/FloatingAIChat';



 function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Topbar />
      <Box component= "main" sx={{mt: 12, p:3, flexGrow: 1}}>
        <Outlet/>
      </Box>
      <Footer/>
      <FloatingAIChat />
    </Box>
  );
};

export default AppLayout