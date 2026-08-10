import { type Subscription} from "./subscription";

export interface OrganizationState {
  item: DisplayOrganization | null;
  loading: boolean;
  updating: boolean;
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
  logo_url?: string | null;
  description?: string | null;
  product_type?: string | null;
  company_size: string | null;
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

export interface DisplayOrganization {
  id: string;
  name: string;
  display_id: string;
  industry?: string | null;
  company_size?: string | null;
  website?: string | null;
  type: OrganizationType;
  logo_url?: string | null;
  product_type?: string | null;
  description?: string | null;
  created_at: string;
  subscription?: Subscription | null;
}

export interface UpdateWorkspaceDetailsDTO {
  name?: string;
  industry?: string | null;
  business_type?: string | null;
  company_size?: string | null;
  product_type?: string | null;
  website?: string | null;
  description?: string | null;
  logo_url?: string | null;
}