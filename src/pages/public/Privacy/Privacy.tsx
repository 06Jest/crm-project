import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Link as MuiLink,
  Divider,
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  alpha,
  type SxProps,
  type Theme,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';

const LAST_UPDATED = 'August 10, 2026';

const LEGAL_NAME = 'uniThread';
const PRIVACY_EMAIL = 'privacy@unithreadcrm.com';
const GENERAL_EMAIL = 'support@unithreadcrm.com';
const WEBSITE_DISPLAY = 'unithreadcrm.com';

const HEADER_OFFSET = 96; 



const CONTENT_MAX_WIDTH = 1180;

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: CONTENT_MAX_WIDTH,
        mx: 'auto',
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 5, sm: 7, md: 9 },
      }}
    >
      {children}
    </Box>
  );
}

function Paragraph({ children, sx }: React.PropsWithChildren<{ sx?: SxProps<Theme> }>) {
  return (
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, mb: 2, ...sx }}>
      {children}
    </Typography>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
      {items.map((item, i) => (
        <Typography key={i} component="li" variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, mb: 0.75 }}>
          {item}
        </Typography>
      ))}
    </Box>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 3, mb: 1.25 }}>
      {children}
    </Typography>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        pl: 2,
        py: 0.5,
        my: 2.5,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
        {children}
      </Typography>
    </Box>
  );
}


interface PolicySection {
  id: string;
  number: number;
  title: string;
  shortLabel?: string;
  body: React.ReactNode;
}

