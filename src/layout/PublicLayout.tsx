import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';



 function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component= "main" sx={{mt: 8,p:3, flexGrow: 1}}>
        <Outlet/>
      </Box>
      <Footer/>
    </Box>
  );
};

export default AppLayout