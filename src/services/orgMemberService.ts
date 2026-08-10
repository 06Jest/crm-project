import type {
  DisplayOrganizationMember,
  OrganizationMemberStatus,
} from "../types/organization.member";
import type { Roles } from "../types/global";

import { apiClient } from "./apiClient";

export const fetchOrgMembersAPI = async (): Promise<
  DisplayOrganizationMember[]
> => {
  const result = await apiClient(
    "/api/org/members/",
    {
      method: "GET",
    }
  );

  return result.data as DisplayOrganizationMember[];
};

export const updateMemberRoleAPI = async (
  id: string,
  role: Roles
): Promise<DisplayOrganizationMember> => {
  const result = await apiClient(
    `/api/org/members/${id}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );

  return result.data as DisplayOrganizationMember;
};

export const updateMemberStatusAPI = async (
  id: string,
  status: OrganizationMemberStatus
): Promise<DisplayOrganizationMember> => {
  const result = await apiClient(
    `/api/org/members/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  return result.data as DisplayOrganizationMember;
};

export const removeOrgMemberAPI = async (
  id: string
): Promise<{ id: string }> => {
  const result = await apiClient(
    `/api/org/members/${id}`,
    {
      method: "DELETE",
    }
  );

  return result.data as { id: string };
};