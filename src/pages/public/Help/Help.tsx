import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleIcon from '@mui/icons-material/Article';

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ApartmentIcon from '@mui/icons-material/Apartment';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ContactsIcon from '@mui/icons-material/Contacts';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BadgeIcon from '@mui/icons-material/Badge';
import ForumIcon from '@mui/icons-material/Forum';
import HistoryIcon from '@mui/icons-material/History';
import ChecklistIcon from '@mui/icons-material/Checklist';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShieldIcon from '@mui/icons-material/Shield';
import BuildIcon from '@mui/icons-material/Build';
import QuizIcon from '@mui/icons-material/Quiz';
import ScienceIcon from '@mui/icons-material/Science';
import MapIcon from '@mui/icons-material/Map';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ExploreIcon from '@mui/icons-material/Explore';

type FeatureAvailability = 'live' | 'simulated' | 'coming-soon' | 'planned';

interface HelpItem {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
  availability?: FeatureAvailability;
  note?: string;
}

interface HelpSection {
  id: string;
  navLabel: string;
  title: string;
  icon: SvgIconComponent;
  intro: string;
  items: HelpItem[];
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface TroubleshootingItem {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
}

interface RoadmapItem {
  id: string;
  title: string;
  body: string;
}

interface RoadmapGroup {
  id: string;
  label: string;
  items: RoadmapItem[];
}

interface SearchEntry {
  id: string;
  sectionId: string;
  sectionLabel: string;
  title: string;
  snippet: string;
  keywords: string;
}


const availabilityConfig: Record<FeatureAvailability, { label: string; icon: SvgIconComponent }> = {
  live: { label: 'Live', icon: CheckCircleIcon },
  simulated: { label: 'Simulated', icon: ScienceIcon },
  'coming-soon': { label: 'Coming soon', icon: ScheduleIcon },
  planned: { label: 'Planned', icon: ExploreIcon },
};

function AvailabilityChip({ availability }: { availability: FeatureAvailability }) {
  const theme = useTheme();
  const { label, icon: Icon } = availabilityConfig[availability];
  const colorMap: Record<FeatureAvailability, string> = {
    live: theme.palette.success.main,
    simulated: theme.palette.warning.main,
    'coming-soon': theme.palette.info.main,
    planned: theme.palette.text.disabled,
  };
  const color = colorMap[availability];
  return (
    <Chip
      icon={<Icon style={{ color }} fontSize="small" />}
      label={label}
      size="small"
      variant="outlined"
      sx={{ borderColor: color, color, fontWeight: 600, '& .MuiChip-icon': { color } }}
    />
  );
}


const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    navLabel: 'Getting Started',
    title: 'Getting Started',
    icon: RocketLaunchIcon,
    intro:
      'uniThread CRM is a multi-tenant SaaS CRM designed to help organizations manage their customer lifecycle, sales pipeline, communications, activities, and team collaboration from one workspace.',
    items: [
      {
        id: 'what-is-unithread',
        title: 'What is uniThread CRM?',
        body:
          'uniThread represents one thread that connects people, relationships, conversations, and business activity together in one workspace. Instead of scattering leads, contacts, deals, and communication history across separate tools, uniThread keeps them connected under a single customer record.',
      },
      {
        id: 'crm-lifecycle',
        title: 'The basic CRM lifecycle',
        body:
          'Every relationship in uniThread moves through the same connected lifecycle: Lead \u2192 Contact \u2192 Deal \u2192 Customer. This keeps the customer journey organized instead of scattering information across unrelated records.',
        bullets: [
          'Lead: a potential customer who has entered the system through an inquiry, referral, advertisement response, import, or manual creation.',
          'Contact: a qualified lead that has become an active contact record for continued communication and relationship management.',
          'Deal: an active sales opportunity associated with a contact and moving through a sales pipeline.',
          'Customer: a completed, won relationship that is now managed as a customer.',
        ],
      },
    ],
  },
  {
    id: 'account',
    navLabel: 'Account',
    title: 'Account & Authentication',
    icon: LockPersonIcon,
    intro: 'How to create an account, sign in, and keep your account secure.',
    items: [
      {
        id: 'creating-account',
        title: 'Creating an account',
        body:
          'You can create a uniThread CRM account using your email address and a password. Email verification is required before you get normal account access.',
      },
      {
        id: 'login',
        title: 'Logging in',
        body: 'You authenticate through the application and receive an authenticated session used for subsequent requests.',
      },
      {
        id: 'password-reset',
        title: 'Password reset',
        body: 'If you forget your password, use the password reset flow from the login screen to set a new one.',
      },
      {
        id: 'email-verification',
        title: 'Email verification',
        body:
          'Email verification confirms that you own the email address on your account before granting normal access, which protects both your account and your organization\u2019s workspace.',
      },
      {
        id: 'google-auth',
        title: 'Signing in with Google',
        body: 'Google sign-in as an alternative to email and password is on the roadmap.',
        availability: 'planned',
      },
      {
        id: 'auth-security',
        title: 'Authentication security',
        body: 'Account access is protected by several layers working together, without relying on any single point of trust.',
        bullets: [
          'JWT-based authentication for identifying signed-in requests',
          'Authenticated sessions',
          'Protected API requests',
          'Backend authorization on every request',
          'Request validation',
          'Role-based authorization',
        ],
      },
    ],
  },
  {
    id: 'workspace',
    navLabel: 'Workspace',
    title: 'Workspace & Organization',
    icon: ApartmentIcon,
    intro: 'Every organization that signs up receives its own isolated workspace.',
    items: [
      {
        id: 'org-profile',
        title: 'Organization profile',
        body: 'Your workspace holds an organization profile with details used across the CRM.',
        bullets: [
          'Organization name',
          'Organization information',
          'Industry',
          'Website',
          'Subscription information',
          'Team members',
          'Invitation management',
        ],
      },
      {
        id: 'multi-tenancy',
        title: 'Multi-tenancy, in plain language',
        body:
          'Multiple organizations can use the same application, but each organization operates inside its own isolated data boundary. One organization cannot access another organization\u2019s leads, contacts, deals, customers, members, communications, or activities.',
      },
      {
        id: 'isolation-enforcement',
        title: 'How isolation is enforced',
        body:
          'Isolation between organizations is enforced through backend authorization together with PostgreSQL Row Level Security, not just by hiding things in the interface.',
      },
    ],
  },
  {
    id: 'team',
    navLabel: 'Team & Roles',
    title: 'Team & Roles',
    icon: GroupsIcon,
    intro: 'uniThread CRM currently supports three roles: Owner, Manager, and Agent.',
    items: [
      {
        id: 'role-owner',
        title: 'Owner',
        body: 'The Owner has full control over the workspace.',
        bullets: ['Full workspace access', 'Billing and subscription management', 'Organization settings', 'Member management'],
      },
      {
        id: 'role-manager',
        title: 'Manager',
        body: 'The Manager role is built for running the team and the day-to-day CRM.',
        bullets: ['Team management', 'CRM management', 'Invite new members', 'Manage deals and contacts'],
      },
      {
        id: 'role-agent',
        title: 'Agent',
        body: 'The Agent role is built for daily CRM work on assigned records.',
        bullets: ['Daily CRM operations', 'Manage assigned leads', 'Manage assigned contacts and deals', 'Manage assigned customers'],
      },
      {
        id: 'permission-enforcement',
        title: 'How permissions are enforced',
        body:
          'Permissions are enforced by the application and the backend, not only by hiding buttons in the interface. A request outside your role\u2019s permissions is rejected on the server, not just hidden on screen.',
      },
      {
        id: 'member-invitations',
        title: 'Inviting members',
        body: 'Owners and Managers can invite new members to the workspace.',
        bullets: [
          'Invitations can specify a role',
          'Invitations may have an optional email restriction',
          'Invitations can have a maximum usage count',
          'Invitations can have an expiration date',
          'Invitations can be revoked',
        ],
        note: 'When a user accepts an invitation, they join your organization\u2019s workspace with the role specified on that invitation.',
      },
    ],
  },
  {
    id: 'leads',
    navLabel: 'Leads',
    title: 'Leads',
    icon: PersonSearchIcon,
    intro: 'A lead is where a potential relationship starts, before enough is known to treat it as an active contact.',
    items: [
      {
        id: 'lead-actions',
        title: 'What you can do with a lead',
        body: 'Leads support the everyday actions needed to work a new potential customer.',
        bullets: ['Create', 'Edit', 'Delete', 'Search', 'Filter', 'Assign tags', 'Record notes', 'Track activities', 'Convert to contact'],
      },
      {
        id: 'lead-workflow',
        title: 'Lead workflow',
        body: 'Leads move through a simple status flow: New \u2192 Contacted \u2192 Qualified / Not qualified.',
        bullets: [
          'Qualified: the lead becomes a Contact for continued relationship management.',
          'Not qualified: the lead is closed and retained for historical reference and possible future follow-up.',
        ],
        note: 'Qualifying a lead can require sufficient contact information, such as a valid email address or phone number, depending on the application\u2019s validation rules.',
      },
    ],
  },
  {
    id: 'contacts',
    navLabel: 'Contacts',
    title: 'Contacts',
    icon: ContactsIcon,
    intro: 'A contact stores detailed information about a person and becomes the central record for future interactions.',
    items: [
      {
        id: 'contact-info',
        title: 'What a contact record stores',
        body: 'A contact can hold the details you need to keep the relationship organized.',
        bullets: ['Name', 'Email', 'Phone number', 'Company', 'Position', 'Address', 'Website', 'Notes', 'Tags', 'Status', 'Connected accounts'],
      },
      {
        id: 'contact-actions',
        title: 'What you can do with a contact',
        body: 'Contacts support the day-to-day actions of managing a relationship.',
        bullets: [
          'Create',
          'Update',
          'Delete',
          'Search',
          'Filter',
          'Send email',
          'Send simulated SMS',
          'Log simulated call',
          'Create a deal',
          'Add notes',
          'Track activities',
        ],
        note: 'Communications and activities logged for a contact are associated with that contact\u2019s record, so its history stays in one place.',
      },
    ],
  },
  {
    id: 'deals',
    navLabel: 'Deals',
    title: 'Deals',
    icon: HandshakeIcon,
    intro: 'A deal represents an active sales opportunity moving through your pipeline.',
    items: [
      {
        id: 'deal-fields',
        title: 'What a deal tracks',
        body: 'A deal record keeps the details relevant to closing an opportunity.',
        bullets: ['Deal title', 'Deal value', 'Expected closing date', 'Assigned member', 'Pipeline stage', 'Contact', 'Notes', 'Activities'],
      },
      {
        id: 'deal-pipeline',
        title: 'Pipeline stages and the Kanban board',
        body:
          'Deals move through a Kanban-style pipeline: Prospecting \u2192 Proposal \u2192 Negotiation \u2192 Closed Won / Closed Lost. Deals can be moved between stages with drag-and-drop, and pipeline stages can be customized depending on your organization\u2019s configuration.',
        note: 'Changes to a deal, including stage moves, can be reflected in its activity history.',
      },
      {
        id: 'deal-outcomes',
        title: 'Won and lost deals',
        body: 'A deal reaches one of two outcomes.',
        bullets: [
          'Won: the opportunity has successfully closed and can become a Customer.',
          'Lost: the opportunity is closed without becoming a customer and remains available for historical reference.',
        ],
      },
    ],
  },
  {
    id: 'customers',
    navLabel: 'Customers',
    title: 'Customers',
    icon: BadgeIcon,
    intro: 'A customer represents a successful relationship after a deal has been won.',
    items: [
      {
        id: 'customer-record',
        title: 'What a customer record includes',
        body: 'Once a deal is won, the relationship continues as a customer record.',
        bullets: ['Contact details', 'Customer status', 'Purchase history', 'Activities', 'Assigned member', 'Notes'],
      },
      {
        id: 'customer-status',
        title: 'Customer statuses',
        body: 'Customers are tracked using one of four statuses: Active, Inactive, At Risk, Churned.',
      },
      {
        id: 'customer-focus',
        title: 'What customer management is for',
        body: 'Customer management focuses on maintaining the relationship after the initial sale, rather than re-running the sales process.',
      },
    ],
  },
  {
    id: 'communications',
    navLabel: 'Communications',
    title: 'Communications',
    icon: ForumIcon,
    intro:
      'uniThread CRM supports several ways to communicate with contacts and with your team. Some are fully live today, and some are currently simulated while the underlying provider integrations are built.',
    items: [
      {
        id: 'comm-email',
        title: 'Email',
        body: 'Email can be sent directly from a contact record, using rich text composition with a subject and body.',
        bullets: ['Send email from a contact record', 'Rich text composition', 'Subject and body fields', 'Email history associated with the contact', 'Email activity can be logged'],
        availability: 'live',
      },
      {
        id: 'comm-sms',
        title: 'SMS',
        body:
          'SMS is currently simulated. Messages are composed and stored inside the CRM to demonstrate the complete workflow without requiring a paid SMS provider. SMS does not currently send a real cellular text message.',
        bullets: ['Compose SMS', 'Store the message', 'Display message history', 'Demonstrate the messaging workflow'],
        availability: 'simulated',
        note: 'Twilio integration for sending real SMS is planned for a future release.',
      },
      {
        id: 'comm-calls',
        title: 'Calls',
        body:
          'Calls are currently simulated. You can log a call outcome, record its duration, and add call notes, but this does not represent a live VoIP call.',
        bullets: ['Log call outcome', 'Record call duration', 'Add call notes', 'Keep the call associated with the relevant record'],
        availability: 'simulated',
        note: 'VoIP integration for live calling is planned.',
      },
      {
        id: 'comm-chat',
        title: 'Internal chat',
        body: 'Team members can message one another directly inside uniThread.',
        bullets: ['Message other team members', 'Conversations keep message history', 'A contact or customer can be attached to a conversation', 'Realtime messaging is supported'],
        availability: 'live',
        note: 'Typing indicators, online presence, and unread counts are not yet available; they are on the roadmap.',
      },
    ],
  },
  {
    id: 'activities',
    navLabel: 'Activities',
    title: 'Activities',
    icon: HistoryIcon,
    intro: 'Activities provide an audit trail of important actions taken across your workspace.',
    items: [
      {
        id: 'activity-examples',
        title: 'What gets recorded as an activity',
        body: 'Activities capture the actions that matter for understanding what happened in your CRM.',
        bullets: [
          'Lead created',
          'Contact updated',
          'Deal moved to a new stage',
          'Customer created',
          'Email sent',
          'SMS sent',
          'Call completed',
          'Member invited',
          'Member role changed',
          'Member removed',
        ],
      },
      {
        id: 'activity-purpose',
        title: 'Why activities matter',
        body: 'Activities help your organization understand who performed an action, what happened, and when it happened.',
      },
    ],
  },
  {
    id: 'tasks-notes',
    navLabel: 'Tasks & Notes',
    title: 'Tasks & Notes',
    icon: ChecklistIcon,
    intro: 'Tasks and notes keep work and context organized around your leads, contacts, and deals.',
    items: [
      {
        id: 'tasks',
        title: 'Tasks',
        body: 'Tasks help you and your team stay on top of follow-up work.',
        bullets: ['Assign tasks to team members', 'Create personal tasks', 'Set deadlines', 'Mark tasks public or private'],
        availability: 'live',
      },
      {
        id: 'notes',
        title: 'Notes',
        body: 'Notes preserve context that might otherwise be lost between conversations.',
        bullets: ['Attach notes to leads and contacts', 'Keep personal notes', 'Mark notes public or private'],
        availability: 'live',
      },
    ],
  },
  {
    id: 'dashboard',
    navLabel: 'Dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    intro: 'The dashboard gives a quick, high-level overview of business activity across your workspace.',
    items: [
      {
        id: 'dashboard-contents',
        title: 'What the dashboard shows',
        body: 'The dashboard is designed to provide a high-level view rather than replace detailed CRM records.',
        bullets: ['Total leads', 'Total contacts', 'Total deals', 'Total customers', 'Pipeline summary', 'Recent activity', 'Business statistics', 'Visual charts'],
      },
    ],
  },
  {
    id: 'billing',
    navLabel: 'Billing',
    title: 'Subscriptions & Plans',
    icon: PaymentsIcon,
    intro: 'uniThread CRM currently offers a Free plan, with additional plans planned for future release.',
    items: [
      {
        id: 'current-plan',
        title: 'Current plan',
        body: 'The Free plan is available today.',
        availability: 'live',
      },
      {
        id: 'planned-plans',
        title: 'Planned plans',
        body: 'Starter, Team, Business, and Enterprise plans are planned and not yet available.',
        availability: 'planned',
      },
      {
        id: 'plan-structure',
        title: 'What a plan can define',
        body: 'Subscription plans can define resource limits, retention, billing cycle, and workspace access.',
        bullets: ['Resource limits', 'Retention', 'Billing cycle', 'Workspace access'],
      },
      {
        id: 'billing-periods',
        title: 'Billing periods',
        body: 'A subscription can be Free, Monthly, or Yearly.',
      },
      {
        id: 'payment-methods',
        title: 'Payment methods',
        body: 'Payment provider integrations are not currently active. Stripe, PayPal, GCash, and Maya are potential, planned payment methods.',
        availability: 'planned',
      },
      {
        id: 'subscription-status',
        title: 'Subscription statuses',
        body: 'A subscription can be in one of these statuses: Active, Cancelled, Expired, Past due.',
      },
      {
        id: 'resource-limits',
        title: 'Resource limits',
        body: 'Depending on your plan, limits may apply to the following resources.',
        bullets: ['Members', 'Leads', 'Contacts', 'Deals', 'Customers', 'Tasks', 'Notes', 'Emails', 'SMS', 'Calls'],
        note: 'Resources are not treated as unlimited unless explicitly supported by your current plan.',
      },
    ],
  },
  {
    id: 'security',
    navLabel: 'Security',
    title: 'Security & Privacy',
    icon: ShieldIcon,
    intro: 'A summary of how uniThread CRM protects your account and your organization\u2019s data, in plain language.',
    items: [
      {
        id: 'sec-authentication',
        title: 'Authentication',
        body: 'Signing in is protected by several layers working together.',
        bullets: ['JWT-based authentication', 'Secure login', 'Email verification', 'Password reset'],
      },
      {
        id: 'sec-authorization',
        title: 'Authorization',
        body: 'Every request is checked against what you are actually allowed to do.',
        bullets: ['Role-based authorization', 'Backend authorization', 'Protected APIs', 'Request validation'],
      },
      {
        id: 'sec-isolation',
        title: 'Data isolation',
        body:
          'Your organization\u2019s data is isolated from other organizations using database-level security policies and backend authorization.',
        bullets: ['PostgreSQL Row Level Security', 'Organization-scoped queries', 'Multi-tenant isolation'],
      },
      {
        id: 'sec-privacy',
        title: 'Privacy',
        body:
          'uniThread CRM is designed so that organization data remains within its organization boundary. Data is not intentionally shared between tenants.',
      },
    ],
  },
];

