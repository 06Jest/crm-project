import { supabase } from './supabase';
import type { Profile } from '../types/profile';

interface SuperAdminLoginResponse {
  data: {
    user: Profile;
    token: string;
  } | null;
  error: string | null;
}
interface SuperAdminSession {
  id: string;
  super_admin_id: string;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

export const superAdminLogin = async (
  email: string,
  secretKey: string
): Promise<SuperAdminLoginResponse> => {
  try {
    if (!email || !secretKey) {
      return {
        data: null,
        error: 'Email and secret key are required',
      };
    }

    if (secretKey.length < 32) {
      return {
        data: null,
        error: 'Invalid secret key format',
      };
    }


    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('role', 'super_admin')
      .eq('super_admin_key', secretKey)
      .single();

    if (profileError || !profile) {
      console.error('Super admin auth failed:', profileError);
      

      await logSecurityEvent({
        event_type: 'SUPER_ADMIN_LOGIN_FAILED',
        super_admin_id: null,
        ip_address: await getClientIP(),
        details: { email, reason: 'Invalid credentials' },
      });

      return {
        data: null,
        error: 'Invalid email or secret key',
      };
    }

    if (!profile.is_active) {
      return {
        data: null,
        error: 'This super admin account has been deactivated',
      };
    }

  const sessionToken = generateSessionToken();

  const response = await supabase
  .rpc('create_super_admin_session', {
    p_admin_id: profile.id,
    p_token: sessionToken,
    p_ip: await getClientIP(),
    p_ua: navigator.userAgent
  })
  .single();

const session = response.data as SuperAdminSession | null;
const sessionError = response.error;

    if (sessionError) {
      return {
        data: null,
        error: 'Failed to create session',
      };
    }
    if (!session) {
      return {
        data: null,
        error: 'Failed to create session',
      };
    }

    await supabase.rpc('update_super_admin_last_login', {
      p_admin_id: profile.id
    });

    
    localStorage.setItem('super_admin_token', session.session_token);
    localStorage.setItem('super_admin_id', profile.id);


    await logSecurityEvent({
      event_type: 'SUPER_ADMIN_LOGIN_SUCCESS',
      super_admin_id: profile.id,
      ip_address: await getClientIP(),
      details: { email },
    });

    return {
      data: {
        user: profile as Profile,
        token: session.session_token,
      },
      error: null,
    };
  } catch (err) {
    console.error('Super admin login error:', err);
    return {
      data: null,
      error: 'An error occurred. Please try again.',
    };
  }
};

export const superAdminLogout = async (): Promise<{ error: string | null }> => {
  try {
    const token = localStorage.getItem('super_admin_token');
    const superAdminId = localStorage.getItem('super_admin_id');

    if (token && superAdminId) {
      // Delete session
      await supabase.rpc('delete_super_admin_session', {
        p_token: token
      });

      // Log event
      await logSecurityEvent({
        event_type: 'SUPER_ADMIN_LOGOUT',
        super_admin_id: superAdminId,
        ip_address: await getClientIP(),
        details: {},
      });
    }

    localStorage.removeItem('super_admin_token');
    localStorage.removeItem('super_admin_id');

    return { error: null };
  } catch (err) {
    console.error('Super admin logout error:', err);
    return { error: 'Failed to logout' };
  }
};


export const verifySuperAdminSession = async (
  token: string
): Promise<{ valid: boolean; superAdminId?: string }> => {
  try {
    const response = await supabase
      .rpc('verify_super_admin_session', {
        p_token: token
      })
      .single();

    const session = response.data as SuperAdminSession | null;
    const error = response.error;

    if (error || !session) {
      return { valid: false };
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.rpc('delete_super_admin_session', {
        p_token: token
      });
      return { valid: false };
    }

    // Update last activity
    await supabase.rpc('update_super_admin_activity', {
      p_token: token
    });

    return {
      valid: true,
      superAdminId: session.super_admin_id,
    };
  } catch (err) {
    console.error('Session verification error:', err);
    return { valid: false };
  }
};

export const generateSuperAdminSecretKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let key = '';
  const values = new Uint8Array(48);
  window.crypto.getRandomValues(values);

  for (let i = 0; i < values.length; i++) {
    key += chars[values[i] % chars.length];
  }

  return key;
};


export const logSecurityEvent = async (event: {
  event_type: string;
  super_admin_id: string | null;
  ip_address?: string;
  details: Record<string, unknown>;
}): Promise<void> => {
  try {
    await supabase.rpc('log_super_admin_event', {
      p_event_type: event.event_type,
      p_super_admin_id: event.super_admin_id,
      p_ip_address: event.ip_address || 'unknown',
      p_details: event.details
    });
  } catch (err) {
    console.error('Failed to log security event:', err);
  }
};


async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

function generateSessionToken(): string {
  const values = new Uint8Array(32);
  window.crypto.getRandomValues(values);
  return Array.from(values)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}