const sections: PolicySection[] = [
  {
    id: 'about',
    number: 1,
    title: 'About This Policy',
    body: (
      <>
        <Paragraph>
          This Privacy Policy explains how uniThread CRM ("uniThread," "the
          Service," "we," "us," or "our") collects, uses, shares, and protects
          information in connection with your access to and use of the
          Service.
        </Paragraph>
        <Paragraph>
          uniThread is a multi-tenant SaaS CRM and communication platform. The
          name reflects the idea of one thread that connects people, customer
          relationships, business information, communication, and teams in a
          single workspace. At this stage, uniThread is operated personally by
          its developer/founder rather than by a registered corporation, and
          the platform is currently in a beta / early-stage phase.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          This policy is written to be accurate about what uniThread actually
          does today. Where functionality is limited, experimental, or
          simulated, this policy says so.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'information-collected',
    number: 2,
    title: 'Information We Collect',
    body: (
      <>
        <Paragraph>
          The information uniThread collects depends on how the Service is
          used as an individual user, as a member of an organization, or as
          an organization administrator.
        </Paragraph>

        <SubHeading>Account information</SubHeading>
        <BulletList
          items={[
            'Email address',
            'Password / authentication information',
            'First and last name',
            'Job title',
            'Avatar or profile image',
            'Account status',
            'Organization membership and role',
            'Authentication and security information',
          ]}
        />

        <SubHeading>Organization information</SubHeading>
        <BulletList
          items={[
            'Organization name, type, and industry',
            'Workspace settings',
            'Organization members',
            'Subscription plan and status',
            'Time zone and currency',
            'Invitations',
            'Organization identifiers',
          ]}
        />

        <SubHeading>CRM information</SubHeading>
        <Paragraph>
          Users may enter information about their own customers and business
          relationships, including leads, contacts, customers, and deals;
          names, email addresses, phone numbers, and job titles; statuses and
          deal stages; tags, notes, activities, and tasks; communication, call,
          and SMS records; and other business information users choose to
          enter.
        </Paragraph>
        <Callout>
          Organizations are responsible for determining the appropriate legal
          basis and permissions for information they enter into uniThread
          about their own customers, employees, leads, contacts, or business
          partners.
        </Callout>

        <SubHeading>Communication information</SubHeading>
        <Paragraph>
          uniThread may process internal messages and conversations, message
          content and metadata, email sender/recipient information, email
          subject and content, and email delivery information, along with SMS
          and call records.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          Some communication functionality including SMS and call-related
          features may currently be simulated rather than connected to a
          real telecommunications provider. Simulated functionality does not
          represent an actual phone call or SMS delivery.
        </Paragraph>

        <SubHeading>Subscription information</SubHeading>
        <BulletList
          items={[
            'Subscription plan and status',
            'Subscription dates',
            'Organization associated with a subscription',
            'Billing-related identifiers and payment-related status',
          ]}
        />
        <Paragraph sx={{ mb: 0 }}>
          uniThread does not store payment card information unless this is
          explicitly confirmed and implemented; payment processing is
          generally handled by a third-party payment provider where
          applicable.
        </Paragraph>

        <SubHeading>Technical information</SubHeading>
        <Paragraph sx={{ mb: 0 }}>
          uniThread may automatically collect IP address, browser and device
          type, operating system, approximate location derived from technical
          information, pages or screens visited, features used, login
          activity, authentication events, session information, error and
          performance information, timestamps, and other security or
          diagnostic information.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'cookies',
    number: 3,
    title: 'Cookies and Similar Technologies',
    body: (
      <>
        <Paragraph>
          uniThread may use cookies, local storage, session storage, and
          similar technologies for authentication, maintaining sessions,
          remembering preferences, application functionality, security,
          performance, and understanding how the Service is used.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          uniThread does not use advertising cookies unless this is explicitly
          confirmed and disclosed.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'how-we-use',
    number: 4,
    title: 'How We Use Information',
    body: (
      <>
        <Paragraph>Information may be used to:</Paragraph>
        <BulletList
          items={[
            'Provide the CRM service and its features',
            'Create and manage accounts',
            'Authenticate users',
            'Manage organizations, workspaces, members, roles, and permissions',
            'Store and display CRM information',
            'Provide communication features',
            'Provide AI-assisted functionality',
            'Manage subscriptions and enforce usage limits',
            'Maintain and improve the Service',
            'Diagnose errors and detect fraud or abuse',
            'Protect accounts and systems, and maintain backups',
            'Communicate with users, including security and operational notifications',
            'Comply with applicable law',
            'Protect the rights and safety of users and the Service',
          ]}
        />
        <Paragraph sx={{ mb: 0 }}>
          uniThread does not sell personal information as a standalone
          product.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'ai-features',
    number: 5,
    title: 'AI Features',
    body: (
      <>
        <Paragraph>
          uniThread may contain AI-assisted functionality. Information
          provided to an AI feature may be processed to generate responses,
          summaries, recommendations, classifications, or other AI-generated
          results.
        </Paragraph>
        <Paragraph>
          AI-generated information is not always accurate, and users should
          avoid submitting highly sensitive personal information to AI
          features unless necessary and appropriately authorized.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          Where third-party AI providers are used, information may be
          processed by those providers according to their applicable terms
          and privacy practices. uniThread does not claim that AI-related data
          is never used for provider-side training unless this is technically
          and contractually guaranteed.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'data-sharing',
    number: 6,
    title: 'Data Sharing',
    body: (
      <>
        <Paragraph>Information may be shared:</Paragraph>
        <BulletList
          items={[
            "Within a user's organization, according to that organization's permissions and roles",
            'With service providers necessary to operate uniThread, such as Supabase (database and authentication infrastructure) and Resend (outbound email delivery)',
            'When required by law or legal process',
            'During a merger, acquisition, financing, restructuring, or sale of assets',
            'When specifically authorized or requested by the user',
          ]}
        />
        <Paragraph sx={{ mb: 0 }}>
          uniThread does not guarantee that service providers receive no data
          at all  providers listed above process data as necessary to
          deliver their respective infrastructure or services to uniThread.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'multi-tenant',
    number: 7,
    title: 'Multi-Tenant Privacy',
    body: (
      <>
        <Paragraph>
          uniThread uses a multi-tenant architecture. Each organization has
          its own workspace, and access to organization data is intended to
          be restricted according to organization membership, authentication,
          roles, permissions, authorization controls, database security
          controls, and Row-Level Security where applicable.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          A user belonging to one organization should not automatically have
          access to another organization's data. uniThread uses technical and
          organizational measures designed to maintain separation between
          organizations  this describes the intent and design of the system,
          not an absolute guarantee that cross-organization access can never
          occur.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'security',
    number: 8,
    title: 'Security',
    body: (
      <>
        <Paragraph>
          uniThread uses reasonable technical and organizational safeguards,
          which may include authentication and authorization controls,
          role-based access control, organization-level data isolation,
          secure API communication, JWT-based authentication, database
          security controls including Row-Level Security where applicable,
          secure password handling through the authentication infrastructure,
          monitoring and logging, backup and recovery procedures, and
          restricted production access.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          No internet-based system can guarantee absolute security. uniThread
          does not claim perfect or absolute security, and does not currently
          claim compliance with any specific security certification or
          standard (such as SOC 2 or PCI DSS) unless explicitly confirmed
          elsewhere.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'retention',
    number: 9,
    title: 'Data Retention',
    body: (
      <>
        <Paragraph>
          Information may be retained as long as reasonably necessary to
          provide the Service, maintain accounts and organizational records,
          fulfill contractual obligations, resolve disputes, enforce
          agreements, maintain security, comply with legal obligations, and
          maintain legitimate business records.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          Deletion may not immediately remove information from every backup,
          log, or security record.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'deletion',
    number: 10,
    title: 'Account and Data Deletion',
    body: (
      <>
        <Paragraph>
          Users may request account or personal-information deletion, subject
          to applicable legal and contractual requirements. Organization
          administrators may also control or request deletion of information
          belonging to their organization.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          Deletion requests may require identity verification. Some
          information may need to be retained for legal, security,
          dispute-resolution, or legitimate business purposes.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'privacy-rights',
    number: 11,
    title: 'Privacy Rights',
    body: (
      <>
        <Paragraph>
          Depending on applicable law, you may have rights such as access,
          correction, deletion, restriction of processing, objection to
          processing, data portability, withdrawal of consent where
          applicable, and the right to file a complaint with an applicable
          data protection authority.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          Not every right applies to every user, and availability depends on
          your jurisdiction and circumstances. Where CRM data is controlled by
          an organization using uniThread, you may need to contact that
          organization directly to exercise certain rights  see the next
          section.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'organization-controlled',
    number: 12,
    title: 'Organization-Controlled Information',
    body: (
      <>
        <Paragraph>
          uniThread is a B2B, multi-tenant CRM. Organizations using uniThread
          generally determine what information is entered, why it is
          collected, how it is used, and who within the organization can
          access it.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          An organization is responsible for complying with applicable
          privacy laws when entering information about its own customers,
          employees, leads, contacts, and business partners into uniThread.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'international-transfers',
    number: 13,
    title: 'International Data Transfers',
    body: (
      <Paragraph sx={{ mb: 0 }}>
        uniThread and its service providers may process information in
        countries other than the one where you live. Where required by
        applicable law, appropriate safeguards are used for such transfers.
        uniThread does not claim to rely on a specific international transfer
        mechanism unless this has been confirmed.
      </Paragraph>
    ),
  },
  {
    id: 'childrens-privacy',
    number: 14,
    title: "Children's Privacy",
    body: (
      <Paragraph sx={{ mb: 0 }}>
        uniThread is a business-oriented CRM and is not intended for use by
        children. We do not knowingly collect personal information from
        children in violation of applicable law.
      </Paragraph>
    ),
  },
  {
    id: 'third-party-services',
    number: 15,
    title: 'Third-Party Services',
    body: (
      <Paragraph sx={{ mb: 0 }}>
        uniThread may integrate with or link to third-party services. Those
        services have their own privacy policies and terms, and uniThread is
        not responsible for the practices of services it does not control.
      </Paragraph>
    ),
  },
  {
    id: 'communications',
    number: 16,
    title: 'Marketing and Service Communications',
    body: (
      <>
        <Paragraph>
          uniThread may send account verification emails, security
          notifications, password and authentication messages, subscription
          notifications, service announcements, operational notifications,
          and other necessary account-related communications.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          If promotional communications are introduced, you will be able to
          opt out where required by applicable law. Not every communication
          including account-related and security notifications can be
          unsubscribed from, as some are necessary to operate the Service.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'technical-infrastructure',
    number: 17,
    title: 'Technical Infrastructure',
    body: (
      <>
        <Paragraph>
          uniThread is built using technologies and third-party infrastructure
          that may include React, Node.js, Express, and TypeScript for the
          application itself; PostgreSQL and Supabase for database and
          authentication infrastructure; server-side, JWT-based authentication
          and authorization with database access controls, including
          Row-Level Security where applicable; and Resend for outbound email
          delivery.
        </Paragraph>
        <Paragraph sx={{ mb: 0 }}>
          uniThread does not claim that data is end-to-end encrypted, and does
          not claim compliance with GDPR, CCPA, HIPAA, SOC 2, PCI DSS, or
          other legal or security frameworks, unless explicitly confirmed.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'policy-updates',
    number: 18,
    title: 'Policy Updates',
    body: (
      <Paragraph sx={{ mb: 0 }}>
        This Privacy Policy may be updated from time to time. The "Last
        Updated" date at the top of this page reflects the most recent
        revision. Material changes may receive additional notice where
        required by applicable law.
      </Paragraph>
    ),
  },
];

const tocItems = sections.map((s) => ({
  id: s.id,
  label: `${s.number}. ${s.shortLabel ?? s.title}`,
}));


function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}


function TocDesktop({ activeId }: { activeId: string | null }) {
  return (
    <Box
      component="nav"
      aria-label="Table of contents"
      sx={{
        position: 'sticky',
        top: HEADER_OFFSET,
        alignSelf: 'flex-start',
        width: 260,
        flexShrink: 0,
        maxHeight: `calc(100vh - ${HEADER_OFFSET}px - 24px)`,
        overflowY: 'auto',
        pr: 2,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.5, mb: 1, display: 'block' }}>
        On this page
      </Typography>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {tocItems.map((item) => {
          const active = item.id === activeId;
          return (
            <Box component="li" key={item.id}>
              <MuiLink
                href={`#${item.id}`}
                underline="none"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.id);
                }}
                sx={{
                  display: 'block',
                  py: 0.6,
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? 'primary.main' : 'text.secondary',
                  borderLeft: '2px solid',
                  borderColor: active ? 'primary.main' : 'transparent',
                  pl: 1.5,
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  '&:hover': { color: 'text.primary' },
                  '&:focus-visible': {
                    outline: (t) => `2px solid ${t.palette.primary.main}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {item.label}
              </MuiLink>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}


function TocMobile() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="privacy-toc-mobile"
        startIcon={<MenuIcon />}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />}
        variant="outlined"
        fullWidth
        sx={{ justifyContent: 'space-between', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        Table of contents
      </Button>
      <Collapse in={open}>
        <Box
          id="privacy-toc-mobile"
          component="nav"
          aria-label="Table of contents"
          sx={{
            mt: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            maxHeight: 320,
            overflowY: 'auto',
            p: 1.5,
          }}
        >
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {tocItems.map((item) => (
              <Box component="li" key={item.id}>
                <MuiLink
                  href={`#${item.id}`}
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    scrollToId(item.id);
                  }}
                  sx={{
                    display: 'block',
                    py: 0.9,
                    px: 1,
                    fontSize: '0.9rem',
                    color: 'text.secondary',
                    borderRadius: 1,
                    '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
                  }}
                >
                  {item.label}
                </MuiLink>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}


function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <IconButton
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      sx={{
        position: 'fixed',
        bottom: { xs: 20, sm: 32 },
        right: { xs: 20, sm: 32 },
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        boxShadow: 3,
        '&:hover': { bgcolor: 'primary.dark' },
        zIndex: (t) => t.zIndex.speedDial,
      }}
    >
      <KeyboardArrowUpIcon />
    </IconButton>
  );
}


function ContactCard() {
  return (
    <Box
      sx={{
        mt: 8,
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.08 : 0.04),
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Contact Us
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
        Questions about this Privacy Policy or how your information is
        handled can be directed to:
      </Typography>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Legal / Business Name:</strong> {LEGAL_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Privacy Email:</strong> {PRIVACY_EMAIL}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>General Email:</strong> {GENERAL_EMAIL}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Website:</strong> {WEBSITE_DISPLAY}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
        Placeholder contact details replace with your actual legal name,
        email addresses, address, and website before publishing this policy.
      </Typography>
    </Box>
  );
}


export default function PrivacyPolicy() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isDesktop) return;

    const ids = sections.map((s) => s.id);

    const onScroll = () => {
      let current: string | null = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - HEADER_OFFSET <= 8) {
          current = id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isDesktop]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <PageContainer>
  
        <Box sx={{ mb: { xs: 5, md: 7 }, maxWidth: 760 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1.5, fontSize: { xs: '2rem', sm: '2.5rem' } }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Last Updated: {LAST_UPDATED}
          </Typography>
          <Paragraph sx={{ mb: 0 }}>
            This Privacy Policy explains how uniThread CRM collects, uses,
            shares, and protects information when you access or use the
            Service. It applies alongside our{' '}
            <MuiLink component={RouterLink} to="/terms" underline="hover">
              Terms of Service
            </MuiLink>
            .
          </Paragraph>
        </Box>

        <TocMobile />

  
        <Box sx={{ display: 'flex', gap: { md: 6 }, alignItems: 'flex-start' }}>
          <TocDesktop activeId={activeId} />

          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 760 }}>
            {sections.map((section, i) => (
              <Box
                key={section.id}
                id={section.id}
                component="section"
                sx={{ scrollMarginTop: HEADER_OFFSET, mb: i === sections.length - 1 ? 0 : 5 }}
              >
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
                  {section.number}. {section.title}
                </Typography>
                {section.body}
                {i < sections.length - 1 && <Divider sx={{ mt: 4 }} />}
              </Box>
            ))}

            <ContactCard />


            <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <MuiLink component={RouterLink} to="/terms" underline="hover" sx={{ fontWeight: 600 }}>
                Terms of Service
              </MuiLink>
              <MuiLink component={RouterLink} to="/help" underline="hover" sx={{ fontWeight: 600 }}>
                Help Center
              </MuiLink>
              <MuiLink component={RouterLink} to="/about" underline="hover" sx={{ fontWeight: 600 }}>
                About uniThread
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </PageContainer>

      <BackToTop />
    </Box>
  );
}