const troubleshootingItems: TroubleshootingItem[] = [
  {
    id: 'cannot-log-in',
    title: 'I cannot log in',
    body: 'Start by checking the basics, then use password reset if needed.',
    bullets: ['Email address is correct', 'Password is correct', 'Email verification status', 'Account status', 'Internet connection'],
  },
  {
    id: 'cannot-create-account',
    title: 'I cannot create an account',
    body:
      'Authentication providers may enforce security and rate limits. If a temporary signup rate limit appears, wait before trying again rather than repeatedly retrying the request.',
  },
  {
    id: 'verification-not-arrived',
    title: 'My email verification has not arrived',
    body: 'Check your spam or junk folder and confirm you used the correct email address. Some delay from your email provider is normal.',
    bullets: ['Check spam/junk folder', 'Confirm the correct email address', 'Allow for email provider delays'],
    
  },
  {
    id: 'forgot-password',
    title: 'I forgot my password',
    body: 'Use the password reset flow from the login screen to set a new password.',
  },
  {
    id: 'cannot-access-record',
    title: 'I cannot access a record',
    body: 'A few things commonly explain this.',
    bullets: [
      'The record belongs to another organization',
      'Your role does not have permission',
      'The record is not assigned or available to you',
      'The record may have been deleted or archived',
    ],
  },
  {
    id: 'cannot-qualify-lead',
    title: 'I cannot move a lead to qualified',
    body: 'Qualifying a lead may require sufficient contact information, such as a valid email address or phone number.',
  },
  {
    id: 'sms-not-arrived',
    title: 'SMS did not arrive on my phone',
    body: 'SMS is currently simulated and does not send a real cellular SMS message.',
  },
  {
    id: 'call-not-happened',
    title: 'The call did not actually happen',
    body: 'Calls are currently simulated and only record the call information inside the CRM.',
  },
  {
    id: 'other-org-cannot-see',
    title: 'Another organization cannot see my data',
    body: 'This is expected. Tenant isolation between organizations is intentional.',
  },
  {
    id: 'dashboard-unexpected',
    title: 'The dashboard does not show expected data',
    body: 'Dashboard values are based on records available to your current organization and your own permissions.',
  },
];

