
import type { Lead } from '../types/lead';


const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/leads`;

export const fetchLeadsAPI = 
  async (token: string): 
    Promise<Lead[]> => {
      const response =
        await fetch(
          `${API_URL}/show-leads`,
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

export const addLeadAPI =
  async (
    token: string,
    contact: Omit<Lead, 'id' | 'created_at' | 'owner_id' | 'org_id' | 'owner_name'>
  ): Promise<Lead> => {
      const response =
        await fetch(
          `${API_URL}/add-lead`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify(contact),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Lead;
};

export const updateLeadAPI =
  async (
    token: string,
    id: string,
    lead: Omit<Lead, 'id' | 'created_at' | 'owner_id' | 'org_id' | 'owner_name' >
  ): Promise<Lead> => {
      const response =
        await fetch(
          `${API_URL}/update-lead`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify({token, id, lead }),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Lead;
};

export const deleteLeadAPI =
  async (token: string, id: string): Promise<string> => {
      const response =
        await fetch(
          `${API_URL}/delete-lead`,
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
