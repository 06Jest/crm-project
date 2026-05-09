export interface Lead {
  id: string;
  title: string;
  name: string;
  status: string;
  notes?: string;
  user_id?: string;
  org_id?: string;          
  assigned_to?: string;     
  converted_by?: string;    
  created_at?: string;
}