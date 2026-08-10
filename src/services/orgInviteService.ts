import type {
  OrganizationInvite,
  CreateInviteDTO,
  AcceptInviteDTO ,
} from "../types/organization.invite";

import type { DisplayOrganizationMember, OrganizationMember } from "../types/organization.member";

import { apiClient } from "./apiClient";

export const fetchOrganizationInvitesAPI = async (): Promise<
  OrganizationInvite[]
> => {

  const result = await apiClient(
    "/api/org/invites/",
    {
      method: "GET",
    }
  );

  return result.data as OrganizationInvite[];

};

export const createOrganizationInviteAPI = async (
  invite: CreateInviteDTO
): Promise<OrganizationInvite> => {

  const result = await apiClient(
    "/api/org/invites/create",
    {
      method: "POST",
      body: JSON.stringify(invite),
    }
  );

  return result.data as OrganizationInvite;

};

export const acceptOrganizationInviteAPI = async (
  invite: AcceptInviteDTO
): Promise<OrganizationMember> => {

  const result = await apiClient(
    "/api/org/invites/accept",
    {
      method: "POST",
      body: JSON.stringify(invite),
    }
  );

  return result.data as OrganizationMember;

};

export const revokeOrganizationInviteAPI = async (
  id: string
): Promise<OrganizationInvite> => {

  const result = await apiClient(
    `/api/org/invites/delete/${id}`,
    {
      method: "DELETE",
    }
  );

  return result.data as OrganizationInvite;

};

export const approveJoinMemberAPI = async (
  id: string
): Promise<DisplayOrganizationMember> => {
  const result = await apiClient(
    `/api/org/invites/join/approve/${id}`,
    {
      method: "PATCH",
    }
  );

  return result.data as DisplayOrganizationMember;
};

export const rejectJoinMemberAPI = async (
  id: string
): Promise<{ id: string }> => {
  const result = await apiClient(
    `/api/org/invites/join/reject/${id}`,
    {
      method: "DELETE",
    }
  );

  return result.data as { id: string };
};