import { supabase } from './supabase';
import type { Profile } from '../types/profile';

export const fetchMyProfileFromDB = async (
  userId: string
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();


  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data as Profile;
}

export const updateProfileInDB = async (
  userId: string,
  updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error (error.message);;
  return data as Profile;
}

export const updatePasswordInAuth = async (
  newPassword: string
): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if(error) throw new Error(error.message);
}

export const updateNameInAuth = async (name: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    data: { name },
  });
  if (error) throw new Error(error.message)
};