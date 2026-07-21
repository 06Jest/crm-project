import { apiClient } from "./apiClient";
import type {
  AddDeal,
  Deal,
  DealListItem,
  DealStage,
  UpdateDeal,
} from "../types/deal";

export const fetchDealsAPI = async (): Promise<Deal[]> => {
  const result = await apiClient("/api/deals/show-deals", {
    method: "GET",
  });

  return result.data as Deal[];
};

export const fetchDealsListsAPI = async (): Promise<DealListItem[]> => {
  const result = await apiClient("/api/deals/show-deals-lists", {
    method: "GET",
  });

  return result.data as DealListItem[];
};



export const addDealAPI = async (
  deal: AddDeal
): Promise<DealListItem> => {
  const result = await apiClient("/api/deals/add-deal", {
    method: "POST",
    body: JSON.stringify(deal),
  });

  return result.data as DealListItem;
};

export const updateDealAPI = async (
  id: string,
  deal: UpdateDeal
): Promise<DealListItem> => {
  const result = await apiClient(`/api/deals/update-deal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(deal),
  });

  return result.data as DealListItem;
};

export const updateDealStageAPI = async (
  id: string,
  stage: DealStage
): Promise<DealListItem> => {
  
  const result = await apiClient(`/api/deals/update-deal-stage/${id}`, {
    method: "PATCH",
    body: JSON.stringify({stage}),
  });
  
  return result.data as DealListItem;
};

export const closeDealAPI = async (
  id: string,
  stage: DealStage
): Promise<DealListItem> => {
  const result = await apiClient(`/api/deals/close-deal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(stage),
  });

  return result.data as DealListItem;
};

export const deleteDealAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/deals/delete-deal/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};