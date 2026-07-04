export type DealStage = 
| 'Prospecting'
| 'Proposal'
| 'Negotiation'
| 'Closed Won'
| 'Closed Lost';

export interface Deal {
  id: string;
  contact_id: string;
  title: string;
  stage: DealStage;
  value: number;
  notes?: string;
  owner_id: string;         
  org_id: string; 
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
  close_date?: string;          
  closed_by?: string;       
}

