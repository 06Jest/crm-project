import { supabase } from './supabase';
import { getInsertMeta, getUserId } from '../utils/getOrgId';
import type { Deal } from '../types/deal';

export const fetchDealsFromDB = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Deal[];
};

export const addDealToDB = async (
  deal: Omit<Deal, 'id' | 'created_at'>
): Promise<Deal> => {
  const { userId, orgId } = await getInsertMeta();

  const { data, error } = await supabase
    .from('deals')
    .insert([{
      ...deal,
      user_id: userId,
      org_id: orgId,
      owned_by: deal.owned_by || userId,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Deal;
};

export const updateDealInDB = async (deal: Deal): Promise<Deal> => {
  const userId = await getUserId();

  // If closing the deal, record who closed it
  const closedBy =
    deal.stage === 'Closed Won' || deal.stage === 'Closed Lost'
      ? userId
      : deal.closed_by;

  const { data, error } = await supabase
    .from('deals')
    .update({
      title: deal.title,
      value: deal.value,
      stage: deal.stage,
      contact_name: deal.contact_name,
      close_date: deal.close_date,
      notes: deal.notes,
      owned_by: deal.owned_by,
      closed_by: closedBy,
    })
    .eq('id', deal.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Deal;
};

export const deleteDealFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase.from('deals').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
};