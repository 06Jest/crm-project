import type { Roles } from "./global";

export interface OrganizationMemberState {
  items: DisplayOrganizationMember[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const ORGANIZATION_MEMBER_STATUSES = [
  "pending",
  "active",
  "inactive",
  "removed",
] as const;

export type OrganizationMemberStatus =
  (typeof ORGANIZATION_MEMBER_STATUSES)[number];

export interface OrganizationMember {
  id: string;
  org_id: string;
  display_id: string;
  profile_id: string;
  role: Roles;
  status: OrganizationMemberStatus;
  created_at?: string;
  updated_at?: string;
}


export interface DisplayOrganizationMember 

  extends OrganizationMember {

  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string | null;
  };
}

export interface CreateOrganizationMemberDTO {
  org_id: string;
  profile_id: string;
  role: Roles;
  status?: OrganizationMemberStatus;
}



export interface UpdateMemberRoleDTO {
  role?: Roles;
  status?: OrganizationMemberStatus;
}

export interface UpdateMemberStatusDTO {
  role?: Roles;
  status?: OrganizationMemberStatus;
}

export interface CreateOwnerMemberDTO {
  org_id:string;
  profile_id:string;
}