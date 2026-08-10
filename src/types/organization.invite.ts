import type { Roles } from "./global";

export const INVITE_STATUSES = [
  "active",
  "completed",
  "expired",
  "revoked",
] as const;

export type InviteStatus =
  (typeof INVITE_STATUSES)[number];

export interface InviteAcceptance {
  id: string;
  profile_id: string;
  accepted_at: string;
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string | null;
  } | null;
}

export interface OrganizationInvite {
  id: string;
  org_id: string;
  code: string;
  role: Roles;
  email: string | null;
  max_uses: number;
  used_count: number;
  status: InviteStatus;
  expires_at: string;
  created_by: string;
  created_at: string;
  acceptances?: InviteAcceptance[];
}

export interface CreateInviteDTO {
  role: Roles;
  email?: string | null;
  max_uses: number | null;
  expires_at: string | null;
}

export interface AcceptInviteDTO {
  code: string;
}

export interface UpdateInviteDTO {
  role?: Roles;
  email?: string | null;
  max_uses?: number;
  expires_at?: string;
  status?: InviteStatus;
}

export interface InviteMembersSectionProps {
  currentUserRole?: Roles;
  memberLimits: {
    active_limit: number;
    store_limit: number;
  } | null;
  activeMemberCount: number;
  totalMemberCount: number;
}