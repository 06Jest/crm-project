import { supabase } from './supabase';
import type { Profile } from '../types/profile';

export const fetchAgentsFromDB = async (
  orgId: string
): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('org_id', orgId)
    .eq('role', 'agent')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Profile[];
};

export const createAgentViaBackend = async (data: {
  name: string;
  email: string;
  employeeId: string;
  tempPassword: string;
  orgId: string;
  orgName: string;
  adminName: string;
}): Promise<Profile> => {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/agents/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();
  if (!result.success) throw new Error(result.error);
  return result.data as Profile;
};

export const toggleAgentStatusInDB = async (
  agentId: string,
  isActive: boolean
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', agentId);

  if (error) throw new Error(error.message);
};

export const updateAgentInDB = async (
  agentId: string,
  updates: { name?: string; employee_id?: string }
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', agentId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
};

export const sendPasswordResetForAgent = async (
  email: string
): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(error.message);
};