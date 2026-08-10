import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


interface NavSection {
  id: string;
  label: string;
}

interface CookieTypeCardProps {
  title: string;
  description: string;
  status: string;
  statusColor: 'primary' | 'info' | 'default';
}


const SECTIONS: NavSection[] = [
  { id: 'what-are-cookies', label: 'What Are Cookies?' },
  { id: 'how-we-use', label: 'How uniThread Uses Cookies' },
  { id: 'types', label: 'Types of Cookies' },
  { id: 'auth-security', label: 'Authentication & Security' },
  { id: 'third-party', label: 'Third-Party Technologies' },
  { id: 'managing', label: 'Managing Cookies' },
  { id: 'consent', label: 'Cookie Consent' },
  { id: 'data-privacy', label: 'Data & Privacy' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact & Questions' },
];

const USAGE_POINTS: { heading: string; text: string }[] = [
  {
    heading: 'Authentication and Sessions',
    text: "Cookies or similar browser storage mechanisms may be used to maintain your authenticated session and help keep you signed in while you use uniThread.",
  },
  {
    heading: 'Security',
    text: 'Necessary technologies may help protect authenticated sessions, support the detection of unauthorized access, and contribute to the overall security of the application.',
  },
  {
    heading: 'Application Functionality',
    text: 'Necessary browser-side storage may be used to retain information required for core parts of the application to operate correctly.',
  },
  {
    heading: 'Preferences',
    text: 'Where applicable, and only where actually implemented, limited preference information may be stored using cookies to remember certain settings between visits.',
  },
];

const COOKIE_TYPES: CookieTypeCardProps[] = [
  {
    title: 'Strictly Necessary',
    description:
      'Used for authentication, session management, security, and essential application functionality.',
    status: 'Required',
    statusColor: 'primary',
  },
  {
    title: 'Preferences',
    description:
      'Used only where necessary to remember user preferences or settings within the application.',
    status: 'Optional only where implemented',
    statusColor: 'info',
  },
  {
    title: 'Analytics',
    description:
      'Applicable only if analytics technologies are introduced in the future to help understand product usage.',
    status: 'Not currently used',
    statusColor: 'default',
  },
  {
    title: 'Marketing',
    description:
      'uniThread does not currently use cookies or similar technologies for advertising or marketing purposes.',
    status: 'Not currently used',
    statusColor: 'default',
  },
];

const AUTH_CONSEQUENCES: string[] = [
  'Signing in',
  'Remaining authenticated during your session',
  'Accessing protected CRM functionality',
  'Maintaining a secure session',
];


const PolicySection: React.FC<{
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ id, title, icon, children }) => (
  <Paper
    id={id}
    variant="outlined"
    sx={{
      p: { xs: 2.5, sm: 4 },
      scrollMarginTop: '16px',
      borderColor: 'divider',
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', color: 'primary.main' }}>{icon}</Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Stack>
    <Divider sx={{ mb: 2.5 }} />
    <Stack spacing={2}>{children}</Stack>
  </Paper>
);

const CookieTypeCard: React.FC<CookieTypeCardProps> = ({
  title,
  description,
  status,
  statusColor,
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.25,
      borderColor: 'divider',
    }}
  >
    <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
      {description}
    </Typography>
    <Chip
      label={status}
      size="small"
      color={statusColor}
      variant="outlined"
      sx={{ alignSelf: 'flex-start' }}
    />
  </Paper>
);

const BulletItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ListItem disableGutters sx={{ py: 0.5 }}>
    <ListItemIcon sx={{ minWidth: 26 }}>
      <FiberManualRecordIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
    </ListItemIcon>
    <ListItemText
      primary={children}
      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
    />
  </ListItem>
);


