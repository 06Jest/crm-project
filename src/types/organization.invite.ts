import type { Roles } from "./global";

export const INVITE_STATUSES = [
  "active",
  "completed",
  "expired",
  "revoked",
] as const;

export type InviteStatus =
  (typeof INVITE_STATUSES)[number];

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
  accepted_at: string | null;
  accepted_by: string | null;
  created_by: string;
  created_at: string;
}

export interface CreateInviteDTO {
  role: Roles;
  email?: string | null;
  max_uses: number;
  expires_at: string;
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