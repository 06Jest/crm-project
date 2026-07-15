export type Role =
| 'admin'
| 'agent';

export type ProfileStatus =
| 'pending'
| 'inactive'
| 'active'
| 'banned'
| 'deleted';

export interface Profile {
  id: string;
  display_name: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: Role;
  org_id: string | null;
  employee_id: string | null;  
  position: string | null; 
  status: ProfileStatus;
  avatar_url: string | null;  
  created_at?: string;
  deleted_at: string | null;
  last_login: string | null;
}