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

const LEGAL_NAME = 'Jestony Silvano';
const COUNTRY = 'Philippines';
const WEBSITE_DISPLAY = 'uniThreadCRM.com';
const WEBSITE_HREF = 'https://unithreadcrm.com';
const CONTACT_EMAIL = 'silvanojestony27@gmail.com';

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
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ lineHeight: 1.85, mb: 2, ...sx }}
    >
      {children}
    </Typography>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
      {items.map((item, i) => (
        <Typography
          key={i}
          component="li"
          variant="body1"
          color="text.secondary"
          sx={{ lineHeight: 1.85, mb: 0.75 }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
}


interface TermsSection {
  id: string;
  number: number;
  title: string;
  shortLabel?: string; 
  body: React.ReactNode;
}

const sections: TermsSection[] = [
  {
    id: 'about',
    number: 1,
    title: 'About uniThread CRM',
    body: (
      <>
        <Paragraph>
          uniThread CRM is a
          software-as-a-service platform designed to help individuals, teams, and
          organizations manage customer relationships and business communications.
          The name reflects the platform's purpose: a centralized thread connecting
          people, information, customer relationships, and business activities in
          one place.
        </Paragraph>
        <Paragraph>uniThread provides functionality that may include:</Paragraph>
        <BulletList
          items={[
            'Lead management',
            'Contact management',
            'Deal and sales pipeline management',
            'Customer management',
            'Activities and interaction tracking',
            'Team and organization management',
            'Internal messaging and communication',
            'Email functionality',
            'Simulated or integrated communication features',
            'AI-assisted features',
            'Dashboards, reports, and analytics',
            'Roles and permissions',
            'Invitations and organization membership',
            'Subscription and plan management',
            'Other CRM and productivity features introduced over time',
          ]}
        />
      </>
    ),
  },
  {
    id: 'eligibility',
    number: 2,
    title: 'Eligibility',
    body: (
      <>
        <Paragraph>
          You must be legally capable of entering into these Terms to use
          uniThread. By using the Service, you represent that you meet this
          requirement.
        </Paragraph>
        <Paragraph>You agree to:</Paragraph>
        <BulletList
          items={[
            'Provide accurate account information',
            'Maintain accurate information going forward',
            'Comply with applicable laws',
            'Be authorized to act on behalf of an organization when creating or managing an organization account',
          ]}
        />
      </>
    ),
  },
  {
    id: 'accounts',
    number: 3,
    title: 'Accounts',
    body: (
      <>
        <Paragraph>You are responsible for:</Paragraph>
        <BulletList
          items={[
            'Maintaining accurate account information',
            'Protecting your login credentials',
            'Preventing unauthorized access to your account',
            'Activity that occurs through your account',
          ]}
        />
        <Paragraph>
          If you believe your account has been compromised, notify the Operator as
          soon as reasonably possible.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'organizations',
    number: 4,
    title: 'Organizations and Workspaces',
    body: (
      <>
        <Paragraph>
          uniThread uses a multi-tenant organization model. An organization is a
          workspace that may contain multiple members with different roles and
          permissions, including Owner, Manager, and Agent.
        </Paragraph>
        <Paragraph>
          Organization owners and admins are responsible for managing members and
          permissions within their organization. Depending on their assigned
          permissions, authorized members may have access to organization
          information, including customer and business data stored within that
          organization's workspace.
        </Paragraph>
        <Paragraph>
          The Operator is not responsible for internal disputes between members of
          the same organization, including disputes over access, permissions, or
          data ownership within an organization.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'user-content',
    number: 5,
    title: 'User Content and Data',
    body: (
      <>
        <Paragraph>
          Through your use of uniThread, you may submit information such as
          customer names, contact information, lead information, sales
          information, notes, messages, activities, business records, customer
          communications, files, and other supported information.
        </Paragraph>
        <Paragraph>
          <strong>You retain ownership of your User Content.</strong> The Operator
          does not claim ownership over your data or your customers' data.
        </Paragraph>
        <Paragraph>
          By submitting User Content, you grant the Operator a limited right to
          host, store, process, transmit, and otherwise use that User Content only
          as reasonably necessary to operate, secure, maintain, and provide the
          Service, and to comply with applicable legal obligations.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'content-responsibility',
    number: 6,
    title: 'User Responsibility for Content',
    body: (
      <>
        <Paragraph>
          You are responsible for the information you submit to uniThread. You
          must have the necessary rights, permissions, and lawful basis to
          collect, store, and process any information including personal
          information about your leads, contacts, and customers that you place
          into the Service.
        </Paragraph>
        <Paragraph>
          You are responsible for complying with applicable privacy and
          data-protection laws that apply to your use of uniThread and to the
          information you process through it.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    number: 7,
    title: 'Acceptable Use',
    body: (
      <>
        <Paragraph>You agree not to use uniThread to:</Paragraph>
        <BulletList
          items={[
            'Violate any applicable law or regulation',
            "Infringe another party's intellectual property or privacy rights",
            'Impersonate any person or entity',
            'Attempt to gain unauthorized access to any account, system, or data',
            'Circumvent or attempt to circumvent security measures',
            'Introduce malware or other harmful code',
            'Disrupt or interfere with the Service or its infrastructure',
            'Scrape, harvest, or extract data without authorization',
            'Engage in fraud or deceptive practices',
            'Harass, threaten, or abuse others',
            'Send unlawful spam or unauthorized communications',
            'Circumvent subscription limits or usage restrictions',
            'Resell or sublicense the Service without authorization',
          ]}
        />
        <Paragraph>
          Violations of this section may result in restriction, suspension, or
          termination of your account, as described in Section 20.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'communication-features',
    number: 8,
    title: 'Communication Features',
    body: (
      <>
        <Paragraph>
          uniThread may provide communication tools such as email, internal
          messaging, SMS-related workflows, call-related functionality, and other
          communication features.
        </Paragraph>
        <Paragraph>
          Some communication functionality may currently be simulated, limited,
          experimental, or dependent on third-party integrations. uniThread is not
          a telecommunications provider, and delivery of any message is not
          guaranteed.
        </Paragraph>
        <Paragraph>
          You are responsible for ensuring that your communications sent through
          uniThread comply with applicable laws regarding consent, marketing,
          privacy, and unsolicited communications.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'ai-features',
    number: 9,
    title: 'AI Features',
    body: (
      <>
        <Paragraph>
          uniThread may provide AI-assisted functionality, such as drafting
          suggestions, summaries, or organizational assistance.
        </Paragraph>
        <Paragraph>
          AI-generated output can be incomplete, inaccurate, outdated, or
          inappropriate for a particular situation. You should review
          AI-generated content before relying on it. AI features are not a
          substitute for, and should not be treated as, professional legal,
          financial, medical, or other expert advice.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'beta',
    number: 10,
    title: 'Beta and Experimental Features',
    body: (
      <>
        <Paragraph>
          uniThread is currently a beta / developing service. By using the
          Service, you acknowledge and accept that:
        </Paragraph>
        <BulletList
          items={[
            'Features may change without prior notice',
            'Features may be added, modified, or removed',
            'Bugs and unexpected behavior may occur',
            'Interfaces and workflows may change',
            'Underlying technical implementations may change',
            'Service interruptions may occur',
            'Experimental features may not work as expected, or at all',
          ]}
        />
      </>
    ),
  },
  {
    id: 'subscriptions',
    number: 11,
    title: 'Subscriptions and Plans',
    body: (
      <>
        <Paragraph>
          uniThread may offer free plans, paid plans, promotional plans, or other
          subscription tiers introduced over time. Plans may differ in features,
          usage limits, member limits, record limits, storage limits, AI limits,
          communication limits, and retention limits.
        </Paragraph>
        <Paragraph>
          Plan features and limits may change over time, subject to applicable
          law and appropriate notice where required.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'free-plans',
    number: 12,
    title: 'Free Plans and Usage Limits',
    body: (
      <>
        <Paragraph>
          Free plans may be subject to limitations, including limits on
          organization members, leads, contacts, deals, customers, storage, AI
          usage, historical or retained data, and other resources.
        </Paragraph>
        <Paragraph>
          You agree not to attempt to bypass or circumvent these restrictions.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'payments',
    number: 13,
    title: 'Payments and Refunds',
    body: (
      <>
        <Paragraph>If paid subscriptions are offered on uniThread:</Paragraph>
        <BulletList
          items={[
            'Pricing will be shown before purchase',
            'You are responsible for providing accurate billing information',
            'Failed payments may result in restricted access to paid features',
            'Applicable taxes may apply to your purchase',
            "Cancelling a subscription does not automatically guarantee a refund, unless required by law or stated in the applicable refund policy in effect at the time",
          ]}
        />
      </>
    ),
  },
  {
    id: 'third-party',
    number: 14,
    title: 'Third-Party Services',
    body: (
      <>
        <Paragraph>
          uniThread may rely on third-party services for functionality such as
          authentication, database infrastructure, hosting, email, payments,
          communication, analytics, AI, and other infrastructure.
        </Paragraph>
        <Paragraph>
          These third-party providers may have their own terms of service and
          privacy policies, which govern your interactions with those services.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'availability',
    number: 15,
    title: 'Service Availability',
    body: (
      <>
        <Paragraph>
          uniThread is provided on a best-effort basis. Uninterrupted or
          error-free availability is not guaranteed. Downtime may occur due to
          maintenance, updates, infrastructure failures, third-party failures,
          network problems, security incidents, bugs, or force majeure events.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'data-loss',
    number: 16,
    title: 'Data Loss and Backups',
    body: (
      <>
        <Paragraph>
          No online system can guarantee absolute protection against data loss.
          While the Operator takes reasonable measures to protect the Service and
          its data, we do not represent or warrant that your data will never be
          lost, corrupted, or temporarily unavailable.
        </Paragraph>
        <Paragraph>
          Where practical, you are encouraged to maintain your own backups or
          exports of important business information.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'privacy',
    number: 17,
    title: 'Privacy',
    body: (
      <>
        <Paragraph>
          Personal information submitted to or collected by uniThread is handled
          in accordance with the{' '}
          <MuiLink component={RouterLink} to="/privacy" underline="hover">
            uniThread Privacy Policy
          </MuiLink>
          .
        </Paragraph>
        <Paragraph>
          Organizations using uniThread to process customer or employee
          information remain responsible for complying with applicable privacy
          and data-protection requirements that apply to that information.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    number: 18,
    title: 'Intellectual Property',
    body: (
      <>
        <Paragraph>
          uniThread's software, branding, interface, design, documentation,
          underlying technology, and other proprietary components belong to, or
          are licensed to, the Operator.
        </Paragraph>
        <Paragraph>
          These Terms grant you permission to use the Service; they do not
          transfer any ownership of uniThread itself to you.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'feedback',
    number: 19,
    title: 'Feedback',
    body: (
      <>
        <Paragraph>
          You may submit suggestions, feature requests, bug reports, ideas, or
          other feedback about uniThread. The Operator may use this feedback to
          improve the Service without any obligation to compensate you, provided
          that any confidential information you share is not improperly
          disclosed.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'suspension',
    number: 20,
    title: 'Account Suspension and Termination',
    body: (
      <>
        <Paragraph>
          The Operator may suspend or terminate your access to uniThread in
          circumstances including:
        </Paragraph>
        <BulletList
          items={[
            'Material violation of these Terms',
            'Security risks to the Service or other users',
            'Fraud or abuse',
            'Illegal activity',
            'Circumvention of plan restrictions or usage limits',
            'Legal or regulatory requirements',
            'Discontinuation of the Service',
          ]}
        />
        <Paragraph>Where appropriate, reasonable notice may be provided.</Paragraph>
      </>
    ),
  },
  {
    id: 'effect-of-termination',
    number: 21,
    title: 'Effect of Termination',
    body: (
      <>
        <Paragraph>
          After termination, your access to uniThread generally ends. Your User
          Content may be deleted, retained for a limited period, or otherwise
          handled in accordance with the Privacy Policy and applicable law.
        </Paragraph>
        <Paragraph>
          Organization owners are encouraged to export important data before
          termination, where export functionality is available.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'disclaimer',
    number: 22,
    title: 'Disclaimer of Warranties',
    body: (
      <>
        <Paragraph>
          To the maximum extent permitted by applicable law, uniThread is
          provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong>{' '}
          basis, without warranties of any kind, whether express, implied, or
          statutory.
        </Paragraph>
        <Paragraph>The Operator does not guarantee:</Paragraph>
        <BulletList
          items={[
            'Continuous or uninterrupted availability',
            'Error-free operation',
            'Perfect accuracy of information or output',
            'The accuracy of AI-generated content',
            'Successful delivery of communications',
            'Suitability for every business or use case',
            'Complete security against unauthorized access',
          ]}
        />
        <Paragraph>
          Nothing in these Terms excludes or limits any warranty or right that
          cannot lawfully be excluded or limited under applicable law.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'liability',
    number: 23,
    title: 'Limitation of Liability',
    body: (
      <>
        <Paragraph>
          To the maximum extent permitted by applicable law, the Operator will
          not be liable for any indirect, incidental, special, consequential,
          exemplary, or punitive damages, including but not limited to loss of
          profits, revenue, business opportunities, data, goodwill, or business
          operations, arising out of or related to your use of uniThread.
        </Paragraph>
        <Paragraph>
          To the extent permitted by applicable law, the Operator's total
          liability arising out of or related to these Terms or the Service is
          limited to the amount you paid for the Service during the period
          giving rise to the claim. This limitation does not apply to liability
          that cannot legally be limited or excluded.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'indemnification',
    number: 24,
    title: 'Indemnification',
    body: (
      <>
        <Paragraph>
          To the extent permitted by applicable law, you agree to be responsible
          for claims, damages, or expenses arising from your violation of these
          Terms, your unlawful use of uniThread, your User Content, your
          violation of another person's rights, or your violation of applicable
          law.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'service-changes',
    number: 25,
    title: 'Changes to the Service',
    body: (
      <>
        <Paragraph>
          uniThread is continuously developing. The Operator may add, remove, or
          modify features, change interfaces, suspend functionality, or
          discontinue parts of the Service. Reasonable notice will be provided
          for material changes where appropriate.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'terms-changes',
    number: 26,
    title: 'Changes to These Terms',
    body: (
      <>
        <Paragraph>
          These Terms may be updated from time to time. The "Last Updated" date
          at the top of this page reflects the most recent revision.
        </Paragraph>
        <Paragraph>
          For material changes, the Operator may provide notice through
          uniThread, email, the website, or other reasonable methods. Continued
          use of uniThread after changes become effective constitutes acceptance
          of the updated Terms, where legally permitted.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'governing-law',
    number: 27,
    title: 'Governing Law',
    body: (
      <>
        <Paragraph>
          These Terms are governed by the laws of the Republic of the
          Philippines, without regard to conflict-of-law principles, except
          where mandatory consumer-protection or other legal protections
          applicable to you require otherwise.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'dispute-resolution',
    number: 28,
    title: 'Dispute Resolution',
    body: (
      <>
        <Paragraph>
          If a dispute arises, we encourage you to contact the Operator first and
          attempt to resolve the matter informally before pursuing formal
          proceedings. Nothing in this section removes any right you may have
          under applicable law.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'force-majeure',
    number: 29,
    title: 'Force Majeure',
    body: (
      <>
        <Paragraph>
          The Operator is not responsible for delays or failures in performance
          resulting from events beyond its reasonable control, including natural
          disasters, government actions, war, civil unrest, major infrastructure
          failures, internet failures, cyberattacks, labor disruptions,
          pandemics, or third-party infrastructure failures.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'severability',
    number: 30,
    title: 'Severability',
    body: (
      <>
        <Paragraph>
          If any provision of these Terms is found to be invalid or
          unenforceable, the remaining provisions will remain in full force and
          effect.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'entire-agreement',
    number: 31,
    title: 'Entire Agreement',
    body: (
      <>
        <Paragraph>
          These Terms, together with the Privacy Policy and any applicable
          feature-specific terms, constitute the entire agreement between you
          and the Operator concerning your use of uniThread.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'no-waiver',
    number: 32,
    title: 'No Waiver',
    body: (
      <>
        <Paragraph>
          The Operator's failure to enforce any provision of these Terms does
          not constitute a waiver of that provision or of any other provision.
        </Paragraph>
      </>
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
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.5, mb: 1, display: 'block' }}
      >
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
        aria-controls="terms-toc-mobile"
        startIcon={<MenuIcon />}
        endIcon={
          <ExpandMoreIcon
            sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          />
        }
        variant="outlined"
        fullWidth
        sx={{ justifyContent: 'space-between', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
      >
        Table of contents
      </Button>
      <Collapse in={open}>
        <Box
          id="terms-toc-mobile"
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
        uniThread CRM
      </Typography>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Operated by:</strong> {LEGAL_NAME}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Country:</strong> {COUNTRY}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Official Website:</strong>{' '}
          <MuiLink href={WEBSITE_HREF} target="_blank" rel="noopener noreferrer" underline="hover">
            {WEBSITE_DISPLAY}
          </MuiLink>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Contact Email:</strong>{' '}
          <MuiLink href={`mailto:${CONTACT_EMAIL}`} underline="hover">
            {CONTACT_EMAIL}
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}


export default function TermsOfService() {
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
            Terms of Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Last Updated: {LAST_UPDATED}
          </Typography>
          <Paragraph>
            These Terms of Service govern your access to and use of
            uniThread CRM, including the website, application, and related
            services. By creating an account or
            otherwise using uniThread, you agree to these Terms.
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
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}
                >
                  {section.number}. {section.title}
                </Typography>
                {section.body}
                {i < sections.length - 1 && <Divider sx={{ mt: 4 }} />}
              </Box>
            ))}

            <ContactCard />

  
            <Box sx={{ mt: 8 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Acceptance of These Terms
              </Typography>
              <Paragraph>
                By creating an account or using uniThread CRM, you acknowledge
                that you have read, understood, and agreed to these Terms.
              </Paragraph>
              <Paragraph sx={{ mb: 0 }}>
                uniThread is currently a beta / developing service. You are
                responsible for the data and communications you place into the
                platform.
              </Paragraph>
            </Box>

  
            <Box sx={{ mt: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <MuiLink component={RouterLink} to="/privacy" underline="hover" sx={{ fontWeight: 600 }}>
                Privacy Policy
              </MuiLink>
              <MuiLink component={RouterLink} to="/help" underline="hover" sx={{ fontWeight: 600 }}>
                Help Center
              </MuiLink>
              <MuiLink component={RouterLink} to="/aboutus" underline="hover" sx={{ fontWeight: 600 }}>
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