const faqItems: FaqItem[] = [
  { id: 'faq-free', question: 'Is uniThread CRM free?', answer: 'The current Beta includes a Free plan. Additional plans are planned.' },
  { id: 'faq-multi-tenant', question: 'Is uniThread CRM multi-tenant?', answer: 'Yes. Each organization operates in its own isolated workspace.' },
  {
    id: 'faq-cross-org',
    question: 'Can another organization see my data?',
    answer: 'No. Organization-level isolation is enforced by backend authorization and database-level security.',
  },
  { id: 'faq-invite', question: 'Can I invite team members?', answer: 'Yes, depending on your role and workspace permissions.' },
  { id: 'faq-roles', question: 'What roles are available?', answer: 'Owner, Manager, and Agent.' },
  { id: 'faq-sms', question: 'Can I send real SMS messages?', answer: 'Not currently. SMS is simulated in the current Beta.' },
  { id: 'faq-calls', question: 'Can I make real phone calls?', answer: 'Not currently. Calls are simulated.' },
  { id: 'faq-email', question: 'Can I send emails?', answer: 'Yes. Email functionality is available through the CRM\u2019s email workflow.' },
  { id: 'faq-chat', question: 'Can team members chat?', answer: 'Yes. Internal team chat is available.' },
  { id: 'faq-tasks', question: 'Can I create tasks?', answer: 'Yes.' },
  { id: 'faq-notes', question: 'Can I create notes?', answer: 'Yes.' },
  {
    id: 'faq-deal-stages',
    question: 'Can I customize deal stages?',
    answer: 'The deal system supports pipeline stages and a drag-and-drop workflow.',
  },
  {
    id: 'faq-ai',
    question: 'Does uniThread have AI?',
    answer:
      'AI functionality is part of the roadmap. Planned capabilities include contact insights, deal summaries, predictive scoring, an AI chat assistant, reply templates, and retrieval-augmented answers.',
  },
  {
    id: 'faq-realtime',
    question: 'Does uniThread support realtime?',
    answer:
      'Realtime functionality is currently used for internal messaging. Broader realtime updates across CRM records are planned.',
  },
  {
    id: 'faq-mobile',
    question: 'Does uniThread support mobile devices?',
    answer:
      'The interface is designed to be responsive across desktop, tablet, and mobile layouts, with ongoing responsive improvements during Beta.',
  },
];

