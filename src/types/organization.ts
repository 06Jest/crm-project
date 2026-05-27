export type SubscriptionStatus = 'active' | 'paused';
export type SubscriptionPlan = 'Free' | 'Pro';

export interface Organization {
  id: string;
  name: string;
  admin_id: string;
  created_at: string;
  subscription_status: SubscriptionStatus;
  subscription_plan: SubscriptionPlan;


  admin?: {
    name: string;
    email: string;
  };
}