import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BuildIcon from '@mui/icons-material/Build';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import DatabaseIcon from '@mui/icons-material/Storage';
import ExperienceIcon from '@mui/icons-material/Forum';
import AiIcon from '@mui/icons-material/AutoAwesome';
import PerformanceIcon from '@mui/icons-material/Speed';
import PolishIcon from '@mui/icons-material/AutoFixHigh';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';

type FeatureStatus = 'planned' | 'in-development' | 'beta' | 'released' | 'future';

type RoadmapPhaseId = 'foundation' | 'experience' | 'intelligence' | 'scale';

type CategoryId = 'core-data' | 'experience' | 'ai' | 'performance' | 'polish' | 'administration';

interface RoadmapFeature {
  id: string;
  name: string;
  summary: string;
  rationale: string;
  capabilities: string[];
  status: FeatureStatus;
  phase: RoadmapPhaseId;
  note?: string;
}

interface RoadmapCategory {
  id: CategoryId;
  label: string;
  shortDescription: string;
  description: string;
  icon: SvgIconComponent;
  features: RoadmapFeature[];
}

interface RoadmapPhaseInfo {
  id: RoadmapPhaseId;
  label: string;
  description: string;
}


const roadmapPhases: RoadmapPhaseInfo[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Core data improvements and platform infrastructure.',
  },
  {
    id: 'experience',
    label: 'Experience',
    description: 'Collaboration, communication, and usability improvements.',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    description: 'AI-powered insights, summaries, assistants, and retrieval.',
  },
  {
    id: 'scale',
    label: 'Scale',
    description: 'Performance, realtime infrastructure, caching, search, and administration.',
  },
];

