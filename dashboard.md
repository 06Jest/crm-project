You are an expert Senior Product Designer and Senior React + Material UI Engineer with extensive experience designing enterprise SaaS applications.

I will provide my existing React components, Redux state, TypeScript types, APIs, and current dashboard implementation.

Your job is NOT to rewrite my architecture or business logic.

Your job is to redesign the UI into an enterprise-grade CRM dashboard while preserving functionality.

Goals

Create a dashboard that feels like it belongs in a modern B2B SaaS product used by thousands of companies.

Think:

Stripe Dashboard
HubSpot CRM
Salesforce Lightning
Linear
Vercel Dashboard
GitHub Enterprise
Atlassian
Notion (professional areas)

NOT:

Dribbble concepts
Glassmorphism
Colorful startup landing pages
Gaming UI
Crypto dashboards
Fancy animations
Design Language

Use a minimal enterprise design.

Requirements:

clean
premium
spacious
highly readable
consistent spacing
subtle elevation
subtle borders
excellent hierarchy

Avoid visual clutter.

Everything should look intentional.

Colors

I dislike colorful dashboards.

Use mostly

white
neutral gray
black
subtle blue only where necessary

Avoid

gradients
neon colors
rainbow charts
glowing cards
unnecessary shadows

Cards should look elegant rather than flashy.

Use muted colors.

Success, warning, danger, and info colors should only appear where semantically appropriate.

Layout

Build a dashboard suitable for executives and sales teams.

Layout example:

Top

Greeting
Current date
Organization summary
Global actions

Below

KPI cards

Total Leads
Contacts
Deals
Customers
Revenue
Open Tasks
Calls
Emails

Next section

Charts

Revenue Trend
Lead Growth
Deal Pipeline
Customer Growth

Next section

Activity

Recent activities
Recent tasks
Recent deals

Next section

Performance

Team leaderboard
Top performers
Conversion metrics

Everything should align perfectly.

Use an intelligent responsive grid.

Cards

Cards should feel premium.

Requirements:

rounded corners
thin border
subtle hover
minimal shadow
strong typography
proper spacing

Do NOT overdecorate cards.

Metrics should be instantly readable.

Typography

Use typography hierarchy similar to enterprise SaaS.

Headings

Bold

Metrics

Large

Descriptions

Muted gray

Secondary information

Small

Avoid oversized fonts.

Charts

Charts should be professional.

Avoid

bright colors
thick borders
excessive labels
unnecessary legends

Prefer

smooth lines
muted palettes
clean axes
readable tooltips

Charts should communicate data efficiently.

Tables

Tables should look enterprise-grade.

Include

sticky headers
hover states
row spacing
status chips
avatars where appropriate
sorting-ready layout

No excessive borders.

Icons

Use Material UI icons consistently.

Icons should support content rather than decorate it.

Keep icon sizes subtle.

Spacing

Maintain a consistent spacing system.

Every section should breathe.

Avoid cramped layouts.

Maintain consistent padding across every card.

Responsiveness

Dashboard must work perfectly on

Desktop

Laptop

Tablet

Mobile

Widgets should rearrange naturally.

No overflow.

No broken layouts.

Performance

Avoid unnecessary renders.

Do not introduce heavy dependencies.

Use existing components whenever possible.

Keep code clean.

Keep components reusable.

Avoid duplicated UI.

Accessibility

Maintain proper contrast.

Keyboard navigation should work.

Use semantic HTML.

Use accessible labels where appropriate.

Code Quality

Do not change my architecture.

Do not change Redux.

Do not change APIs.

Do not rename my types.

Do not break my existing code.

Reuse my existing data.

Refactor only when it improves readability.

Material UI

Use Material UI components correctly.

Prefer

Card
Paper
Stack
Grid
Typography
Divider
Chip
Avatar
IconButton
Tooltip
Skeleton
LinearProgress

Use the theme properly.

Avoid inline magic numbers whenever possible.

Final Goal

When someone opens this dashboard, they should think:

"This looks like a professional enterprise CRM used by real companies."

The UI should feel trustworthy, mature, polished, and production-ready rather than experimental or visually flashy.

Prioritize clarity, usability, maintainability, consistency, and information hierarchy above visual effects.





FRONTEND:

export interface DashboardState {
  overview: DashboardOverview | null;
  leadMetrics: LeadMetrics | null;
  dealMetrics: DealMetrics | null;
  customerMetrics: CustomerMetrics | null;
  activityMetrics: ActivityMetrics | null;
  trends: DashboardTrends | null;
  recentActivities: ActivityItem[];
  userPerformance: UserPerformanceMetrics | null;

  loading: {
    overview: boolean;
    leads: boolean;
    deals: boolean;
    customers: boolean;
    activity: boolean;
    trends: boolean;
    recentActivities: boolean;
    performance: boolean;
  };
  loaded: boolean;
  error: string | null;
}

