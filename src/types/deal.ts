export interface DealsState {
  items: Deal[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

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
  org_id: string; 
  value: number;
  created_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_by: string | null;
  close_date?: string;          
  closed_by?: string;       
}

export interface AddDeal {
  contact_id: string;
  title: string;
  stage: DealStage;
  notes?: string;
  value: number;      
}

export interface UpdateDeal {
  title?: string;
  stage?: DealStage;
  notes?: string;
  value?: number;      
}

