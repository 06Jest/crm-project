import { supabase } from "./supabase";
import type { Lead } from '../types/lead';

export const fetchLeadsFromDB = async (): Promise<Lead[]> => {
  const { data, error} = await supabase
    .from('leads')
    .select('*')
    .order('created_at', {ascending: false});
  
  if (error) throw new Error(error.message);
  return data as Lead[];
};

export const addLeadToDB = async (
  lead: Omit<Lead, 'id' | 'created_at'>
): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if(error) throw new Error(error.message);
  return data as Lead;
};

export const updateLeadInDB = async (lead: Lead): Promise<Lead> => {
  const { data, error} = await supabase
    .from('leads')
    .update({
      title: lead.title,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      notes: lead.notes
    })
    .eq('id', lead.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

export const deleteLeadFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message);
  return id;
};


