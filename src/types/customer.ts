export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect';

export interface Customer {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: CustomerStatus;
  user_id?: string;
  created_at?: string;
}

