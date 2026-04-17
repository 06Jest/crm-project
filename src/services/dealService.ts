import { supabase } from './supabase';
import type { Deal } from '../types/deal';

export const fetchDealsFromDB = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false});

  if (error) throw new Error(error.message);
  return data as Deal[];
};

export const addDealToDB = async (
  deal: Omit<Deal, 'id' | 'created_at'>
): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .single();
  
  if(error) throw new Error(error.message);
  return data as Deal;
};

export const updateDealInDB = async (deal: Deal): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .update({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      contact_id: deal.contact_id,
      contact_name: deal.contact_name,
      notes: deal.notes,
      close_date: deal.close_date,
      won: deal.won,
    })
    .eq('id', deal.id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as Deal;
};

export const deleteDealFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return id;
}