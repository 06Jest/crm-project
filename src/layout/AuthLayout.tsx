import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LandingBackground from '../assets/landing-background.jpg';



 function AuthLayout() {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundImage: [
            'linear-gradient(to bottom, rgba(11,15,26,0.75) 0%, rgba(11,15,26,0.65) 60%, rgba(11,15,26,1) 100%)',
            `url(${LandingBackground})`,
          ].join(', '),
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundAttachment: 'fixed',
     }}>
      <Header />
      <Box component= "main" sx={{mt: 8,p:3,  display:'flex', justifyContent: 'flex-end', alignItems: 'center',
        
      }}>
        <Outlet/>
      </Box>
      <Footer/>
    </Box>
  );
};

export default AuthLayout