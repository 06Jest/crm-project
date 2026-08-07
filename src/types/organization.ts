import { type SubscriptionPlan} from "./subscription";

export interface OrganizationState {
  item: Organization | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const ORGANIZATION_TYPES = [
  "personal",
  "business",
] as const;

export type OrganizationType =
  typeof ORGANIZATION_TYPES[number];

export interface Organization {
  id: string;
  display_id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  industry: string | null;
  business_type: string | null;
  company_size: string | null;
  subscription_plan: SubscriptionPlan;
  created_at?: string
  updated_at?: string;
}


export interface CreateWorkspaceDTO {
  name: string;
  type: OrganizationType;
  industry?: string;
  product_type?: string;
  company_size?: string;
}