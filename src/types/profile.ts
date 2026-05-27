export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'agent';
  employee_id?: string | null;   
  is_active: boolean;
  is_banned: boolean;
  avatar_url?: string | undefined;
  created_by?: string | null;    
  created_at?: string;

  org?: {
    id?: string | null;        
    name?: string | null;      
  }
}