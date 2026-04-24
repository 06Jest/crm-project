export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  org_id?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string; 
}