const roadmapGroups: RoadmapGroup[] = [
  {
    id: 'roadmap-core-data',
    label: 'Core Data',
    items: [
      { id: 'rm-company-records', title: 'Company records', body: 'Support richer company-level CRM records beyond individual contacts.' },
      { id: 'rm-address-fields', title: 'Address fields', body: 'Expand structured address management.' },
      { id: 'rm-archiving', title: 'Archiving', body: 'Allow records to be archived without permanently deleting them.' },
      { id: 'rm-notifications', title: 'Notifications', body: 'Provide centralized notifications for important events.' },
      { id: 'rm-timezone', title: 'Time zone support', body: 'Improve date and time handling for organizations and users in different regions.' },
      { id: 'rm-currency', title: 'Multi-currency support', body: 'Allow organizations to manage deals and business values using multiple currencies.' },
      { id: 'rm-intl-phone', title: 'International phone numbers', body: 'Improve phone number formatting and support across countries.' },
      { id: 'rm-leaderboard', title: 'Leaderboard', body: 'Provide team performance rankings and sales activity comparisons.' },
      { id: 'rm-analytics', title: 'Advanced analytics', body: 'Provide deeper business intelligence and performance analysis.' },
      { id: 'rm-migration', title: 'Bulk data migration', body: 'Allow organizations to import and migrate larger datasets efficiently.' },
      { id: 'rm-calendar', title: 'Calendar view', body: 'Provide a calendar-oriented view of tasks, activities, and important dates.' },
      { id: 'rm-avatars', title: 'Avatar uploads', body: 'Allow users to upload and manage profile images.' },
    ],
  },
  {
    id: 'roadmap-experience',
    label: 'Experience',
    items: [
      { id: 'rm-mute', title: 'Mute conversations', body: 'Allow users to silence notifications for specific conversations.' },
      { id: 'rm-typing', title: 'Typing indicators', body: 'Show when another user is currently typing.' },
      { id: 'rm-presence', title: 'Online presence', body: 'Show whether team members are online or active.' },
      { id: 'rm-templates', title: 'Email templates', body: 'Allow reusable email templates for common communication.' },
      { id: 'rm-unread', title: 'Unread counts', body: 'Show unread message and conversation counts.' },
    ],
  },
  {
    id: 'roadmap-ai',
    label: 'AI',
    items: [
      { id: 'rm-insights', title: 'Contact insights', body: 'Generate useful summaries and insights from contact history.' },
      { id: 'rm-deal-summaries', title: 'Deal summaries', body: 'Summarize deal activity, history, and current status.' },
      { id: 'rm-scoring', title: 'Predictive scoring', body: 'Estimate lead or deal potential using historical and behavioral data.' },
      { id: 'rm-assistant', title: 'AI chat assistant', body: 'Provide an AI assistant directly inside the CRM.' },
      { id: 'rm-reply-templates', title: 'Reply templates', body: 'Generate or suggest context-aware responses.' },
      { id: 'rm-rag', title: 'Retrieval-augmented answers', body: 'Allow AI responses to use relevant CRM information as context.' },
    ],
  },
  {
    id: 'roadmap-performance',
    label: 'Performance',
    items: [
      { id: 'rm-websocket', title: 'Realtime updates over WebSocket', body: 'Expand realtime synchronization beyond internal messaging.' },
      { id: 'rm-caching', title: 'Response caching', body: 'Reduce repeated requests and improve response speed.' },
      { id: 'rm-pagination', title: 'Paginated data tables', body: 'Improve large dataset handling and table performance.' },
      { id: 'rm-search-opt', title: 'Search optimization', body: 'Improve search speed and relevance across CRM records.' },
    ],
  },
  {
    id: 'roadmap-polish',
    label: 'Polish',
    items: [
      { id: 'rm-loading', title: 'Loading states', body: 'Provide clearer feedback while data is loading.' },
      { id: 'rm-animations', title: 'Micro animations', body: 'Improve interaction feedback with subtle animations.' },
      { id: 'rm-placeholders', title: 'Data placeholders', body: 'Use skeletons and placeholders to make loading experiences feel smoother.' },
      { id: 'rm-tutorials', title: 'Guided tutorials', body: 'Provide walkthroughs for new users.' },
    ],
  },
  {
    id: 'roadmap-admin',
    label: 'Administration',
    items: [
      {
        id: 'rm-super-admin',
        title: 'Super admin console',
        body:
          'Provide platform-level administrative tools for managing the SaaS itself. A super admin is different from an organization\u2019s Owner, it operates above any single workspace.',
      },
    ],
  },
];

