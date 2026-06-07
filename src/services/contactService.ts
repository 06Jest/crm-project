
import type { Contact } from '../types/contact';


const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contacts`;

export const fetchContactsAPI = 
  async (token: string): 
    Promise<Contact[]> => {
      const response =
        await fetch(
          `${API_URL}/show-contacts`,
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

export const addContactAPI =
  async (
    token: string,
    contact: Omit<Contact, 'id' | 'created_at' | 'owner_id' | 'org_id' | 'owner_name' | 'full_name'>
  ): Promise<Contact> => {
      const response =
        await fetch(
          `${API_URL}/add-contact`,
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
  return result.data as Contact;
};

export const updateContactAPI =
  async (
    token: string,
    id: string,
    contact: Omit<Contact, 'id' | 'created_at' | 'owner_id' | 'org_id' | 'owner_name' | 'full_name'>
  ): Promise<Contact> => {
      const response =
        await fetch(
          `${API_URL}/update-contact`,
          {
            method: "PATCH",

            headers: {
              "Content-Type": "application/json",
              authorization:
                `Bearer ${token}`,
              
            },

            body: JSON.stringify({token, id, contact }),
          }
        );
  const result =
  await response.json();

  if (!response.ok) {
    throw new Error(
      result.error
    );
  }
  return result.data as Contact;
};

export const deleteContactAPI =
  async (token: string, id: string): Promise<string> => {
      const response =
        await fetch(
          `${API_URL}/delete-contact`,
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
