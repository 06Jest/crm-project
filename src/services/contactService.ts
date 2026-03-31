import { supabase } from "./supabase";
import type { Contact } from '../types/contact'

export const fetchContactsFromDB = async (): Promise<Contact[]> => {
  const {data, error} = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false});

  if (error) throw new Error( error.message);
  return data as Contact[];
};

export const addContactToDB = async (
  contact: Omit<Contact, 'id'>
): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
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
    })
    .eq('id', contact.id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as Contact;
};

export const deleteContactFromDB = async (id:string): Promise <string> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return id;
};