const quickCategories: { label: string; icon: SvgIconComponent; sectionId: string }[] = [
  { label: 'Getting Started', icon: RocketLaunchIcon, sectionId: 'getting-started' },
  { label: 'Account & Security', icon: LockPersonIcon, sectionId: 'account' },
  { label: 'Workspace', icon: ApartmentIcon, sectionId: 'workspace' },
  { label: 'Team Management', icon: GroupsIcon, sectionId: 'team' },
  { label: 'Leads', icon: PersonSearchIcon, sectionId: 'leads' },
  { label: 'Contacts', icon: ContactsIcon, sectionId: 'contacts' },
  { label: 'Deals', icon: HandshakeIcon, sectionId: 'deals' },
  { label: 'Customers', icon: BadgeIcon, sectionId: 'customers' },
  { label: 'Communications', icon: ForumIcon, sectionId: 'communications' },
  { label: 'Activities', icon: HistoryIcon, sectionId: 'activities' },
  { label: 'Dashboard', icon: DashboardIcon, sectionId: 'dashboard' },
  { label: 'Billing & Plans', icon: PaymentsIcon, sectionId: 'billing' },
  { label: 'Troubleshooting', icon: BuildIcon, sectionId: 'troubleshooting' },
];

const navEntries: { label: string; sectionId: string; icon: SvgIconComponent }[] = [
  { label: 'Getting Started', sectionId: 'getting-started', icon: RocketLaunchIcon },
  { label: 'Account', sectionId: 'account', icon: LockPersonIcon },
  { label: 'Workspace', sectionId: 'workspace', icon: ApartmentIcon },
  { label: 'Team', sectionId: 'team', icon: GroupsIcon },
  { label: 'Leads', sectionId: 'leads', icon: PersonSearchIcon },
  { label: 'Contacts', sectionId: 'contacts', icon: ContactsIcon },
  { label: 'Deals', sectionId: 'deals', icon: HandshakeIcon },
  { label: 'Customers', sectionId: 'customers', icon: BadgeIcon },
  { label: 'Communications', sectionId: 'communications', icon: ForumIcon },
  { label: 'Activities', sectionId: 'activities', icon: HistoryIcon },
  { label: 'Tasks & Notes', sectionId: 'tasks-notes', icon: ChecklistIcon },
  { label: 'Dashboard', sectionId: 'dashboard', icon: DashboardIcon },
  { label: 'Billing', sectionId: 'billing', icon: PaymentsIcon },
  { label: 'Security', sectionId: 'security', icon: ShieldIcon },
  { label: 'Troubleshooting', sectionId: 'troubleshooting', icon: BuildIcon },
  { label: 'FAQ', sectionId: 'faq', icon: QuizIcon },
  { label: 'Roadmap', sectionId: 'roadmap', icon: MapIcon },
];


