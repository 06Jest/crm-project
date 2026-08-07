import type {
  OrganizationInvite,
  CreateInviteDTO,
  AcceptInviteDTO ,
} from "../types/organization.invite";

import type { OrganizationMember } from "../types/organization.member";

import { apiClient } from "./apiClient";

export const fetchOrganizationInvitesAPI = async (): Promise<
  OrganizationInvite[]
> => {

  const result = await apiClient(
    "/api/organization-invites/",
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
    "/api/organization-invites/",
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
    "/api/organization-invites/accept",
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
    `/api/organization-invites/${id}`,
    {
      method: "DELETE",
    }
  );

  return result.data as OrganizationInvite;

};