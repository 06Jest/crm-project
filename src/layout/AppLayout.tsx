import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';



 function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Topbar />
      <Box component= "main" sx={{p:3, flexGrow: 1}}>
        <Outlet/>
      </Box>
      <Footer/>
    </Box>
  );
};

export default AppLayout