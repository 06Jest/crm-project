import { Box} from '@mui/material';


import Hero from './Hero';
import Features from './Features';
import Manual from './Manual';


export default function Landing() {
  return (
      <Box>
        <Hero />
        <Features />
        <Manual />
      </Box>
  );
}