const CookiePolicyPage: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      component="main"
      role="main"
      aria-labelledby="cookie-policy-heading"
      sx={{ bgcolor: 'background.default', minHeight: '100vh', mt: 10 }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>

        <Stack spacing={2} sx={{ mb: { xs: 4, sm: 6 }, maxWidth: 760 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
            <Box sx={{ display: 'flex', color: 'primary.main' }}>
              <CookieOutlinedIcon fontSize="large" />
            </Box>
            <Typography
              id="cookie-policy-heading"
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700 }}
            >
              Cookie Policy
            </Typography>
            <Chip label="Beta" size="small" color="primary" variant="outlined" />
          </Stack>

          <Typography variant="body1" color="text.secondary">
            How uniThread CRM uses cookies and similar technologies to provide
            a secure and reliable experience.
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Last updated: August 10, 2026
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
            uniThread CRM uses cookies and similar browser-side technologies
            primarily to provide essential functionality, maintain
            authenticated sessions, and help protect the application and its
            users. This policy explains what these technologies are, how they
            are used, and the choices available to you.
          </Typography>
        </Stack>

        <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 4, alignItems: 'flex-start' }}>

          <Box
            component="nav"
            aria-label="Cookie policy sections"
            sx={{
              display: { xs: 'none', md: 'block' },
              width: 260,
              flexShrink: 0,
              position: 'sticky',
              top: 24,
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ pl: 1.5 }}>
              On this page
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {SECTIONS.map((section) => (
                <Button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  size="small"
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 400,
                    color: 'text.secondary',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                    },
                  }}
                >
                  {section.label}
                </Button>
              ))}
            </Stack>
          </Box>


          <Box
            component="nav"
            aria-label="Cookie policy sections"
            sx={{ display: { xs: 'block', md: 'none' }, mb: 3 }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ pl: 0.5 }}>
              On this page
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                py: 1,
                mt: 0.5,
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {SECTIONS.map((section) => (
                <Chip
                  key={section.id}
                  label={section.label}
                  size="small"
                  onClick={() => handleScrollTo(section.id)}
                  sx={{ flexShrink: 0 }}
                />
              ))}
            </Box>
          </Box>

          <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>

            <PolicySection
              id="what-are-cookies"
              title="What Are Cookies?"
              icon={<InfoOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                Cookies are small pieces of information that a website or
                application can store in your browser or on your device. When
                you return to the application, these pieces of information
                can be read back, allowing the application to recognize your
                browser and maintain continuity between requests.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In practice, this is part of what allows an application to
                remember that you are signed in as you move between pages,
                rather than requiring you to authenticate again on every
                request.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Similar technologies such as browser storage mechanisms
                built into modern browsers may be used for comparable
                purposes. Where this policy refers to &quot;cookies,&quot; it
                is intended to cover these similar technologies as well,
                unless stated otherwise.
              </Typography>
            </PolicySection>

       
            <PolicySection
              id="how-we-use"
              title="How uniThread Uses Cookies"
              icon={<SecurityOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                uniThread is designed to rely on cookies and similar
                technologies only where they are necessary for the
                application to function correctly and securely. The main
                purposes are described below.
              </Typography>

              {USAGE_POINTS.map((point) => (
                <Box key={point.heading}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {point.heading}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {point.text}
                  </Typography>
                </Box>
              ))}

              <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
                These technologies are used because they are necessary for
                uniThread to operate not for advertising or behavioral
                tracking.
              </Typography>
            </PolicySection>

            <PolicySection
              id="types"
              title="Types of Cookies"
              icon={<ListAltOutlinedIcon />}
            >
              <Grid container spacing={2}>
                {COOKIE_TYPES.map((type) => (
                  <Grid size={{xs: 12, sm: 6}} key={type.title}>
                    <CookieTypeCard {...type} />
                  </Grid>
                ))}
              </Grid>
              <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />}>
                uniThread currently relies on strictly necessary technologies
                to operate. Analytics and marketing categories are described
                here for completeness and do not reflect current
                functionality unless this policy is updated to state
                otherwise.
              </Alert>
            </PolicySection>

   
            <PolicySection
              id="auth-security"
              title="Authentication & Security"
              icon={<LockOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                As a CRM handling sensitive business and customer information,
                uniThread depends on reliable authentication to protect your
                account and data. Cookies or comparable browser-side
                technologies play a role in maintaining this authenticated,
                secure connection between your browser and the application.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disabling or blocking these necessary technologies may
                prevent you from:
              </Typography>
              <List disablePadding>
                {AUTH_CONSEQUENCES.map((item) => (
                  <BulletItem key={item}>{item}</BulletItem>
                ))}
              </List>
              <Typography variant="body2" color="text.secondary">
                Because of this, strictly necessary technologies cannot be
                turned off through in-application settings; they can only be
                affected through your browser&apos;s own controls, as
                described in the Managing Cookies section below.
              </Typography>
            </PolicySection>

    
            <PolicySection
              id="third-party"
              title="Third-Party Technologies"
              icon={<HubOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                uniThread may rely on third-party infrastructure and service
                providers to help operate parts of the application, such as
                authentication, email delivery, or hosting. This does not
                automatically mean that every such provider places cookies in
                your browser.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This policy identifies a third-party provider as setting
                cookies only where that behavior is specifically known and
                implemented. uniThread does not currently identify
                third-party advertising or tracking cookies as part of its
                operation.
              </Typography>
            </PolicySection>

   
            <PolicySection
              id="managing"
              title="Managing Cookies"
              icon={<TuneOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                Most browsers allow you to view, manage, and delete cookies
                through their settings. The exact steps differ between
                browsers and devices, so we recommend checking your
                browser&apos;s help documentation for specific instructions.
              </Typography>
              <Alert severity="warning">
                Disabling or deleting strictly necessary cookies may affect
                your ability to log in, remain authenticated, maintain a
                session, and use core parts of uniThread securely. Necessary
                technologies exist to support these functions, so turning
                them off is likely to affect the application&apos;s
                availability rather than simply limiting optional features.
              </Alert>
            </PolicySection>

     
            <PolicySection
              id="consent"
              title="Cookie Consent"
              icon={<GavelOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                uniThread distinguishes between technologies that are
                necessary for core application functionality such as
                authentication and security and any optional technologies
                that may be introduced for other purposes.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                uniThread does not currently operate a separate
                cookie-consent mechanism for strictly necessary technologies,
                as these are required for the application to function. If
                optional technologies, such as analytics or marketing
                cookies, are introduced in the future, uniThread may update
                this policy and implement appropriate consent mechanisms at
                that time.
              </Typography>
            </PolicySection>

   
            <PolicySection
              id="data-privacy"
              title="Data & Privacy"
              icon={<PrivacyTipOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                This Cookie Policy focuses specifically on cookies and
                similar browser-side technologies. Depending on the
                technology and context, information collected through these
                mechanisms may constitute personal information.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For broader information about how uniThread collects, uses,
                and protects personal information, please refer to the
                Privacy Policy.
              </Typography>
              <Box>
                <Button
                  component={RouterLink}
                  to="/privacy"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Read Privacy Policy
                </Button>
              </Box>
            </PolicySection>


            <PolicySection
              id="changes"
              title="Changes to This Policy"
              icon={<UpdateOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                uniThread may update this Cookie Policy from time to time,
                including when cookie usage changes, new functionality is
                introduced, security practices are updated, or legal or
                regulatory requirements change.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The &quot;Last updated&quot; date at the top of this page
                reflects when this policy was last meaningfully revised.
              </Typography>
            </PolicySection>


            <PolicySection
              id="contact"
              title="Contact & Questions"
              icon={<ContactSupportOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                If you have questions about this Cookie Policy, please use
                the available support or feedback channel within uniThread
                CRM.
              </Typography>
            </PolicySection>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CookiePolicyPage;