export interface DashboardParams {
  orgId: string;
  accessToken: string;
}

export type TrendInterval =
  | 'day'
  | 'week'
  | 'month';

export interface TrendParams extends DashboardParams {
  interval?: TrendInterval;
  daysBack?: number;
}

export interface RecentActivityParams
  extends DashboardParams {
  limit?: number;
}

export interface DashboardOverview {
  totalContacts: number;
  totalLeads: number;
  totalDeals: number;
  totalCustomers: number;
  totalEmails: number;
  totalSms: number;
  totalCalls: number;
  totalTasks: number;
}

export interface LeadMetrics {
  totalLeads: number;
  leadsBySource: Record<string, number>;
  leadsByPriority: Record<string, number>;
  leadsByStatus: Record<string, number>;
  conversionRate: number;
}

export interface DealMetrics {
  totalDeals: number;
  dealsByStage: Record<string, number>;
  wonDeals: number;
  lostDeals: number;
  openDeals: number;
  totalRevenue: number;
  averageDealSize: number;
  winRate: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  customersByStatus: Record<string, number>;
  activeCustomers: number;
  churnedCustomers: number;
  customerGrowth: Record<string, number>;
}

export interface ActivityMetrics {
  emailsSent: number;
  smsSent: number;
  callsCompleted: number;
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
}

export interface DashboardTrends {
  interval: TrendInterval;
  startDate: string;
  leadsCreated: Record<string, number>;
  dealsCreated: Record<string, number>;
  revenueOverTime: Record<string, number>;
  customerGrowth: Record<string, number>;
}

export type ActivityType =
  | 'lead'
  | 'deal'
  | 'customer'
  | 'email'
  | 'sms'
  | 'call'
  | 'task';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface UserPerformanceMetrics {
  leadsPerUser: Record<string, number>;
  dealsClosedPerUser: Record<string, number>;
  tasksCompletedPerUser: Record<string, number>;
  callsCompletedPerUser: Record<string, number>;
}

import { apiClient } from "./apiClient";

import type {
  DashboardOverview,
  LeadMetrics,
  DealMetrics,
  CustomerMetrics,
  ActivityMetrics,
  DashboardTrends,
  ActivityItem,
  UserPerformanceMetrics,
  TrendInterval,
} from "../types/dashboard";

export const fetchDashboardOverviewAPI =
  async (): Promise<DashboardOverview> => {

    const result = await apiClient(
      "/api/dashboard/overview",
      {
        method: "GET",
      }
    );

    return result.data as DashboardOverview;

  };

export const fetchLeadMetricsAPI =
  async (): Promise<LeadMetrics> => {

    const result = await apiClient(
      "/api/dashboard/lead-metrics",
      {
        method: "GET",
      }
    );

    return result.data as LeadMetrics;

  };

export const fetchDealMetricsAPI =
  async (): Promise<DealMetrics> => {

    const result = await apiClient(
      "/api/dashboard/deal-metrics",
      {
        method: "GET",
      }
    );

    return result.data as DealMetrics;

  };

export const fetchCustomerMetricsAPI =
  async (): Promise<CustomerMetrics> => {

    const result = await apiClient(
      "/api/dashboard/customer-metrics",
      {
        method: "GET",
      }
    );

    return result.data as CustomerMetrics;

  };

export const fetchActivityMetricsAPI =
  async (): Promise<ActivityMetrics> => {

    const result = await apiClient(
      "/api/dashboard/activity-metrics",
      {
        method: "GET",
      }
    );

    return result.data as ActivityMetrics;

  };

export const fetchDashboardTrendsAPI =
  async (
    interval: TrendInterval = "day",
    daysBack = 30
  ): Promise<DashboardTrends> => {

    const result = await apiClient(
      `/api/dashboard/trends?interval=${interval}&daysBack=${daysBack}`,
      {
        method: "GET",
      }
    );

    return result.data as DashboardTrends;

  };

export const fetchRecentDashboardActivitiesAPI =
  async (
    limit = 10
  ): Promise<ActivityItem[]> => {

    const result = await apiClient(
      `/api/dashboard/recent-activities?limit=${limit}`,
      {
        method: "GET",
      }
    );

    return result.data as ActivityItem[];

  };

export const fetchUserPerformanceMetricsAPI =
  async (): Promise<UserPerformanceMetrics> => {

    const result = await apiClient(
      "/api/dashboard/user-performance",
      {
        method: "GET",
      }
    );

    return result.data as UserPerformanceMetrics;

  };

  slice:

  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type {
  DashboardState,
  TrendInterval,
} from "../types/dashboard";

import {
  fetchDashboardOverviewAPI,
  fetchLeadMetricsAPI,
  fetchDealMetricsAPI,
  fetchCustomerMetricsAPI,
  fetchActivityMetricsAPI,
  fetchDashboardTrendsAPI,
  fetchRecentDashboardActivitiesAPI,
  fetchUserPerformanceMetricsAPI,
} from "../services//dashboardService";

