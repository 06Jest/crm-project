
import type { Deal } from '../types/deal';


const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/deals`;

export const fetchDealsAPI = 
  async (token: string): 
    Promise<Deal[]> => {
      const response =
        await fetch(
          `${API_URL}/show-deals`,
          {
            headers: {
              authorization:
                `Bearer ${token}`,
            },
          }
        );
  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data;
};

export const addDealAPI =
  async (
    token: string,
    deal: Omit<Deal, 
    'id' | 
    'created_at' | 
    'owner_id' | 
    'org_id' | 
    'owner_name' |
    'deleted_at' |
    'deleted_by' |
    'updated_by' |
    'closed_date' |
    'closed_by'
    >
  ): Promise<Deal> => {
      const response =
        await fetch(
          `${API_URL}/add-deal`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify(deal),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Deal;
};



export const updateDealAPI =
  async (
    token: string,
    id: string,
    deal: Omit<Deal, 
    'id' | 
    'created_at' |
    'contact_id' |
    'owner_id' | 
    'org_id' | 
    'owner_name' |
    'deleted_at' |
    'deleted_by' |
    'updated_by' |
    'closed_date' |
    'closed_by'
    >
  ): Promise<Deal> => {
      const response =
        await fetch(
          `${API_URL}/update-deal`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify({token, id, deal }),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Deal;
};

export const closeDealAPI =
  async (
    token: string,
    id: string,
    deal: Omit<Deal, 
    'id' | 
    'created_at' |
    'contact_id' |
    'owner_id' | 
    'org_id' | 
    'owner_name' |
    'deleted_at' |
    'deleted_by' |
    'updated_by' 
    >
  ): Promise<Deal> => {
      const response =
        await fetch(
          `${API_URL}/close-deal`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify({token, id, deal }),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Deal;
};

export const deleteDealAPI =
  async (token: string, id: string): Promise<string> => {
      const response =
        await fetch(
          `${API_URL}/delete-deal`,
          {
            method: "DELETE",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify({id}),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error( 
      result.error
    );
  }
  return result.data as string;
};
