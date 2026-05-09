import { supabase } from './supabase';
import { getInsertMeta } from '../utils/getOrgId';
import type { Activity } from '../types/activity';

export const fetchActivitiesFromDB = async (): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Activity[];
};

export const addActivityToDB = async (
  activity: Omit<Activity, 'id' | 'created_at'>
): Promise<Activity> => {
  const { userId, orgId } = await getInsertMeta();

  const { data, error } = await supabase
    .from('activities')
    .insert([{
      ...activity,
      user_id: userId,
      org_id: orgId,
      logged_by: userId,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Activity;
};

export const updateActivityInDB = async (
  activity: Activity
): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .update({
      type: activity.type,
      subject: activity.subject,
      body: activity.body,
      contact_name: activity.contact_name,
      direction: activity.direction,
      duration: activity.duration,
      completed: activity.completed,
    })
    .eq('id', activity.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Activity;
};

export const deleteActivityFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase.from('activities').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return id;
};

export const toggleActivityCompleteInDB = async (
  id: string,
  completed: boolean
): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .update({ completed })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as Activity;
}