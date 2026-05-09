import { supabase } from '../services/supabase';


export const getOrgId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.org_id || null;
};


export const getUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

export const getUserName = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata?.name || null;
};

export const getInsertMeta = async (): Promise<{
  userId: string | null;
  orgId: string | null;
  userName: string | null;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  return {
    userId: user?.id || null,
    orgId: user?.user_metadata?.org_id || null,
    userName: user?.user_metadata?.name || '',
  };
};