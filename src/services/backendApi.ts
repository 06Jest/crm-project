import { supabase } from "./supabase";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: object
): Promise<T> => {
  const token = await getAuthToken();

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) }: {}),
  });

  if (!response.ok) {

    const error = await response.json();
    throw new Error(error.error || 'Backend request failed');
  }

  const data = await response.json();
  return data.data as T;
}

export const aiApi = {
  getDashboardSummary: (data: object) => 
    apiCall<string>('/api/ai/dashboard-summary', 'POST', data),
  getContactIntel: (data: object) =>
    apiCall<string>('/api/ai/contact-intel', 'POST', data),

  getDealPrediction: (data: object) =>
    apiCall<string>('/api/ai/deal-predict', 'POST', data),

  composeMessage: (data: object) =>
    apiCall<string>('/api/ai/compose', 'POST', data),

  chat: (data: object) =>
    apiCall<string>('/api/ai/chat', 'POST', data),
};

export const emailApi = {
  send: (data: {
    to: string;
    subject: string; 
    body: string; 
    isHtml?: boolean 
  }) => apiCall<void> ('/api/email/send', 'POST', data),

  sendInvite: (data: {
    to: string;
    agentName: string;
    employeeId: string;
    tempPassword: string;
    adminName: string;
    orgName: string;
  }) => apiCall<void>('/api//email/invite', 'POST', data),

  sendWeeklySummary: (data: {
    to: string;
    recipientName: string;
    stats: {
      newContacts: number;
      newLeads: number;
      dealsWon: number;
      revenue: number;
      activitiesLogged: number;
    };
  }) => apiCall<void>('/api/email/Weekly-summary', 'POST', data),

  verify: () => 
    apiCall<{ message: string }>('/api/email/verify', 'POST'),
};

export const smsApi = {
  send: (data: { 
    to: string; 
    body: string 
    contactName?: string;
  }) =>
    apiCall<{
      sid: string;
      status: string;
      simulated: true;
    }>('/api/sms/send', 'POST', data),
  
  getStatus: (sid: string) =>
    apiCall<{
      status: string;
      simulated: true
    }>(`/api/sms/status/${sid}`,'GET'),

  getHistory: (contactName: string) =>
    apiCall<string[]>(
      `/api/sms/history/${encodeURIComponent(contactName)}`,
      'GET'
    ),
};

export const stripeApi = {
  getPlans: () => apiCall<[]>('/api/stripe/plans', 'GET'),

  getSubscription: () => 
    apiCall<{
      plan: string;
      status: string;
      current_period_end?: string;
      cancel_at_period_end?: boolean;
    }>('api/stripe/subscription', 'GET'),

  createCheckout: (priceId: string) =>
    apiCall<{ url: string }>('/api/stripe/checkout', 'POST', { priceId }),

  createPortal: () =>
    apiCall<{ url: string }>('/api/stripe/portal', 'POST'),
};