export interface DealsState {
  items: DealListItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const DEAL_STAGES = [ 
 'Prospecting',
 'Proposal',
 'Negotiation',
 'Closed Won',
 'Closed Lost',
] as const;

export type DealStage = typeof DEAL_STAGES[number]

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

export interface DealListItem extends Deal {

  owner: {
      id: string;
      first_name: string;
      last_name: string;
  };
  
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
  notes?: string;
  value?: number;      
}

