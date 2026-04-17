export type ActivityType = 'call' | 'email' | 'meeting' | 'note' |  'sms' ;
export type ActivityDirection = 'inbound' | 'outbound';

export interface Activity {
  id:string;
  type: ActivityType;
  subject: string;
  body?: string;
  contact_id?: string;
  contact_name?: string;
  direction?: ActivityDirection;
  duration?: number;
  scheduled_at?: string;
  completed?: boolean;
  user_id?: string;
  created_at?: string;
}

