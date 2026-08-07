export interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const SUBSCRIPTION_PLANS = [
  "Free",
  "Starter",
  "Team",
  "Business",
  "Enterprise",
] as const;

export type SubscriptionPlan =
  typeof SUBSCRIPTION_PLANS[number];

export const BILLING_CYCLES = [
  "none",
  "monthly",
  "yearly",
] as const;

export type BillingCycle =
  typeof BILLING_CYCLES[number];

export const PAYMENT_PROVIDERS = [
  "stripe",
  "paypal",
  "gcash",
  "maya",
  "none",
] as const;

export type PaymentProvider =
  typeof PAYMENT_PROVIDERS[number];

export const LIMIT_TYPES = [
  "active_limit",
  "store_limit",
] as const;

export type LimitType =
  typeof LIMIT_TYPES[number];

export const SUBSCRIPTION_STATUSES = [
  "active",
  "cancelled",
  "expired",
  "past_due",
] as const;

export type SubscriptionStatus =
  typeof SUBSCRIPTION_STATUSES[number];


export const LIMITABLE_RESOURCES = [
  "members",
  "leads",
  "contacts",
  "deals",
  "customers",
  "tasks",
  "notes",
  "emails",
  "sms",
  "calls",
] as const;

export type LimitableResource =
  typeof LIMITABLE_RESOURCES[number];


export type CreateSubscriptionDTO = {
  plan: SubscriptionPlan;
  billing_cycle: BillingCycle;
  payment_provider: PaymentProvider;
  provider_reference?: string | null;
};


export const PLAN_LIMITS = {
  Free: {
    members: { active_limit: 3, store_limit: 5 },

    leads: { active_limit: 100, store_limit: 200 },
    contacts: { active_limit: 100, store_limit: 200 },
    deals: { active_limit: 50, store_limit: 100 },
    customers: { active_limit: 100, store_limit: 200 },

    notes: { active_limit: 500, store_limit: 1000 },
    tasks: { active_limit: 500, store_limit: 1000 },

    emails: { active_limit: 1000, store_limit: 2000 },
    sms: { active_limit: 500, store_limit: 1000 },
    calls: { active_limit: 500, store_limit: 1000 },
  },

  Starter: {
    members: { active_limit: 10, store_limit: 20 },

    leads: { active_limit: 1000, store_limit: 2000 },
    contacts: { active_limit: 1000, store_limit: 2000 },
    deals: { active_limit: 500, store_limit: 1000 },
    customers: { active_limit: 1000, store_limit: 2000 },

    notes: { active_limit: 3000, store_limit: 6000 },
    tasks: { active_limit: 3000, store_limit: 6000 },
    activities: { active_limit: 10000, store_limit: 20000 },

    messages: { active_limit: 25000, store_limit: 50000 },
    emails: { active_limit: 5000, store_limit: 10000 },
    sms: { active_limit: 2500, store_limit: 5000 },
    calls: { active_limit: 2500, store_limit: 5000 },
  },

  Team: {
    members: { active_limit: 50, store_limit: 100 },

    leads: { active_limit: 5000, store_limit: 10000 },
    contacts: { active_limit: 5000, store_limit: 10000 },
    deals: { active_limit: 2000, store_limit: 5000 },
    customers: { active_limit: 5000, store_limit: 10000 },

    notes: { active_limit: 10000, store_limit: 20000 },
    tasks: { active_limit: 10000, store_limit: 20000 },
    activities: { active_limit: 50000, store_limit: 100000 },

    messages: { active_limit: 100000, store_limit: 200000 },
    emails: { active_limit: 20000, store_limit: 50000 },
    sms: { active_limit: 10000, store_limit: 20000 },
    calls: { active_limit: 10000, store_limit: 20000 },
  },

  Business: {
    members: { active_limit: 200, store_limit: 400 },

    leads: { active_limit: 20000, store_limit: 40000 },
    contacts: { active_limit: 20000, store_limit: 40000 },
    deals: { active_limit: 10000, store_limit: 20000 },
    customers: { active_limit: 20000, store_limit: 40000 },

    notes: { active_limit: 50000, store_limit: 100000 },
    tasks: { active_limit: 50000, store_limit: 100000 },
    activities: { active_limit: 250000, store_limit: 500000 },

    messages: { active_limit: 500000, store_limit: 1000000 },
    emails: { active_limit: 50000, store_limit: 100000 },
    sms: { active_limit: 25000, store_limit: 50000 },
    calls: { active_limit: 25000, store_limit: 50000 },
  },

  Enterprise: {
    members: { active_limit: 500, store_limit: 1000 },

    leads: { active_limit: 100000, store_limit: 200000 },
    contacts: { active_limit: 100000, store_limit: 200000 },
    deals: { active_limit: 50000, store_limit: 100000 },
    customers: { active_limit: 100000, store_limit: 200000 },

    notes: { active_limit: 200000, store_limit: 400000 },
    tasks: { active_limit: 200000, store_limit: 400000 },
    activities: { active_limit: 1000000, store_limit: 2000000 },

    messages: { active_limit: 2000000, store_limit: 4000000 },
    emails: { active_limit: 200000, store_limit: 400000 },
    sms: { active_limit: 100000, store_limit: 200000 },
    calls: { active_limit: 100000, store_limit: 200000 },
  },
} as const;


export interface Subscription {
  id: string;
  org_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  created_at?: string;
  updated_at?: string;
}