const initialState: DashboardState = {
  overview: null,
  leadMetrics: null,
  dealMetrics: null,
  customerMetrics: null,
  activityMetrics: null,
  trends: null,
  recentActivities: [],
  userPerformance: null,

  loading: {
    overview: false,
    leads: false,
    deals: false,
    customers: false,
    activity: false,
    trends: false,
    recentActivities: false,
    performance: false,
  },
  loaded: false,
  error: null,
};

export const fetchDashboardOverview = createAsyncThunk(
  "dashboard/fetch-overview",
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardOverviewAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch dashboard overview"
      );
    }
  }
);

export const fetchLeadMetrics = createAsyncThunk(
  "dashboard/fetch-lead-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchLeadMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch lead metrics"
      );
    }
  }
);

export const fetchDealMetrics = createAsyncThunk(
  "dashboard/fetch-deal-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchDealMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch deal metrics"
      );
    }
  }
);

export const fetchCustomerMetrics = createAsyncThunk(
  "dashboard/fetch-customer-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchCustomerMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch customer metrics"
      );
    }
  }
);

export const fetchActivityMetrics = createAsyncThunk(
  "dashboard/fetch-activity-metrics",
  async (_, thunkAPI) => {
    try {
      return await fetchActivityMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch activity metrics"
      );
    }
  }
);

export const fetchDashboardTrends = createAsyncThunk(
  "dashboard/fetch-trends",
  async (
    params: { interval?: TrendInterval; daysBack?: number } | undefined,
    thunkAPI
  ) => {
    try {
      return await fetchDashboardTrendsAPI(
        params?.interval,
        params?.daysBack
      );
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch dashboard trends"
      );
    }
  }
);

export const fetchRecentDashboardActivities = createAsyncThunk(
  "dashboard/fetch-recent-activities",
  async (limit: number | undefined, thunkAPI) => {
    try {
      return await fetchRecentDashboardActivitiesAPI(limit);
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch recent activities"
      );
    }
  }
);

