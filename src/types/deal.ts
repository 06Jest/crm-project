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
  notes?: string;
  owner_id: string;         
  owner_name: string;
  org_id: string; 
  value: number;
  created_at: string;
  close_date?: string;          
  closed_by?: string;       
}

