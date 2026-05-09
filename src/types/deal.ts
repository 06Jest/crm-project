export type DealStage = 
| 'Prospecting'
| 'Proposal'
| 'Negotiation'
| 'Closed Won'
| 'Closed Lost';

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contact_id?: string;
  contact_name?: string;
  close_date?: string;
  notes?: string;
  user_id?: string;
  org_id?: string;          
  owned_by?: string;        
  closed_by?: string;       
  created_at?: string;
  won: boolean;
}