const roadmapCategories: RoadmapCategory[] = [
  {
    id: 'core-data',
    label: 'Core Data',
    icon: DatabaseIcon,
    shortDescription: 'Expanding what uniThread can store and how it stays organized.',
    description:
      'The Core Data roadmap focuses on expanding the types of information uniThread can manage and improving how organizations organize, retain, and analyze their CRM data.',
    features: [
      {
        id: 'company-records',
        name: 'Company Records',
        summary:
          'Dedicated company records that contacts and customers can be associated with, instead of storing company information only as fields on individual contacts.',
        rationale:
          'B2B organizations usually deal with several contacts from the same company. Without a shared company record, that relationship has to be reconstructed manually every time.',
        capabilities: [
          'Create and manage companies',
          'Associate multiple contacts with one company',
          'Company-level activity history',
          'Company-associated deals and customers',
          'Search and filtering by company',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'address-fields',
        name: 'Address Fields',
        summary:
          'Structured address fields (street, city, province or state, postal code, country) instead of a single free-text field.',
        rationale:
          'Structured data is what makes reporting, filtering, integrations, and future location-based features possible. A single text field cannot be reliably queried or validated.',
        capabilities: [
          'Street, city, province/state, postal code, country',
          'Consistent formatting across records',
          'Foundation for future location-based reporting',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'archiving',
        name: 'Archiving',
        summary:
          'The ability to remove inactive records from active workflows without permanently deleting them.',
        rationale:
          'Not every closed lead or inactive contact should be deleted, but it also should not keep cluttering active views. Archiving separates "not active" from "gone".',
        capabilities: [
          'Leads',
          'Contacts',
          'Deals',
          'Customers',
          'Activities',
          'Other supported record types',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        summary: 'A centralized notification system for events that require a user\u2019s attention.',
        rationale:
          'Right now, staying on top of what changed means checking each area of the CRM individually. A single notification surface reduces the chance that something important gets missed.',
        capabilities: [
          'Assignments',
          'Task deadlines',
          'Deal changes',
          'Invitations',
          'Mentions',
          'Activity updates',
          'System events',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'timezone-support',
        name: 'Time Zone Support',
        summary:
          'Organization-level and user-level time zone handling so timestamps and deadlines are shown correctly for the person viewing them.',
        rationale:
          'Teams are not always in one location. Without time zone awareness, deadlines and timestamps can be misread, which matters for anything scheduling-related.',
        capabilities: [
          'Organization default time zone',
          'Per-user time zone preference',
          'Correct timestamps across the app',
          'Correct deadlines',
          'Time-zone-aware scheduling',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'multi-currency',
        name: 'Multi-Currency Support',
        summary: 'Support for organizations that manage deals and customers across more than one currency.',
        rationale:
          'Organizations operating internationally cannot represent their pipeline accurately in a single currency. Deal values and totals need to reflect the currency they were actually agreed in.',
        capabilities: [
          'Organization default currency',
          'Per-deal currency',
          'Currency-aware totals',
          'Currency formatting',
          'Multi-currency reporting',
        ],
        status: 'future',
        phase: 'foundation',
      },
      {
        id: 'international-phone',
        name: 'International Phone Numbers',
        summary: 'Proper support for phone numbers from any country, not just a single regional format.',
        rationale:
          'A CRM used by teams outside one country needs to store and validate phone numbers correctly, and needs a consistent format to work reliably with future SMS or calling providers.',
        capabilities: [
          'Country selection',
          'Dialing codes',
          'Standardized formatting',
          'Validation',
          'Compatibility with future SMS/calling providers',
        ],
        status: 'future',
        phase: 'foundation',
      },
      {
        id: 'leaderboard',
        name: 'Leaderboard',
        summary: 'A team performance view that ranks members across a set of CRM metrics.',
        rationale:
          'Sales and support teams often want visibility into how the team is performing, not just individual dashboards. A shared view can help surface that.',
        capabilities: [
          'Deals won',
          'Deal value',
          'Leads converted',
          'Customers acquired',
          'Tasks completed',
          'Activity volume',
        ],
        status: 'future',
        phase: 'foundation',
        note: 'The scoring model is expected to change over time so it rewards real outcomes rather than raw activity volume.',
      },
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        summary: 'Analytics that go beyond the current dashboard totals into pipeline and team-level trends.',
        rationale:
          'Basic totals answer "what happened." Deeper analytics start answering "why," which is what teams need to actually adjust their approach.',
        capabilities: [
          'Conversion rates',
          'Sales velocity',
          'Average deal size',
          'Win/loss ratio',
          'Pipeline performance',
          'Customer acquisition trends',
          'Team performance',
          'Historical comparisons',
        ],
        status: 'future',
        phase: 'foundation',
      },
      {
        id: 'bulk-migration',
        name: 'Bulk Data Migration',
        summary: 'Tools to import existing CRM data from other systems or spreadsheets.',
        rationale:
          'Switching CRMs is a real cost if historical data cannot come with you. Reliable import tooling lowers the barrier to actually adopting uniThread.',
        capabilities: [
          'Import from CSV',
          'Import from spreadsheet exports',
          'Import from existing CRM systems',
          'Import from other structured datasets',
          'Validation and import error reporting',
        ],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'calendar-view',
        name: 'Calendar View',
        summary: 'A calendar-based view of tasks, deadlines, activities, follow-ups, and scheduled events.',
        rationale:
          'Lists are good for detail but not for seeing what a day or week actually looks like. A calendar view gives that at-a-glance picture.',
        capabilities: ['Daily view', 'Weekly view', 'Monthly view'],
        status: 'planned',
        phase: 'foundation',
      },
      {
        id: 'avatar-uploads',
        name: 'Avatar Uploads',
        summary: 'Direct media uploads for user avatars, organization logos, contact images, and other profile imagery.',
        rationale:
          'A CRM full of initials and placeholder icons is harder to scan quickly than one with real faces and logos attached to records.',
        capabilities: [
          'User avatars',
          'Organization logos',
          'Contact images',
          'Other supported profile imagery',
        ],
        status: 'in-development',
        phase: 'foundation',
      },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: ExperienceIcon,
    shortDescription: 'Making day-to-day collaboration feel faster and more natural.',
    description:
      'The Experience roadmap focuses on making uniThread feel faster, more interactive, and more natural for teams using it every day.',
    features: [
      {
        id: 'mute-conversations',
        name: 'Mute Conversations',
        summary: 'The ability to mute a conversation without leaving it.',
        rationale:
          'Not every conversation needs an active notification. Muting keeps reference-only or low-priority threads accessible without adding noise.',
        capabilities: [
          'Completed discussions',
          'Large group conversations',
          'Low-priority conversations',
          'Reference-only conversations',
        ],
        status: 'planned',
        phase: 'experience',
      },
      {
        id: 'typing-indicators',
        name: 'Typing Indicators',
        summary: 'A simple indicator that shows when a teammate is currently typing, for example "Jest is typing...".',
        rationale:
          'It is a small detail, but it makes internal messaging feel like an active conversation rather than a queue of one-way messages.',
        capabilities: ['Realtime typing indicator in chat threads'],
        status: 'planned',
        phase: 'experience',
      },
      {
        id: 'online-presence',
        name: 'Online Presence',
        summary: 'Visibility into whether a teammate is currently online, away, offline, or recently active.',
        rationale:
          'Knowing whether someone is likely to respond right now changes whether you message them or move on to something else.',
        capabilities: ['Online', 'Away', 'Offline', 'Recently active'],
        status: 'planned',
        phase: 'experience',
      },
      {
        id: 'email-templates',
        name: 'Email Templates',
        summary: 'Reusable, editable templates for common outbound emails.',
        rationale:
          'Teams send the same handful of email types repeatedly. Templates remove the repetitive part while still letting the sender adjust the message before it goes out.',
        capabilities: [
          'Follow-ups',
          'Welcome emails',
          'Meeting confirmations',
          'Sales outreach',
          'Customer updates',
          'Thank-you messages',
          'Editable before sending',
        ],
        status: 'planned',
        phase: 'experience',
      },
      {
        id: 'unread-counts',
        name: 'Unread Counts',
        summary: 'Unread indicators across chat messages, conversations, notifications, and activity updates.',
        rationale:
          'Without unread counts, staying current means re-reading things you already saw, or missing things you have not. This closes that gap.',
        capabilities: [
          'Chat messages',
          'Conversations',
          'Notifications',
          'Activity updates',
        ],
        status: 'planned',
        phase: 'experience',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: AiIcon,
    shortDescription: 'Using CRM data to help teams understand customers and move faster.',
    description:
      'The AI roadmap focuses on using CRM data to help users understand customers, make better decisions, and reduce repetitive work. Every AI feature is expected to respect organization boundaries, user permissions, privacy, and tenant isolation. An AI feature is never allowed to surface data a user could not already see.',
    features: [
      {
        id: 'contact-insights',
        name: 'Contact Insights',
        summary: 'AI-generated summaries and observations about a contact, drawn from existing CRM activity.',
        rationale:
          'A contact\u2019s history can be spread across notes, emails, calls, and activity logs. A summary saves the work of piecing that together manually before a call.',
        capabilities: [
          'Recent communication',
          'Important interaction patterns',
          'Customer interests',
          'Follow-up recommendations',
          'Relationship history',
        ],
        status: 'future',
        phase: 'intelligence',
      },
      {
        id: 'deal-summaries',
        name: 'Deal Summaries',
        summary: 'A concise, generated summary of where an active deal stands.',
        rationale:
          'Picking up a deal you were not closely tracking usually means reading through the whole activity log. A summary gets a user oriented in seconds instead.',
        capabilities: [
          'Current stage',
          'Deal value',
          'Recent activity',
          'Important notes',
          'Previous interactions',
          'Potential blockers',
          'Recommended next action',
        ],
        status: 'future',
        phase: 'intelligence',
      },
      {
        id: 'predictive-scoring',
        name: 'Predictive Scoring',
        summary: 'Estimated probabilities and risk signals based on historical CRM data.',
        rationale:
          'Prioritization is currently manual and based on gut feel. Scoring based on historical outcomes can help teams focus effort where it is more likely to pay off.',
        capabilities: [
          'Lead conversion probability',
          'Deal win probability',
          'Customer risk signals',
          'Sales prioritization',
        ],
        status: 'future',
        phase: 'intelligence',
        note: 'Scoring that is actually meaningful requires enough historical data to train against, so this depends on organizations accumulating usage over time.',
      },
      {
        id: 'ai-chat-assistant',
        name: 'AI Chat Assistant',
        summary: 'A natural-language assistant for asking questions about your own CRM data.',
        rationale:
          'Finding an answer today often means building a filter or a report by hand. Being able to just ask the question directly is faster for the questions people actually have.',
        capabilities: [
          'Example: "Which deals are currently in negotiation?"',
          'Example: "Summarize this customer\u2019s recent activity."',
          'Example: "Which leads haven\u2019t been contacted recently?"',
        ],
        status: 'future',
        phase: 'intelligence',
        note: 'The assistant only ever accesses information the requesting user is already authorized to see.',
      },
      {
        id: 'reply-templates-ai',
        name: 'Reply Templates',
        summary: 'AI-assisted drafts for outbound messages, generated from CRM context.',
        rationale:
          'A first draft grounded in the actual deal or contact history is usually faster to edit than writing a message from a blank box.',
        capabilities: ['Professional', 'Short', 'Follow-up', 'Customer response', 'Sales response'],
        status: 'future',
        phase: 'intelligence',
        note: 'The user always reviews and controls the final message before it is sent.',
      },
      {
        id: 'rag-answers',
        name: 'Retrieval-Augmented Answers',
        summary:
          'A way for the AI to retrieve relevant, organization-specific CRM information before generating an answer, rather than relying only on general knowledge.',
        rationale:
          'A generic language model has no idea what is actually in your CRM. Retrieval grounds its answers in your organization\u2019s real records instead of a plausible-sounding guess.',
        capabilities: [
          'Example: "Which customers haven\u2019t been contacted in the last 30 days?"',
          'Answers grounded in actual CRM data',
          'Respects tenant isolation and permissions',
        ],
        status: 'future',
        phase: 'intelligence',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: PerformanceIcon,
    shortDescription: 'Staying fast as organizations accumulate more data.',
    description:
      'The Performance roadmap focuses on making uniThread faster and more scalable as organizations accumulate larger amounts of CRM data.',
    features: [
      {
        id: 'realtime-websocket',
        name: 'Realtime Updates Over WebSocket',
        summary: 'Expanding realtime behavior across more of the application.',
        rationale:
          'Changes made by a teammate, a new message, an updated deal, a new task, should show up without a manual refresh.',
        capabilities: ['Messages', 'Deals', 'Leads', 'Tasks', 'Members', 'Notifications'],
        status: 'planned',
        phase: 'scale',
      },
      {
        id: 'response-caching',
        name: 'Response Caching',
        summary: 'Caching for frequently requested, slower-changing data.',
        rationale:
          'Some data does not need to be fetched fresh on every request. Caching it reduces load and speeds up common interactions, as long as freshness and tenant isolation are preserved.',
        capabilities: [
          'Organization configuration',
          'Subscription information',
          'Static metadata',
          'Frequently requested dashboard data',
        ],
        status: 'planned',
        phase: 'scale',
        note: 'Caching must preserve data freshness and strict tenant isolation.',
      },
      {
        id: 'paginated-tables',
        name: 'Paginated Data Tables',
        summary: 'Loading large datasets in smaller portions instead of all at once.',
        rationale:
          'As organizations accumulate more leads, contacts, and deals, loading everything at once becomes slow and memory-heavy for no real benefit.',
        capabilities: [
          'Faster initial loading',
          'Lower memory usage',
          'Better database performance',
          'Smoother interaction with large lists',
        ],
        status: 'in-development',
        phase: 'scale',
      },
      {
        id: 'search-optimization',
        name: 'Search Optimization',
        summary: 'Improving how fast and how relevant search results are across the CRM.',
        rationale:
          'Search is one of the most frequent actions in a CRM. It needs to be both fast and actually return what the user was looking for.',
        capabilities: [
          'Database indexes',
          'Better query strategies',
          'Full-text search',
          'Search ranking',
          'Faster filtering',
        ],
        status: 'planned',
        phase: 'scale',
      },
    ],
  },
  {
    id: 'polish',
    label: 'Polish',
    icon: PolishIcon,
    shortDescription: 'The small details that make the product feel complete.',
    description:
      'The Polish roadmap focuses on the small details that make uniThread feel complete, professional, and enjoyable to use.',
    features: [
      {
        id: 'loading-states',
        name: 'Loading States',
        summary: 'Consistent loading indicators, skeleton screens, and button and form loading states throughout the app.',
        rationale:
          'A user should always be able to tell whether something is happening, still loading, or finished. Silence in the interface reads as a bug.',
        capabilities: [
          'Loading indicators',
          'Skeleton screens',
          'Button loading states',
          'Table loading states',
          'Form submission states',
        ],
        status: 'in-development',
        phase: 'experience',
      },
      {
        id: 'micro-animations',
        name: 'Micro Animations',
        summary: 'Subtle motion for cards, buttons, modals, list updates, and navigation.',
        rationale:
          'Small transitions help a user track what changed on screen. Used sparingly, they make the interface feel considered rather than abrupt.',
        capabilities: ['Card transitions', 'Buttons', 'Modals', 'List updates', 'Navigation'],
        status: 'planned',
        phase: 'experience',
        note: 'Motion is kept deliberately restrained and respects prefers-reduced-motion.',
      },
      {
        id: 'sample-data',
        name: 'Sample Data',
        summary:
          'Automatically adding realistic fictional CRM records when a new organization is created.',
        rationale:
          'A new workspace should not feel empty. Sample records help users immediately understand how the CRM works before adding their own data.',
        capabilities: [
          'Sample leads, contacts, deals, and customers',
          'Example activities, tasks, and notes',
          'Pre-populated dashboard data',
          'Demonstrates the complete CRM lifecycle',
        ],
        status: 'planned',
        phase: 'experience',
      },
      {
        id: 'guided-tutorials',
        name: 'Guided Tutorials',
        summary: 'Optional onboarding guidance that walks through the core CRM workflow.',
        rationale:
          'The connection between a lead, a contact, a deal, and a customer is the whole point of the product. A guided walkthrough makes that connection obvious from day one.',
        capabilities: ['Teaches the Lead \u2192 Contact \u2192 Deal \u2192 Customer workflow'],
        status: 'planned',
        phase: 'experience',
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: AdminIcon,
    shortDescription: 'Managing the uniThread platform itself.',
    description:
      'The Administration roadmap focuses on managing the uniThread platform itself, rather than managing an individual organization\u2019s CRM.',
    features: [
      {
        id: 'super-admin-console',
        name: 'Super Admin Console',
        summary: 'A separate, platform-level administration environment.',
        rationale:
          'Running uniThread as a multi-tenant platform requires visibility and controls that sit above any single organization, distinct from what an Owner, Manager, or Agent can see inside their own workspace.',
        capabilities: [
          'View organizations',
          'Manage platform users',
          'Monitor system health',
          'Review subscriptions',
          'Manage platform configuration',
          'Monitor usage',
          'Investigate system issues',
          'Review platform analytics',
          'Manage reported problems',
        ],
        status: 'future',
        phase: 'scale',
        note: 'This is a platform-level environment, separate from organization-level Owner, Manager, and Agent permissions.',
      },
    ],
  },
];

const statusLabels: Record<FeatureStatus, string> = {
  planned: 'Planned',
  'in-development': 'In Development',
  beta: 'Beta',
  released: 'Released',
  future: 'Future',
};

const statusDescriptions: { status: FeatureStatus; description: string }[] = [
  { status: 'planned', description: 'Part of the roadmap, but development has not started.' },
  { status: 'in-development', description: 'Implementation has actively started.' },
  { status: 'beta', description: 'Available for testing, but may still change.' },
  { status: 'released', description: 'Has reached a stable release.' },
  {
    status: 'future',
    description: 'A longer-term direction without a committed release timeline.',
  },
];

const lifecycleStages = ['Lead', 'Contact', 'Deal', 'Customer'];

const flexibilityReasons = [
  'Change in scope',
  'Change in priority',
  'Be redesigned',
  'Be delayed',
  'Be released incrementally',
  'Depend on infrastructure or third-party integrations',
  'Change based on user feedback',
];

const influenceFactors = [
  'User feedback',
  'Bugs',
  'Product usage',
  'Technical constraints',
  'Security requirements',
  'Infrastructure maturity',
  'Business needs',
];

function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15 },
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return { ref, isVisible, prefersReducedMotion };
}



const statusIconMap: Record<FeatureStatus, SvgIconComponent> = {
  planned: ScheduleIcon,
  'in-development': BuildIcon,
  beta: ScienceIcon,
  released: CheckCircleIcon,
  future: ExploreIcon,
};


function StatusChip({ status, size = 'small' }: { status: FeatureStatus; size?: 'small' | 'medium' }) {
  const theme = useTheme();
  const Icon = statusIconMap[status];

  const colorByStatus: Record<FeatureStatus, string> = {
    planned: theme.palette.text.secondary,
    'in-development': theme.palette.info.main,
    beta: theme.palette.warning.main,
    released: theme.palette.success.main,
    future: theme.palette.text.disabled,
  };

  const color = colorByStatus[status];

  return (
    <Chip
      icon={<Icon style={{ color }} fontSize="small" />}
      label={statusLabels[status]}
      size={size}
      variant="outlined"
      sx={{
        borderColor: color,
        color,
        fontWeight: 600,
        '& .MuiChip-icon': { color },
      }}
    />
  );
}


function FeatureCard({ feature }: { feature: RoadmapFeature }) {
  return (
    <Card
      variant="outlined"
      component="article"
      aria-labelledby={`feature-${feature.id}-title`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: 'primary.main',
        },
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, p: 3 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography id={`feature-${feature.id}-title`} component="h4" variant="subtitle1" fontWeight={700}>
            {feature.name}
          </Typography>
          <StatusChip status={feature.status} />
        </Stack>

        <Typography variant="body2" color="text.primary">
          {feature.summary}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {feature.rationale}
        </Typography>

        {feature.capabilities.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Typography
              variant="caption"
              component="p"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600, mb: 1 }}
            >
              What it enables
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {feature.capabilities.map((capability) => (
                <Chip
                  key={capability}
                  component="li"
                  label={capability}
                  size="small"
                  sx={{ bgcolor: 'action.hover', fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {feature.note && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', pt: 0.5 }}>
            {feature.note}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function LifecycleThread() {
  const theme = useTheme();
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={{ xs: 1.5, sm: 0 }}
      role="list"
      aria-label="uniThread core customer lifecycle"
      sx={{ position: 'relative', width: '100%' }}
    >
      {lifecycleStages.map((stage, index) => (
        <Stack
          key={stage}
          direction="row"
          alignItems="center"
          role="listitem"
          sx={{
            flex: { sm: index === lifecycleStages.length - 1 ? '0 0 auto' : 1 },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FiberManualRecordIcon sx={{ fontSize: 10, color: theme.palette.primary.main }} aria-hidden />
            <Typography variant="subtitle2" fontWeight={700} color="text.primary">
              {stage}
            </Typography>
          </Stack>
          {index < lifecycleStages.length - 1 && (
            <Box
              aria-hidden
              sx={{
                display: { xs: 'none', sm: 'block' },
                flexGrow: 1,
                height: '1.5px',
                mx: 1.5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                opacity: 0.5,
              }}
            />
          )}
        </Stack>
      ))}
    </Stack>
  );
}

function RoadmapHero() {
  return (
    <Box
      component="section"
      aria-labelledby="roadmap-hero-heading"
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 8 },
        background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.main}0d 0%, transparent 60%)`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Chip
            label="Roadmap"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start', fontWeight: 700, letterSpacing: 0.4 }}
          />
          <Typography
            id="roadmap-hero-heading"
            component="h1"
            variant="h2"
            fontWeight={800}
            sx={{ fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' }, lineHeight: 1.1 }}
          >
            Building the future of uniThread CRM
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" fontWeight={400} sx={{ lineHeight: 1.6 }}>
            uniThread is actively evolving. Our roadmap focuses on expanding the CRM foundation,
            improving everyday collaboration, introducing intelligent AI capabilities, increasing
            performance, and making the entire experience more polished.
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box aria-hidden sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Current version: Beta
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8, display: 'block', mb: 1.5 }}>
            The connected lifecycle this roadmap builds on
          </Typography>
          <LifecycleThread />
        </Box>
      </Container>
    </Box>
  );
}


function PhilosophySection() {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="philosophy-heading" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <Typography id="philosophy-heading" component="h2" variant="h4" fontWeight={800} gutterBottom>
            Roadmap philosophy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 5 }}>
            This roadmap is intentionally flexible. It describes direction, not a fixed contract.
            Any feature on this page may:
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{xs: 12, md: 5}}>
              <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0 }} aria-label="Ways a roadmap item may change">
                {flexibilityReasons.map((reason) => (
                  <Stack key={reason} component="li" direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      aria-hidden
                      sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', mt: 1, flexShrink: 0 }}
                    />
                    <Typography variant="body2" color="text.primary">
                      {reason}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{xs: 12, md: 5}}>
              <Box sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, bgcolor: 'action.hover', height: '100%' }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
                  Development philosophy
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 0 }}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  sx={{ mt: 1.5, mb: 3 }}
                >
                  {roadmapPhases.map((phase, index) => (
                    <Stack key={phase.id} direction="row" alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        {phase.label}
                      </Typography>
                      {index < roadmapPhases.length - 1 && (
                        <Box aria-hidden sx={{ mx: { xs: 1, sm: 1.5 }, color: 'text.disabled', fontWeight: 700 }}>
                          {'\u2192'}
                        </Box>
                      )}
                    </Stack>
                  ))}
                </Stack>
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7 }}>
                  The long-term goal is for uniThread to evolve from a straightforward CRM into a
                  connected platform where organizations can manage relationships, collaborate
                  with their teams, understand their data, and eventually use AI to work more
                  efficiently.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}


function RoadmapOverview({ onNavigate }: { onNavigate: (id: CategoryId) => void }) {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="overview-heading" sx={{ py: { xs: 6, md: 9 }, bgcolor: 'action.hover' }}>
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <Typography id="overview-heading" component="h2" variant="h4" fontWeight={800} gutterBottom>
            Roadmap overview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mb: 5 }}>
            Six areas make up the roadmap. Select one to jump to its detail below.
          </Typography>

          <Grid container spacing={2.5}>
            {roadmapCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Grid size={{xs: 12, sm: 6, md: 4}}  key={category.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: (theme) => theme.shadows[3] },
                    }}
                  >
                    <CardActionArea
                      onClick={() => onNavigate(category.id)}
                      sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
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
                        <Typography variant="subtitle1" fontWeight={700} component="h3">
                          {category.label}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'left' }}>
                        {category.shortDescription}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 'auto' }}>
                        {category.features.length} planned {category.features.length === 1 ? 'feature' : 'features'}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function CategoryNav({ activeId, onNavigate }: { activeId: CategoryId; onNavigate: (id: CategoryId) => void }) {
  return (
    <Box
      component="nav"
      aria-label="Roadmap categories"
      sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
    >
      <Stack sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 1, md: 3 } }}>
        <Tabs
          value={activeId}
          onChange={(_event, value: CategoryId) => onNavigate(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Jump to roadmap category"
        >
          {roadmapCategories.map((category) => (
            <Tab key={category.id} value={category.id} label={category.label} sx={{ fontWeight: 600, textTransform: 'none' }} />
          ))}
        </Tabs>
      </Stack>
    </Box>
  );
}


const CategorySection = forwardRef<HTMLElement, { category: RoadmapCategory; index: number }>(
  ({ category, index }, forwardedRef) => {
    const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();
    const Icon = category.icon;

    return (
      <Box
        component="section"
        id={category.id}
        ref={forwardedRef}
        aria-labelledby={`${category.id}-heading`}
        sx={{
          py: { xs: 6, md: 9 },
          bgcolor: index % 2 === 1 ? 'action.hover' : 'transparent',
          scrollMarginTop: { xs: 56, md: 64 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            ref={ref}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box
                aria-hidden
                sx={{
                  width: 48,
                  height: 48,
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
              <Typography id={`${category.id}-heading`} component="h2" variant="h4" fontWeight={800}>
                {category.label}
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mb: 5 }}>
              {category.description}
            </Typography>

            <Grid container spacing={3}>
              {category.features.map((feature) => (
                <Grid size={{xs: 12, sm: 6, lg: 4}} key={feature.id}>
                  <FeatureCard feature={feature} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    );
  },
);
CategorySection.displayName = 'CategorySection';


function StatusLegend() {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="status-legend-heading" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <Typography id="status-legend-heading" component="h2" variant="h4" fontWeight={800} gutterBottom>
            How to read feature status
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mb: 4 }}>
            Every feature above is tagged with one of the statuses below. None of them imply a
            fixed delivery date.
          </Typography>

          <Grid container spacing={2.5}>
            {statusDescriptions.map(({ status, description }) => (
              <Grid size={{xs: 12, sm: 6, md: 4}} key={status}>
                <Stack spacing={1.25} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: 'divider', height: '100%' }}>
                  <StatusChip status={status} />
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}


function TimelineSection() {
  const theme = useTheme();
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="timeline-heading" sx={{ py: { xs: 6, md: 9 }, bgcolor: 'action.hover' }}>
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <Typography id="timeline-heading" component="h2" variant="h4" fontWeight={800} gutterBottom>
            Development phases
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, mb: 5 }}>
            Rather than assigning dates, the roadmap is organized into four directional phases.
            These describe an emphasis, not a strict release schedule, and phases can and do
            overlap in practice.
          </Typography>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 0 }} role="list" aria-label="Roadmap development phases, in order">
            {roadmapPhases.map((phase, index) => (
              <Stack key={phase.id} role="listitem" sx={{ flex: 1, position: 'relative', pr: { md: index < roadmapPhases.length - 1 ? 3 : 0 } }}>
                {index < roadmapPhases.length - 1 && (
                  <Box
                    aria-hidden
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: 8,
                      right: 0,
                      width: 24,
                      height: '1.5px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      opacity: 0.5,
                    }}
                  />
                )}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Typography
                    aria-hidden
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.contrastText',
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography variant="subtitle1" component="h3" fontWeight={700}>
                    {phase.label}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {phase.description}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function FeedbackSection({ onNavigateToFeedback }: { onNavigateToFeedback: () => void }) {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="feedback-heading" sx={{ py: { xs: 6, md: 9 } }}>
      <Container maxWidth="lg">
        <Box
          ref={ref}
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{xs: 12, md: 7}}>
              <Typography id="feedback-heading" component="h2" variant="h4" fontWeight={800} gutterBottom>
                Your feedback helps shape what comes next
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Feature priorities on this page are not fixed. They shift based on:
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {influenceFactors.map((factor) => (
                  <Box
                    key={factor}
                    component="li"
                    sx={{ px: 1.5, py: 0.5, borderRadius: 5, bgcolor: 'action.hover', fontSize: '0.8125rem', fontWeight: 500 }}
                  >
                    {factor}
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{xs: 12, md: 5}} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} onClick={onNavigateToFeedback}>
                Share feedback
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function FinalCta({ onCreateAccount, onShareFeedback }: { onCreateAccount: () => void; onShareFeedback: () => void }) {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>();

  return (
    <Box component="section" aria-labelledby="final-cta-heading" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
      <Container maxWidth="md">
        <Stack
          ref={ref}
          spacing={3}
          alignItems="center"
          textAlign="center"
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible || prefersReducedMotion ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <Typography id="final-cta-heading" component="h2" variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Want to see uniThread evolve?
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 560, opacity: 0.9 }}>
            uniThread is still growing. The Beta release provides the foundation, while the
            roadmap represents where the platform can go next.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              size="large"
              onClick={onCreateAccount}
              sx={{ bgcolor: 'background.paper', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Create free account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onShareFeedback}
              sx={{
                borderColor: 'primary.contrastText',
                color: 'primary.contrastText',
                '&:hover': { borderColor: 'primary.contrastText', bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              Share feedback
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>(roadmapCategories[0].id);
  const sectionRefs = useRef<Record<CategoryId, HTMLElement | null>>({} as Record<CategoryId, HTMLElement | null>);

  const scrollToCategory = useCallback((id: CategoryId) => {
    const node = sectionRefs.current[id];
    if (node) {
      node.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    setActiveCategoryId(id);
  }, []);

  useEffect(() => {
    const sections = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveCategoryId(visible.target.id as CategoryId);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <Box component="main">
      <RoadmapHero />
      <PhilosophySection />
      <RoadmapOverview onNavigate={scrollToCategory} />

      <CategoryNav activeId={activeCategoryId} onNavigate={scrollToCategory} />

      {roadmapCategories.map((category, index) => (
        <CategorySection
          key={category.id}
          category={category}
          index={index}
          ref={(node) => {
            sectionRefs.current[category.id] = node;
          }}
        />
      ))}

      <StatusLegend />
      <TimelineSection />
      <FeedbackSection onNavigateToFeedback={() => navigate('/feedback')} />
      <FinalCta onCreateAccount={() => navigate('/signup')} onShareFeedback={() => navigate('/feedback')} />
    </Box>
  );
}