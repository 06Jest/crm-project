
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  X as  XIcon ,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ArrowOutward as ArrowIcon,
} from '@mui/icons-material';
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';


interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
  hoverColor: string;
}

const CURRENT_YEAR = new Date().getFullYear();

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Status', href: 'https://status.unithread.io', external: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '', external: true },
      { label: 'API Reference', href: '', external: true },
      { label: 'Community', href: '', external: true },
      { label: 'Help Center', href: '' },
      { label: 'Report Bug', href: '', external: true },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'Portfolio', href: '', external: true },
      { label: 'GitHub Profile', href: 'https://github.com/06Jest', external: true },
      { label: 'Project Repo', href: 'https://github.com/06Jest/crm-project', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/jestonyfrontenddev', external: true },
      { label: 'Twitter', href: 'https://twitter.com', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
];


const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    icon: <FacebookIcon />,
    url: 'https://facebook.com',
    color: '#1877F2',
    hoverColor: '#165FD9',
  },
  {
    name: 'X',
    icon: <XIcon />,
    url: 'https://x.com',
    color: '#000000',
    hoverColor: '#1a1a1a',
  },
  {
    name: 'Instagram',
    icon: <InstagramIcon />,
    url: 'https://instagram.com',
    color: '#E4405F',
    hoverColor: '#d1306f',
  },
  {
    name: 'LinkedIn',
    icon: <LinkedInIcon />,
    url: 'https://www.linkedin.com/in/jestonyfrontenddev/',
    color: '#0A66C2',
    hoverColor: '#004182',
  },
  {
    name: 'GitHub',
    icon: <GitHubIcon />,
    url: 'https://github.com/06Jest',
    color: '#181717',
    hoverColor: '#0d1117',
  },
];


const contactInfo = {
  email: 'silvanojestony27@gmail.com',
  phone: '+63 968 768 0777',
  address: 'Quezon City, National Capital Region, Philippines',
};


export default function Footer() {
  const navigate = useNavigate();
  const theme = useTheme();
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);



  const handleLinkClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f8f9fa',
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{xs: 12, sm: 6, md: 2.5}}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <img src={logo} style={{userSelect: 'none', width: 40, marginRight: 2 }} alt="uniThread Logo" />
                UniThread
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                A powerful CRM platform designed to help teams manage relationships, close more deals, and grow faster.
              </Typography>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {socialLinks.map((social) => (
                  <Tooltip key={social.name} title={social.name} arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleLinkClick(social.url, true)}
                      sx={{
                        color: (social.name === 'X' || social.name === 'GitHub') && themeMode === 'dark' ? 'white' : social.color,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: social.hoverColor,
                          transform: 'translateY(-4px) scale(1.1)',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Grid>

          {footerSections.map((section) => (
            <Grid size={{xs: 12, sm: 6, md: 2.5}} key={section.title}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    component="button"
                    variant="body2"
                    onClick={() => handleLinkClick(link.href, link.external)}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      width: 'fit-content',
                      fontSize: '0.9rem',
                      '&:hover': {
                        color: 'primary.main',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {link.label}
                    {link.external && (
                      <ArrowIcon sx={{ fontSize: 12, opacity: 0.6 }} />
                    )}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          <Grid size={{xs: 12, sm: 6, md: 2.5}}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Get In Touch
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                onClick={() => window.location.href = `mailto:${contactInfo.email}`}
              >
                <EmailIcon sx={{ fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" display="block" fontWeight={600}>
                    Email
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contactInfo.email}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                onClick={() => window.location.href = `tel:${contactInfo.phone}`}
              >
                <PhoneIcon sx={{ fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" display="block" fontWeight={600}>
                    Phone
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contactInfo.phone}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <LocationIcon sx={{ fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" display="block" fontWeight={600}>
                    Location
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {contactInfo.address}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © {CURRENT_YEAR} UniThread. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
            <Link
              component="button"
              variant="caption"
              color="text.secondary"
              onClick={() => handleLinkClick('/privacy')}
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Privacy
            </Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link
              component="button"
              variant="caption"
              color="text.secondary"
              onClick={() => handleLinkClick('/terms')}
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Terms
            </Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link
              component="button"
              variant="caption"
              color="text.secondary"
              onClick={() => handleLinkClick('/cookies')}
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Cookies
            </Link>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Made with ❤️ by{' '}
            <Link
              component="button"
              onClick={() => window.open('https://jestony.dev', '_blank')}
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Jestony
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
