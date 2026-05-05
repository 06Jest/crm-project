declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}


export const trackPageView = (path: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'page_view', {
    page_path: path,
  });
};


export const trackAIQuery = (feature: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'ai_query', {
    feature, // 'dashboard_summary' | 'contact_intel' | 'deal_predict' | 'compose' | 'chat'
  });
};


export const trackMessageSent = () => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'message_sent');
};


export const trackThemeToggle = (mode: 'dark' | 'light') => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'theme_toggle', { mode });
};


export const trackCSVExport = (type: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'csv_export', { type });
};


export const trackFeature = (featureName: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', 'feature_used', { feature: featureName });
};