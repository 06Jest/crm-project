import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';



 function AuthLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component= "main" sx={{p:3,  display:'flex', justifyContent: 'center'}}>
        <Outlet/>
      </Box>
      <Footer/>
    </Box>
  );
};

export default AuthLayout