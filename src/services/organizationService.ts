import type {
  Organization,
  CreateWorkspaceDTO,
} from "../types/organization";

import { apiClient } from "./apiClient";

export const createWorkspaceAPI = async (
  workspace: CreateWorkspaceDTO
): Promise<Organization> => {

  const result = await apiClient(
    "/api/organizations/",
    {
      method: "POST",
      body: JSON.stringify(workspace),
    }
  );

  return result.data as Organization;

};

export const renameWorkspaceAPI = async (
  name: Pick<Organization, "name">
): Promise<Organization> => {

  const result = await apiClient(
    "/api/organizations/name",
    {
      method: "PATCH",
      body: JSON.stringify(name),
    }
  );

  return result.data as Organization;

};