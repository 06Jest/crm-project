import { supabase } from './supabase';
import { getInsertMeta } from '../utils/getOrgId';
import type { Contact } from '../types/contact';

export const fetchContactsFromDB = async (): Promise<Contact[]> => {

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Contact[];
};

export const addContactToDB = async (
  contact: Omit<Contact, 'id' | 'created_at'>
): Promise<Contact> => {
  const { userName, userId, orgId } = await getInsertMeta();
  
  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      ...contact,
      user_id: userId,
      org_id: orgId,
      created_by: userId,
      assigned_to: userName,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Contact;
};

export const updateContactInDB = async (
  contact: Contact
): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      status: contact.status,
      notes: contact.notes,
      assigned_to: contact.assigned_to,
    })
    .eq('id', contact.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Contact;
};

export const deleteContactFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
};