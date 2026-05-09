export type ActivityType = 'call' | 'email' | 'meeting' | 'note' |  'sms' ;
export type ActivityDirection = 'inbound' | 'outbound';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  body?: string;
  contact_name?: string;
  contact_id?: string;
  direction?: ActivityDirection;
  duration?: number;
  completed: boolean;
  user_id?: string;
  org_id?: string;          
  logged_by?: string;       
  created_at?: string;
  scheduled_at: string;
}

