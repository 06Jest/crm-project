export interface Lead {
  id: string;
  title: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  notes?: string;
  created_at: string;
};

