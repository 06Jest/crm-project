export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Prospect' | 'Lead';
  created_at?: string;
  user_id?: string;
  assigned_to: string;
}