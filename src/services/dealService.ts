import { apiClient } from "./apiClient";
import type {
  AddDeal,
  Deal,
  DealStage,
  UpdateDeal,
} from "../types/deal";

export const fetchDealsAPI = async (): Promise<Deal[]> => {
  const result = await apiClient("/api/deals/show-deals", {
    method: "GET",
  });

  return result.data as Deal[];
};

export const addDealAPI = async (
  deal: AddDeal
): Promise<Deal> => {
  const result = await apiClient("/api/deals/add-deal", {
    method: "POST",
    body: JSON.stringify(deal),
  });

  return result.data as Deal;
};

export const updateDealAPI = async (
  id: string,
  deal: UpdateDeal
): Promise<Deal> => {
  const result = await apiClient(`/api/deals/update-deal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(deal),
  });

  return result.data as Deal;
};

export const closeDealAPI = async (
  id: string,
  stage: DealStage
): Promise<Deal> => {
  const result = await apiClient(`/api/deals/close-deal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(stage),
  });

  return result.data as Deal;
};

export const deleteDealAPI = async (
  id: string
): Promise<string> => {
  const result = await apiClient(`/api/deals/delete-deal/${id}`, {
    method: "DELETE",
  });

  return result.data as string;
};