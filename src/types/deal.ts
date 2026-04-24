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
  notes?: string;
  close_date?: string;
  won?: boolean;
  user_id?:string;
  created_at?: string;
  owned_by: string;
}