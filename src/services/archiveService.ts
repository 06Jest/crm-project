import type {
  ArchiveListQuery,
  ArchiveRecord,
} from "../types/archive";

import { apiClient } from "./apiClient";

export const fetchArchivesAPI = async (
  query: ArchiveListQuery
): Promise<ArchiveRecord[]> => {
  const params = new URLSearchParams({
    type: query.type,
    entity: query.entity,
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  const result = await apiClient(
    `/api/archives?${params.toString()}`,
    {
      method: "GET",
    }
  );

  return result.data as ArchiveRecord[];
};

export const restoreRecordAPI = async (
  entity: string,
  id: string,
  type: "archived" | "deleted"
) => {
  const result = await apiClient(
    `/api/archives/${entity}/${id}/restore?type=${type}`,
    {
      method: "PATCH",
    }
  );

  return result.data;
};