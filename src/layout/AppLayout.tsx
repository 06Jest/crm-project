import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

type Props = {
  children: ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Topbar />
      <Box component= "main" sx={{p:3, flexGrow: 1}}>
        {children}
      </Box>
      <Footer/>
    </Box>
  )
};
export default  AppLayout