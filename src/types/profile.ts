export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'agent';
  employee_id?: string | null;   
  org_id?: string | null;        
  org_name?: string | null;      
  is_active: boolean;
  avatar_url?: string | null;
  created_by?: string | null;    
  created_at?: string;
}