export type DashboardScope = "organization" | "user";

export type DashboardRole = "owner" | "manager" | "agent";

export interface DashboardKpis {
  totalLeads: number;
  totalContacts: number;
  totalCustomers: number;
  totalDeals: number;
  openDeals: number;
  pipelineValue: number;
  wonRevenue: number;
  openTasks: number;
  overdueTasks: number;
  scheduledCalls: number;
}

export interface PipelineStageMetric {
  stage: string;
  count: number;
  value: number;
}

export interface LeadOverview {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  bySource: Record<string, number>;
}

export interface CustomerOverview {
  total: number;
  byStatus: Record<string, number>;
}

export interface ActivityOverview {
  emailsSent: number;
  smsSent: number;
  callsCompleted: number;
  tasksCompleted: number;
  tasksPending: number;
  tasksOverdue: number;
}

export interface DashboardMember {
  memberId: string;
  profileId: string;
  displayId: string;
  name: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  role: DashboardRole;
}

export interface MemberDashboardStats extends DashboardMember {
  leads: number;
  contacts: number;
  customers: number;
  openDeals: number;
  pipelineValue: number;
  openTasks: number;
  overdueTasks: number;
  scheduledCalls: number;
  completedCalls: number;
  emailsSent: number;
  smsSent: number;
}

export interface DashboardActivity {
  id: string;
  type: string;
  action: string;
  title: string;
  description: string | null;
  targetName: string | null;
  createdAt: string;
  createdBy: {
    memberId: string;
    name: string;
    avatarUrl: string | null;
  } | null;
}

export interface PriorityItem {
  id: string;
  displayId: string;
  name: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenDealItem {
  id: string;
  displayId: string;
  title: string;
  stage: string;
  value: number;
  closeDate: string | null;
  updatedAt: string;
}

export interface InactiveContactItem {
  id: string;
  displayId: string;
  name: string;
  priority: string;
  lastActivityAt: string | null;
  inactiveDays: number;
}

export interface DashboardAttention {
  priorityLeads: PriorityItem[];
  priorityContacts: PriorityItem[];
  openDeals: OpenDealItem[];
  inactiveContacts: InactiveContactItem[];
}

export interface DashboardData {
  scope: DashboardScope;
  role: DashboardRole;
  kpis: DashboardKpis;

  pipeline: {
    stages: PipelineStageMetric[];
  };

  leads: LeadOverview;
  customers: CustomerOverview;
  activity: ActivityOverview;

  attention: DashboardAttention;

  recentActivity: DashboardActivity[];

  members: MemberDashboardStats[];
}