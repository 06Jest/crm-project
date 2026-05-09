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
  orgId: string | null;
}

export function useRole(): UseRoleReturn {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // 

      if (!isMounted) return;

      if (error || !data) {
        
        setProfile({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || '',
          role: user.user_metadata?.role || 'admin',
          org_id: user.user_metadata?.org_id || null,
          org_name: user.user_metadata?.org_name || null,
          employee_id: user.user_metadata?.employee_id || null,
          is_active: true,
        } as Profile);
      } else {
        setProfile(data as Profile);
      }

      setLoading(false);
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const role = (profile?.role || user?.user_metadata?.role || null) as
    'super_admin' | 'admin' | 'agent' | null;

  return {
    profile,
    role,
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin',
    isAgent: role === 'agent',
    loading,
    employeeId:
      profile?.employee_id || user?.user_metadata?.employee_id || null,
    orgId:
      profile?.org_id || user?.user_metadata?.org_id || null,
  };
}