export const fetchUserPerformanceMetrics = createAsyncThunk(
  "dashboard/fetch-user-performance",
  async (_, thunkAPI) => {
    try {
      return await fetchUserPerformanceMetricsAPI();
    } catch (err) {
      if (err instanceof Error) {
        return thunkAPI.rejectWithValue(err.message);
      }

      return thunkAPI.rejectWithValue(
        "Failed to fetch user performance metrics"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Overview
    builder.addCase(fetchDashboardOverview.pending, (state) => {
      state.loading.overview = true;
      state.error = null;
    });

    builder.addCase(fetchDashboardOverview.fulfilled, (state, action) => {
      state.loading.overview = false;
      state.loaded = true;
      state.overview = action.payload;
    });

    builder.addCase(fetchDashboardOverview.rejected, (state, action) => {
      state.loading.overview = false;
      state.error = action.payload as string;
    });

    // Lead metrics
    builder.addCase(fetchLeadMetrics.pending, (state) => {
      state.loading.leads = true;
      state.error = null;
    });

    builder.addCase(fetchLeadMetrics.fulfilled, (state, action) => {
      state.loading.leads = false;
      state.leadMetrics = action.payload;
    });

    builder.addCase(fetchLeadMetrics.rejected, (state, action) => {
      state.loading.leads = false;
      state.error = action.payload as string;
    });

    // Deal metrics
    builder.addCase(fetchDealMetrics.pending, (state) => {
      state.loading.deals = true;
      state.error = null;
    });

    builder.addCase(fetchDealMetrics.fulfilled, (state, action) => {
      state.loading.deals = false;
      state.dealMetrics = action.payload;
    });

    builder.addCase(fetchDealMetrics.rejected, (state, action) => {
      state.loading.deals = false;
      state.error = action.payload as string;
    });

    // Customer metrics
    builder.addCase(fetchCustomerMetrics.pending, (state) => {
      state.loading.customers = true;
      state.error = null;
    });

    builder.addCase(fetchCustomerMetrics.fulfilled, (state, action) => {
      state.loading.customers = false;
      state.customerMetrics = action.payload;
    });

    builder.addCase(fetchCustomerMetrics.rejected, (state, action) => {
      state.loading.customers = false;
      state.error = action.payload as string;
    });

    // Activity metrics
    builder.addCase(fetchActivityMetrics.pending, (state) => {
      state.loading.activity = true;
      state.error = null;
    });

    builder.addCase(fetchActivityMetrics.fulfilled, (state, action) => {
      state.loading.activity = false;
      state.activityMetrics = action.payload;
    });

    builder.addCase(fetchActivityMetrics.rejected, (state, action) => {
      state.loading.activity = false;
      state.error = action.payload as string;
    });

    // Trends
    builder.addCase(fetchDashboardTrends.pending, (state) => {
      state.loading.trends = true;
      state.error = null;
    });

    builder.addCase(fetchDashboardTrends.fulfilled, (state, action) => {
      state.loading.trends = false;
      state.trends = action.payload;
    });

    builder.addCase(fetchDashboardTrends.rejected, (state, action) => {
      state.loading.trends = false;
      state.error = action.payload as string;
    });

    // Recent activities
    builder.addCase(fetchRecentDashboardActivities.pending, (state) => {
      state.loading.recentActivities = true;
      state.error = null;
    });

    builder.addCase(
      fetchRecentDashboardActivities.fulfilled,
      (state, action) => {
        state.loading.recentActivities = false;
        state.recentActivities = action.payload;
      }
    );

    builder.addCase(
      fetchRecentDashboardActivities.rejected,
      (state, action) => {
        state.loading.recentActivities = false;
        state.error = action.payload as string;
      }
    );

    // User performance
    builder.addCase(fetchUserPerformanceMetrics.pending, (state) => {
      state.loading.performance = true;
      state.error = null;
    });

    builder.addCase(
      fetchUserPerformanceMetrics.fulfilled,
      (state, action) => {
        state.loading.performance = false;
        state.userPerformance = action.payload;
      }
    );

    builder.addCase(
      fetchUserPerformanceMetrics.rejected,
      (state, action) => {
        state.loading.performance = false;
        state.error = action.payload as string;
      }
    );
  },
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;

BACKEND: 
import { createSupabaseUserClient } from '../config/supabase';
import { table } from '../config/tables';
import { AppError } from '../middleware/error.middleware';

import type {
  DashboardOverview,
  LeadMetrics,
  DealMetrics,
  CustomerMetrics,
  ActivityMetrics,
  DashboardTrends,
  ActivityItem,
  UserPerformanceMetrics,
  TrendInterval
} from '../types/dashboard';

const contactsTab = table.contacts;
const leadsTab = table.leads;
const dealsTab = table.deals;
const customersTab = table.customers;
const emailsTab = table.emails;
const smsTab = table.sms;
const tasksTab = table.tasks;
const callsTab = table.calls;

export const getDashboardOverviewFromDB = async (
  orgId: string,
  accessToken: string
): Promise<DashboardOverview> => {

  const db = createSupabaseUserClient(accessToken);

  const [
    contacts,
    leads,
    deals,
    customers,
    emails,
    sms,
    calls,
    tasks
  ] = await Promise.all([

    db
      .from(contactsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(leadsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(dealsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(customersTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(emailsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(smsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(callsTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(tasksTab)
      .select('*', {
        count: 'exact',
        head: true
      })
      .eq('org_id', orgId)
      .is('deleted_at', null)

  ]);

  if (
    contacts.error ||
    leads.error ||
    deals.error ||
    customers.error ||
    emails.error ||
    sms.error ||
    calls.error ||
    tasks.error
  ) {
    throw new AppError(
      500,
      contacts.error?.message ||
      leads.error?.message ||
      deals.error?.message ||
      customers.error?.message ||
      emails.error?.message ||
      sms.error?.message ||
      calls.error?.message ||
      tasks.error?.message ||
      'Failed to fetch dashboard overview.'
    );
  }

  return {
    totalContacts: contacts.count ?? 0,
    totalLeads: leads.count ?? 0,
    totalDeals: deals.count ?? 0,
    totalCustomers: customers.count ?? 0,
    totalEmails: emails.count ?? 0,
    totalSms: sms.count ?? 0,
    totalCalls: calls.count ?? 0,
    totalTasks: tasks.count ?? 0
  };
};

export const getLeadMetricsFromDB = async (
  orgId: string,
  accessToken: string
): Promise<LeadMetrics> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(leadsTab)
    .select(`
      source,
      priority,
      status
    `)
    .eq('org_id', orgId)
    .is('deleted_at', null);

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch lead metrics: ${error.message}`
    );
  }

  let totalLeads = 0;
  let convertedLeads = 0;

  const leadsBySource: Record<string, number> = {};
  const leadsByPriority: Record<string, number> = {};
  const leadsByStatus: Record<string, number> = {};

  for (const lead of data ?? []) {

    totalLeads++;

    const source = lead.source ?? 'Unknown';
    const priority = lead.priority ?? 'Unknown';
    const status = lead.status ?? 'Unknown';

    leadsBySource[source] =
      (leadsBySource[source] ?? 0) + 1;

    leadsByPriority[priority] =
      (leadsByPriority[priority] ?? 0) + 1;

    leadsByStatus[status] =
      (leadsByStatus[status] ?? 0) + 1;

    if (status.toLowerCase() === 'converted') {
      convertedLeads++;
    }

  }

  return {
    totalLeads,
    leadsBySource,
    leadsByPriority,
    leadsByStatus,
    conversionRate:
      totalLeads > 0
        ? Number(
            (
              (convertedLeads / totalLeads) * 100
            ).toFixed(2)
          )
        : 0
  };

};


export const getDealMetricsFromDB = async (
  orgId: string,
  accessToken: string
): Promise<DealMetrics> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(dealsTab)
    .select(`
      stage,
      status,
      amount
    `)
    .eq('org_id', orgId)
    .is('deleted_at', null);

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch deal metrics: ${error.message}`
    );
  }

  let totalDeals = 0;
  let wonDeals = 0;
  let lostDeals = 0;
  let totalRevenue = 0;

  const dealsByStage: Record<string, number> = {};

  for (const deal of data ?? []) {

    totalDeals++;

    const stage = deal.stage ?? 'Unknown';
    const status = deal.status ?? 'Unknown';
    const amount = Number(deal.amount) || 0;

    dealsByStage[stage] =
      (dealsByStage[stage] ?? 0) + 1;

    if (status.toLowerCase() === 'won') {
      wonDeals++;
      totalRevenue += amount;
    }

    if (status.toLowerCase() === 'lost') {
      lostDeals++;
    }

  }

  const openDeals =
    totalDeals - wonDeals - lostDeals;

  const closedDeals =
    wonDeals + lostDeals;

  return {
    totalDeals,
    dealsByStage,
    wonDeals,
    lostDeals,
    openDeals,
    totalRevenue,
    averageDealSize:
      wonDeals > 0
        ? Number(
            (
              totalRevenue / wonDeals
            ).toFixed(2)
          )
        : 0,
    winRate:
      closedDeals > 0
        ? Number(
            (
              (wonDeals / closedDeals) * 100
            ).toFixed(2)
          )
        : 0
  };

};


export const getCustomerMetricsFromDB = async (
  orgId: string,
  accessToken: string
): Promise<CustomerMetrics> => {

  const db = createSupabaseUserClient(accessToken);

  const { data, error } = await db
    .from(customersTab)
    .select(`
      id,
      status,
      created_at
    `)
    .eq('org_id', orgId)
    .is('deleted_at', null);

  if (error) {
    throw new AppError(
      500,
      `Failed to fetch customer metrics: ${error.message}`
    );
  }

  let totalCustomers = 0;

  let activeCustomers = 0;
  let churnedCustomers = 0;

  const customersByStatus: Record<string, number> = {};
  const customerGrowth: Record<string, number> = {};

  for (const customer of data ?? []) {

    totalCustomers++;

    const status = customer.status ?? 'Unknown';

    customersByStatus[status] =
      (customersByStatus[status] ?? 0) + 1;

    if (status === 'Active') {
      activeCustomers++;
    }

    if (status === 'Churned') {
      churnedCustomers++;
    }

    if (customer.created_at) {

      const month = customer.created_at.slice(0, 7);

      customerGrowth[month] =
        (customerGrowth[month] ?? 0) + 1;

    }

  }

  return {
    totalCustomers,
    customersByStatus,
    activeCustomers,
    churnedCustomers,
    customerGrowth
  };

};

export const getActivityMetricsFromDB = async (
  orgId: string,
  accessToken: string
): Promise<ActivityMetrics> => {

  const db = createSupabaseUserClient(accessToken);

  const [
    emails,
    sms,
    calls,
    tasks
  ] = await Promise.all([

    db
      .from(emailsTab)
      .select("*", {
        count: "exact",
        head: true
      })
      .eq('org_id', orgId)
      .eq('status', 'sent')
      .is('deleted_at', null),

    db
      .from(smsTab)
      .select("*", {
        count: "exact",
        head: true
      })
      .eq('org_id', orgId)
      .eq('status', 'sent')
      .is('deleted_at', null),

    db
      .from(callsTab)
      .select("*", {
        count: "exact",
        head: true
      })
      .eq('org_id', orgId)
      .eq('status', 'completed')
      .is('deleted_at', null),

    db
      .from(tasksTab)
      .select(`
        id,
        status,
        due_date
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)

  ]);

  if (
    emails.error ||
    sms.error ||
    calls.error ||
    tasks.error
  ) {
    throw new AppError(
      500,
      emails.error?.message ||
      sms.error?.message ||
      calls.error?.message ||
      tasks.error?.message ||
      'Failed to fetch activity metrics.'
    );
  }

  let tasksCompleted = 0;
  let tasksPending = 0;
  let tasksOverdue = 0;

  const now = new Date();

  for (const task of tasks.data ?? []) {

    if (task.status === 'Completed') {
      tasksCompleted++;
    }

    if (task.status === 'Pending') {
      tasksPending++;
    }

    if (
      task.status !== 'Completed' &&
      task.due_date &&
      new Date(task.due_date) < now
    ) {
      tasksOverdue++;
    }

  }

  return {
    emailsSent: emails.data?.length ?? 0,
    smsSent: sms.data?.length ?? 0,
    callsCompleted: calls.data?.length ?? 0,
    tasksCompleted,
    tasksPending,
    tasksOverdue
  };

};

export const getDashboardTrendsFromDB = async (
  orgId: string,
  accessToken: string,
  interval: TrendInterval = 'day',
  daysBack = 30
): Promise<DashboardTrends> => {

  const db = createSupabaseUserClient(accessToken);

  const startDate = new Date();

  startDate.setDate(startDate.getDate() - daysBack);

  const startDateISO = startDate.toISOString();

  const [
    leads,
    deals,
    customers
  ] = await Promise.all([

    db
      .from(leadsTab)
      .select(`
        created_at
      `)
      .eq('org_id', orgId)
      .gte('created_at', startDateISO)
      .is('deleted_at', null),

    db
      .from(dealsTab)
      .select(`
        created_at,
        amount,
        status
      `)
      .eq('org_id', orgId)
      .gte('created_at', startDateISO)
      .is('deleted_at', null),

    db
      .from(customersTab)
      .select(`
        created_at
      `)
      .eq('org_id', orgId)
      .gte('created_at', startDateISO)
      .is('deleted_at', null)

  ]);

  if (
    leads.error ||
    deals.error ||
    customers.error
  ) {
    throw new AppError(
      500,
      leads.error?.message ||
      deals.error?.message ||
      customers.error?.message ||
      'Failed to fetch dashboard trends.'
    );
  }

  const leadsCreated: Record<string, number> = {};

  const dealsCreated: Record<string, number> = {};

  const revenueOverTime: Record<string, number> = {};

  const customerGrowth: Record<string, number> = {};

  const getBucket = (
    date: string
  ): string => {

    const d = new Date(date);

    if (interval === 'day') {
      return d.toISOString().slice(0, 10);
    }

    if (interval === 'month') {
      return d.toISOString().slice(0, 7);
    }

    const firstDay = new Date(d);

    const day = firstDay.getUTCDay();

    firstDay.setUTCDate(
      firstDay.getUTCDate() - day
    );

    return firstDay
      .toISOString()
      .slice(0, 10);

  };

  for (const lead of leads.data ?? []) {

    const bucket = getBucket(
      lead.created_at
    );

    leadsCreated[bucket] =
      (leadsCreated[bucket] ?? 0) + 1;

  }

  for (const deal of deals.data ?? []) {

    const bucket = getBucket(
      deal.created_at
    );

    dealsCreated[bucket] =
      (dealsCreated[bucket] ?? 0) + 1;

    if (
      deal.status?.toLowerCase() === 'won'
    ) {

      revenueOverTime[bucket] =
        (revenueOverTime[bucket] ?? 0) +
        (Number(deal.amount) || 0);

    }

  }

  for (const customer of customers.data ?? []) {

    const bucket = getBucket(
      customer.created_at
    );

    customerGrowth[bucket] =
      (customerGrowth[bucket] ?? 0) + 1;

  }

  return {
    interval,
    startDate: startDateISO,
    leadsCreated,
    dealsCreated,
    revenueOverTime,
    customerGrowth
  };

};

export const getRecentDashboardActivitiesFromDB = async (
  orgId: string,
  accessToken: string,
  limit = 10
): Promise<ActivityItem[]> => {

  const db = createSupabaseUserClient(accessToken);

  const [
    leads,
    deals,
    customers,
    emails,
    sms,
    calls,
    tasks
  ] = await Promise.all([

    db
      .from(leadsTab)
      .select(`
        id,
        name,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(dealsTab)
      .select(`
        id,
        title,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(customersTab)
      .select(`
        id,
        name,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(emailsTab)
      .select(`
        id,
        subject,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(smsTab)
      .select(`
        id,
        message,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(callsTab)
      .select(`
        id,
        subject,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit),

    db
      .from(tasksTab)
      .select(`
        id,
        title,
        status,
        created_at
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)
      .order('created_at', {
        ascending: false
      })
      .limit(limit)

  ]);

  if (
    leads.error ||
    deals.error ||
    customers.error ||
    emails.error ||
    sms.error ||
    calls.error ||
    tasks.error
  ) {
    throw new AppError(
      500,
      leads.error?.message ||
      deals.error?.message ||
      customers.error?.message ||
      emails.error?.message ||
      sms.error?.message ||
      calls.error?.message ||
      tasks.error?.message ||
      'Failed to fetch recent dashboard activities.'
    );
  }

  const activities: ActivityItem[] = [];

  for (const lead of leads.data ?? []) {

    activities.push({
      id: lead.id,
      type: 'lead',
      title: lead.name ?? 'Lead',
      description: lead.status,
      createdAt: lead.created_at
    });

  }

  for (const deal of deals.data ?? []) {

    activities.push({
      id: deal.id,
      type: 'deal',
      title: deal.title ?? 'Deal',
      description: deal.status,
      createdAt: deal.created_at
    });

  }

  for (const customer of customers.data ?? []) {

    activities.push({
      id: customer.id,
      type: 'customer',
      title: customer.name ?? 'Customer',
      description: customer.status,
      createdAt: customer.created_at
    });

  }

  for (const email of emails.data ?? []) {

    activities.push({
      id: email.id,
      type: 'email',
      title: email.subject ?? 'Email',
      description: email.status,
      createdAt: email.created_at
    });

  }

  for (const text of sms.data ?? []) {

    activities.push({
      id: text.id,
      type: 'sms',
      title: text.message ?? 'SMS',
      description: text.status,
      createdAt: text.created_at
    });

  }

  for (const call of calls.data ?? []) {

    activities.push({
      id: call.id,
      type: 'call',
      title: call.subject ?? 'Call',
      description: call.status,
      createdAt: call.created_at
    });

  }

  for (const task of tasks.data ?? []) {

    activities.push({
      id: task.id,
      type: 'task',
      title: task.title ?? 'Task',
      description: task.status,
      createdAt: task.created_at
    });

  }

  activities.sort((a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
  );

  return activities.slice(0, limit);

};

export const getUserPerformanceMetricsFromDB = async (
  orgId: string,
  accessToken: string
): Promise<UserPerformanceMetrics> => {

  const db = createSupabaseUserClient(accessToken);

  const [
    leads,
    deals,
    tasks,
    calls
  ] = await Promise.all([

    db
      .from(leadsTab)
      .select(`
        assigned_to
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(dealsTab)
      .select(`
        assigned_to,
        status
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(tasksTab)
      .select(`
        assigned_to,
        status
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null),

    db
      .from(callsTab)
      .select(`
        assigned_to,
        status
      `)
      .eq('org_id', orgId)
      .is('deleted_at', null)

  ]);

  if (
    leads.error ||
    deals.error ||
    tasks.error ||
    calls.error
  ) {
    throw new AppError(
      500,
      leads.error?.message ||
      deals.error?.message ||
      tasks.error?.message ||
      calls.error?.message ||
      'Failed to fetch user performance metrics.'
    );
  }

  const leadsPerUser: Record<string, number> = {};

  const dealsClosedPerUser: Record<string, number> = {};

  const tasksCompletedPerUser: Record<string, number> = {};

  const callsCompletedPerUser: Record<string, number> = {};

  for (const lead of leads.data ?? []) {

    const user =
      lead.assigned_to ?? 'Unassigned';

    leadsPerUser[user] =
      (leadsPerUser[user] ?? 0) + 1;

  }

  for (const deal of deals.data ?? []) {

    if (
      deal.status?.toLowerCase() !== 'won'
    ) {
      continue;
    }

    const user =
      deal.assigned_to ?? 'Unassigned';

    dealsClosedPerUser[user] =
      (dealsClosedPerUser[user] ?? 0) + 1;

  }

  for (const task of tasks.data ?? []) {

    if (
      task.status?.toLowerCase() !== 'completed'
    ) {
      continue;
    }

    const user =
      task.assigned_to ?? 'Unassigned';

    tasksCompletedPerUser[user] =
      (tasksCompletedPerUser[user] ?? 0) + 1;

  }

  for (const call of calls.data ?? []) {

    if (
      call.status?.toLowerCase() !== 'completed'
    ) {
      continue;
    }

    const user =
      call.assigned_to ?? 'Unassigned';

    callsCompletedPerUser[user] =
      (callsCompletedPerUser[user] ?? 0) + 1;

  }

  return {
    leadsPerUser,
    dealsClosedPerUser,
    tasksCompletedPerUser,
    callsCompletedPerUser
  };

};

// This is Dashboard controller
import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/error.middleware";

import {
  getDashboardOverviewFromDB,
  getLeadMetricsFromDB,
  getDealMetricsFromDB,
  getCustomerMetricsFromDB,
  getActivityMetricsFromDB,
  getDashboardTrendsFromDB,
  getRecentDashboardActivitiesFromDB,
  getUserPerformanceMetricsFromDB,
} from "../services/dashboard.service";

import type { TrendInterval } from "../types/dashboard";

const ALLOWED_TREND_INTERVALS: TrendInterval[] = ["day", "week", "month"];

export const getDashboardOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const overview = await getDashboardOverviewFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetch successful",
      data: overview,
    });

  } catch (err) {
    next(err);
  }
};

export const getLeadMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const leadMetrics = await getLeadMetricsFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "Lead metrics fetch successful",
      data: leadMetrics,
    });

  } catch (err) {
    next(err);
  }
};

export const getDealMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const dealMetrics = await getDealMetricsFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "Deal metrics fetch successful",
      data: dealMetrics,
    });

  } catch (err) {
    next(err);
  }
};

export const getCustomerMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const customerMetrics = await getCustomerMetricsFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "Customer metrics fetch successful",
      data: customerMetrics,
    });

  } catch (err) {
    next(err);
  }
};

export const getActivityMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const activityMetrics = await getActivityMetricsFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "Activity metrics fetch successful",
      data: activityMetrics,
    });

  } catch (err) {
    next(err);
  }
};

export const getDashboardTrends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const intervalQuery = req.query.interval;

    const interval: TrendInterval =
      typeof intervalQuery === "string" &&
      ALLOWED_TREND_INTERVALS.includes(intervalQuery as TrendInterval)
        ? (intervalQuery as TrendInterval)
        : "day";

    const daysBackQuery = req.query.daysBack;

    const daysBack =
      daysBackQuery !== undefined
        ? Number(daysBackQuery)
        : 30;

    if (!Number.isFinite(daysBack) || daysBack <= 0) {
      throw new AppError(400, "Invalid daysBack query parameter");
    }

    const trends = await getDashboardTrendsFromDB(
      orgId,
      accessToken,
      interval,
      daysBack
    );

    return res.status(200).json({
      success: true,
      message: "Dashboard trends fetch successful",
      data: trends,
    });

  } catch (err) {
    next(err);
  }
};

export const getRecentDashboardActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const limitQuery = req.query.limit;

    const limit =
      limitQuery !== undefined
        ? Number(limitQuery)
        : 10;

    if (!Number.isFinite(limit) || limit <= 0) {
      throw new AppError(400, "Invalid limit query parameter");
    }

    const activities = await getRecentDashboardActivitiesFromDB(
      orgId,
      accessToken,
      limit
    );

    return res.status(200).json({
      success: true,
      message: "Recent dashboard activities fetch successful",
      data: activities,
    });

  } catch (err) {
    next(err);
  }
};

export const getUserPerformanceMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgId = req.user?.org_id;
    const accessToken = req.cookies.accessToken;

    if (!orgId || !accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const performanceMetrics = await getUserPerformanceMetricsFromDB(
      orgId,
      accessToken
    );

    return res.status(200).json({
      success: true,
      message: "User performance metrics fetch successful",
      data: performanceMetrics,
    });

  } catch (err) {
    next(err);
  }
};

import { Router } from "express";

import {
  authenticateUser,
  verifyToken,
} from "../middleware/auth.middleware";

import {
  readLimiter,
} from "../middleware/rate.limit.middleware";

import {
  getDashboardOverview,
  getLeadMetrics,
  getDealMetrics,
  getCustomerMetrics,
  getActivityMetrics,
  getDashboardTrends,
  getRecentDashboardActivities,
  getUserPerformanceMetrics,
} from "../controllers/dashboard.controller";

const router = Router();

router.use(verifyToken);
router.use(authenticateUser);

router.get(
  "/overview",
  readLimiter,
  getDashboardOverview
);

router.get(
  "/lead-metrics",
  readLimiter,
  getLeadMetrics
);

router.get(
  "/deal-metrics",
  readLimiter,
  getDealMetrics
);

router.get(
  "/customer-metrics",
  readLimiter,
  getCustomerMetrics
);

router.get(
  "/activity-metrics",
  readLimiter,
  getActivityMetrics
);

router.get(
  "/trends",
  readLimiter,
  getDashboardTrends
);

router.get(
  "/recent-activities",
  readLimiter,
  getRecentDashboardActivities
);

router.get(
  "/user-performance",
  readLimiter,
  getUserPerformanceMetrics
);

export default router;

import { Router } from "express";

import {
  authenticateUser,
  verifyToken,
} from "../middleware/auth.middleware";

import {
  readLimiter,
} from "../middleware/rate.limit.middleware";

import {
  getDashboardOverview,
  getLeadMetrics,
  getDealMetrics,
  getCustomerMetrics,
  getActivityMetrics,
  getDashboardTrends,
  getRecentDashboardActivities,
  getUserPerformanceMetrics,
} from "../controllers/dashboard.controller";

const router = Router();

router.use(verifyToken);
router.use(authenticateUser);

router.get(
  "/overview",
  readLimiter,
  getDashboardOverview
);

router.get(
  "/lead-metrics",
  readLimiter,
  getLeadMetrics
);

router.get(
  "/deal-metrics",
  readLimiter,
  getDealMetrics
);

router.get(
  "/customer-metrics",
  readLimiter,
  getCustomerMetrics
);

router.get(
  "/activity-metrics",
  readLimiter,
  getActivityMetrics
);

router.get(
  "/trends",
  readLimiter,
  getDashboardTrends
);

router.get(
  "/recent-activities",
  readLimiter,
  getRecentDashboardActivities
);

router.get(
  "/user-performance",
  readLimiter,
  getUserPerformanceMetrics
);

export default router;


EXAMPLE SLICE: 


