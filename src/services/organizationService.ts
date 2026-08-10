import type {
  DisplayOrganization,
  UpdateWorkspaceDetailsDTO,
} from "../types/organization";

import { apiClient } from "./apiClient";

export const fetchWorkspaceAPI = async (
): Promise<DisplayOrganization> => {

  const result = await apiClient(
    "/api/org/",
    {
      method: "GET",
    }
  );

  return result.data as DisplayOrganization;
};


export const renameWorkspaceAPI = async (
  name: Pick<DisplayOrganization, "name">
): Promise<DisplayOrganization> => {

  const result = await apiClient(
    "/api/org/rename",
    {
      method: "PATCH",
      body: JSON.stringify(name),
    }
  );

  return result.data as DisplayOrganization;

};

export const updateWorkspaceDetailsAPI = async (
  updates: UpdateWorkspaceDetailsDTO
): Promise<DisplayOrganization> => {

  const result = await apiClient(
    "/api/org/details",
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    }
  );

  return result.data as DisplayOrganization;

};