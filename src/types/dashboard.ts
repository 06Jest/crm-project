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
