import { Box } from '@mui/material';


import Hero from './Hero';
import Features from './Features';
import Manual from './Manual';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import FinalCTA from './FinalCTA';


export default function Landing() {
  return (
      <Box>
        <Hero />
        <Features />
        <Manual />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </Box>
  );
}