function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  helpSections.forEach((section) => {
    section.items.forEach((item) => {
      entries.push({
        id: `${section.id}-${item.id}`,
        sectionId: section.id,
        sectionLabel: section.title,
        title: item.title,
        snippet: item.body,
        keywords: `${item.title} ${item.body} ${(item.bullets ?? []).join(' ')}`.toLowerCase(),
      });
    });
  });

  faqItems.forEach((faq) => {
    entries.push({
      id: faq.id,
      sectionId: 'faq',
      sectionLabel: 'Common questions',
      title: faq.question,
      snippet: faq.answer,
      keywords: `${faq.question} ${faq.answer}`.toLowerCase(),
    });
  });

  troubleshootingItems.forEach((item) => {
    entries.push({
      id: item.id,
      sectionId: 'troubleshooting',
      sectionLabel: 'Troubleshooting',
      title: item.title,
      snippet: item.body,
      keywords: `${item.title} ${item.body} ${(item.bullets ?? []).join(' ')}`.toLowerCase(),
    });
  });

  roadmapGroups.forEach((group) => {
    group.items.forEach((item) => {
      entries.push({
        id: item.id,
        sectionId: 'roadmap',
        sectionLabel: `Roadmap \u2013 ${group.label}`,
        title: item.title,
        snippet: item.body,
        keywords: `${item.title} ${item.body} ${group.label}`.toLowerCase(),
      });
    });
  });

  return entries;
}


function scrollToSection(id: string) {
  const node = document.getElementById(id);
  if (node) {
    node.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }
}

