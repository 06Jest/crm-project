import { useState, useEffect } from 'react';
import { useAuthContext } from './useAuthContext';
import { supabase } from '../services/supabase';
import type { Profile } from '../types/profile';

interface UseRoleReturn {
  profile: Profile | null;
  role: 'super_admin' | 'admin' | 'agent' | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  loading: boolean;
  employeeId: string | null;
}

export function useRole(): UseRoleReturn {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const role = profile?.role || null;

  return {
    profile,
    role,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin',
    isAgent: role === 'agent',
    loading,
    employeeId: profile?.employee_id || null,
  };
}