function HelpItemAccordion({ item }: { item: HelpItem }) {
  return (
    <Accordion disableGutters sx={{ '&:before': { display: 'none' }, border: 1, borderColor: 'divider', borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${item.id}-content`} id={`${item.id}-header`}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ width: '100%', pr: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {item.title}
          </Typography>
          {item.availability && <AvailabilityChip availability={item.availability} />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.25}>
          <Typography variant="body2" color="text.secondary">
            {item.body}
          </Typography>
          {item.bullets && item.bullets.length > 0 && (
            <Stack component="ul" spacing={0.75} sx={{ pl: 3, m: 0 }}>
              {item.bullets.map((bullet) => (
                <Typography component="li" variant="body2" color="text.secondary" key={bullet}>
                  {bullet}
                </Typography>
              ))}
            </Stack>
          )}
          {item.note && (
            <Alert severity="info" variant="outlined" sx={{ mt: 0.5 }}>
              {item.note}
            </Alert>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

const HelpSectionBlock = ({ section, index, sectionRef }: { section: HelpSection; index: number; sectionRef: (node: HTMLElement | null) => void }) => {
  const Icon = section.icon;
  return (
    <Box
      component="section"
      id={section.id}
      ref={sectionRef}
      aria-labelledby={`${section.id}-heading`}
      sx={{ py: { xs: 5, md: 7 }, bgcolor: index % 2 === 1 ? 'action.hover' : 'transparent', scrollMarginTop: { xs: 116, md: 128 } }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
          <Box
            aria-hidden
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>
          <Typography id={`${section.id}-heading`} component="h2" variant="h4" fontWeight={800}>
            {section.title}
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 3 }}>
          {section.intro}
        </Typography>
        <Box sx={{ maxWidth: 860 }}>
          {section.items.map((item) => (
            <HelpItemAccordion item={item} key={item.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};


export default function HelpCenterPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('getting-started');

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return searchIndex.filter((entry) => entry.keywords.includes(normalized)).slice(0, 20);
  }, [query, searchIndex]);

  const isSearching = query.trim().length > 0;

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const handleNavigate = useCallback((id: string) => {
    setQuery('');
    scrollToSection(id);
    setActiveSectionId(id);
  }, []);

  const handleResultClick = useCallback((entry: SearchEntry) => {
    setQuery('');
    scrollToSection(entry.sectionId);
    setActiveSectionId(entry.sectionId);
    // Give the scroll a moment to land, then open the specific accordion item if present.
    window.setTimeout(() => {
      const header = document.getElementById(`${entry.id}-header`) ?? document.getElementById(entry.id);
      header?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }, []);

  useEffect(() => {
    const sections = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <Box component="main">
      <Box
        component="section"
        aria-labelledby="help-hero-heading"
        sx={{
          pt: { xs: 7, md: 10 },
          pb: { xs: 5, md: 7 },
          background: (t) => `linear-gradient(180deg, ${t.palette.primary.main}0d 0%, transparent 60%)`,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Chip label="Help Center" size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, letterSpacing: 0.4 }} />
            <Typography id="help-hero-heading" component="h1" variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              How can we help?
            </Typography>
            <Typography variant="h6" component="p" color="text.secondary" fontWeight={400} sx={{ maxWidth: 620, lineHeight: 1.6 }}>
              Find answers, learn how uniThread CRM works, and get the most out of your workspace.
            </Typography>

            <Box sx={{ width: '100%', maxWidth: 560, pt: 1 }}>
              <TextField
                fullWidth
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the Help Center..."
                aria-label="Search the Help Center"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: query ? (
                    <InputAdornment position="end">
                      <Box
                        role="button"
                        tabIndex={0}
                        aria-label="Clear search"
                        onClick={() => setQuery('')}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') setQuery('');
                        }}
                        sx={{ display: 'flex', cursor: 'pointer', color: 'action.active' }}
                      >
                        <ClearIcon fontSize="small" />
                      </Box>
                    </InputAdornment>
                  ) : undefined,
                  sx: { bgcolor: 'background.paper', borderRadius: 3 },
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {isSearching && (
        <Box component="section" aria-live="polite" sx={{ pb: { xs: 5, md: 7 } }}>
          <Container maxWidth="md">
            {searchResults.length > 0 ? (
              <Stack spacing={1.5}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                </Typography>
                {searchResults.map((entry) => (
                  <Card key={entry.id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardActionArea onClick={() => handleResultClick(entry)} sx={{ p: 2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <ArticleIcon color="action" fontSize="small" sx={{ mt: 0.4 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="caption" color="primary.main" fontWeight={700}>
                            {entry.sectionLabel}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {entry.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {entry.snippet}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different keyword or browse the categories below.
                </Typography>
              </Paper>
            )}
          </Container>
        </Box>
      )}

      {!isSearching && (
        <Box component="section" aria-labelledby="quick-categories-heading" sx={{ pb: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">
            <Typography id="quick-categories-heading" component="h2" variant="h5" fontWeight={800} sx={{ mb: 3 }}>
              Browse by category
            </Typography>
            <Grid container spacing={2}>
              {quickCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Grid size={{xs: 6, md: 3, sm: 3}} key={category.sectionId}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: (t) => t.shadows[3] },
                      }}
                    >
                      <CardActionArea onClick={() => handleNavigate(category.sectionId)} sx={{ height: '100%', p: 2.25 }}>
                        <Stack spacing={1} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                            }}
                          >
                            <Icon fontSize="small" />
                          </Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {category.label}
                          </Typography>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>
      )}

      {!isSearching && (
        <>
          <Box
            component="nav"
            aria-label="Help Center sections"
            sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
          >
            <Stack sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 1, md: 3 } }}>
              <Tabs
                value={navEntries.some((entry) => entry.sectionId === activeSectionId) ? activeSectionId : false}
                onChange={(_event, value: string) => handleNavigate(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="Jump to Help Center section"
              >
                {navEntries.map((entry) => (
                  <Tab key={entry.sectionId} value={entry.sectionId} label={entry.label} sx={{ fontWeight: 600, textTransform: 'none', minHeight: 48 }} />
                ))}
              </Tabs>
            </Stack>
          </Box>

          {helpSections.map((section, index) => (
            <HelpSectionBlock
              key={section.id}
              section={section}
              index={index}
              sectionRef={(node) => {
                sectionRefs.current[section.id] = node;
              }}
            />
          ))}

          <Box
            component="section"
            id="troubleshooting"
            ref={(node: HTMLElement | null) => {
              sectionRefs.current.troubleshooting = node;
            }}
            aria-labelledby="troubleshooting-heading"
            sx={{ py: { xs: 5, md: 7 }, scrollMarginTop: { xs: 116, md: 128 } }}
          >
            <Container maxWidth="lg">
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <BuildIcon />
                </Box>
                <Typography id="troubleshooting-heading" component="h2" variant="h4" fontWeight={800}>
                  Troubleshooting
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 3 }}>
                Practical answers to the issues people run into most.
              </Typography>
              <Box sx={{ maxWidth: 860 }}>
                {troubleshootingItems.map((item) => (
                  <Accordion key={item.id} disableGutters sx={{ '&:before': { display: 'none' }, border: 1, borderColor: 'divider', borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${item.id}-header`}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1.25}>
                        <Typography variant="body2" color="text.secondary">
                          {item.body}
                        </Typography>
                        {item.bullets && (
                          <Stack component="ul" spacing={0.75} sx={{ pl: 3, m: 0 }}>
                            {item.bullets.map((bullet) => (
                              <Typography component="li" variant="body2" color="text.secondary" key={bullet}>
                                {bullet}
                              </Typography>
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              <Alert severity="info" variant="outlined" sx={{ mt: 3, maxWidth: 860 }}>
                Still stuck? Use the password reset flow for login issues, or submit feedback below and we will take a look.
              </Alert>
            </Container>
          </Box>

          <Box
            component="section"
            id="faq"
            ref={(node: HTMLElement | null) => {
              sectionRefs.current.faq = node;
            }}
            aria-labelledby="faq-heading"
            sx={{ py: { xs: 5, md: 7 }, bgcolor: 'action.hover', scrollMarginTop: { xs: 116, md: 128 } }}
          >
            <Container maxWidth="lg">
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <QuizIcon />
                </Box>
                <Typography id="faq-heading" component="h2" variant="h4" fontWeight={800}>
                  Common questions
                </Typography>
              </Stack>
              <Box sx={{ maxWidth: 860 }}>
                {faqItems.map((faq) => (
                  <Accordion key={faq.id} disableGutters sx={{ '&:before': { display: 'none' }, border: 1, borderColor: 'divider', borderRadius: 2, mb: 1.5, overflow: 'hidden', bgcolor: 'background.paper' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${faq.id}-header`}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Container>
          </Box>

          <Box
            component="section"
            id="roadmap"
            ref={(node: HTMLElement | null) => {
              sectionRefs.current.roadmap = node;
            }}
            aria-labelledby="roadmap-heading"
            sx={{ py: { xs: 5, md: 7 }, scrollMarginTop: { xs: 116, md: 128 } }}
          >
            <Container maxWidth="lg">
              <Alert
                severity="warning"
                icon={<ScienceIcon />}
                variant="outlined"
                sx={{ mb: 4, borderRadius: 3 }}
              >
                <AlertTitle sx={{ fontWeight: 800 }}>uniThread CRM is currently in Beta</AlertTitle>
                The Beta release contains the core CRM workflow, including leads, contacts, deals, customers,
                team management, communications, activities, dashboards, subscriptions, and security
                foundations. Beta development is currently focused on UI improvements, bug fixing,
                performance optimization, responsive design, comprehensive testing, additional
                integrations, realtime improvements, advanced analytics, and AI capabilities.
              </Alert>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <MapIcon />
                </Box>
                <Typography id="roadmap-heading" component="h2" variant="h4" fontWeight={800}>
                  Roadmap
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 4 }}>
                Everything below is planned and not yet available in the current Beta.
              </Typography>

              <Grid container spacing={4}>
                {roadmapGroups.map((group) => (
                  <Grid size={{xs: 12, md: 6}} key={group.id}>
                    <Typography variant="subtitle1" fontWeight={800} color="primary.main" sx={{ mb: 1.5 }}>
                      {group.label}
                    </Typography>
                    <Stack spacing={1.5}>
                      {group.items.map((item) => (
                        <Box key={item.id} sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="subtitle2" fontWeight={700}>
                              {item.title}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {item.body}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </>
      )}

      <Box component="section" aria-labelledby="feedback-heading" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: 1, borderColor: 'divider' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{xs: 12, md: 7}}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <FeedbackIcon color="primary" />
                  <Typography id="feedback-heading" component="h2" variant="h5" fontWeight={800}>
                    Still need help?
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Submit feedback if you run into any of the following:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {['Bug reports', 'Unexpected errors', 'Broken UI', 'Incorrect data', 'Feature requests', 'Usability issues', 'Security concerns', 'Questions not answered here'].map(
                    (reason) => (
                      <Box key={reason} component="li" sx={{ px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'action.hover', fontSize: '0.8125rem', fontWeight: 500 }}>
                        {reason}
                      </Box>
                    ),
                  )}
                </Stack>
              </Grid>
              <Grid size={{xs: 12, md: 5}}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ md: 'flex-end' }}>
                  <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/feedback')}>
                    Submit Feedback
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate('/app/dashboard')}>
                    Back to Dashboard
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}