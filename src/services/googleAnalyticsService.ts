import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;


export const initializeAnalytics = () => {
  if (!MEASUREMENT_ID) {
    console.warn('Google Analytics ID not found in environment variables');
    return;
  }

  ReactGA.initialize(MEASUREMENT_ID);
  console.log('Google Analytics initialized');
};

export const trackPageView = (path: string) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: document.title,
  });
};


export const trackEvent = (
  eventName: string,
  eventData?: Record<string, unknown>
) => {
  ReactGA.event(eventName, eventData || {});
};


export const trackSuperAdminLogin = (email: string) => {
  trackEvent('super_admin_login_attempt', { email });
};

export const trackUserBanAttempt = (userId: string) => {
  trackEvent('super_admin_ban_user_attempt', { user_id: userId });
};

export const trackUserDeleteAttempt = (userId: string, email: string) => {
  trackEvent('super_admin_delete_user_attempt', { user_id: userId, email });
};

export const trackOrgPauseAttempt = (orgId: string, orgName: string) => {
  trackEvent('super_admin_pause_org_attempt', { org_id: orgId, org_name: orgName });
};

export const trackOrgDeleteAttempt = (orgId: string, orgName: string) => {
  trackEvent('super_admin_delete_org_attempt', { org_id: orgId, org_name: orgName });
};

export const setAnalyticsUser = (userId: string, userRole: string) => {
  ReactGA.gtag('config', MEASUREMENT_ID, {
    user_id: userId,
  });

  ReactGA.gtag('event', 'user_engagement', {
    'user_role': userRole,
  });
};

export default {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackSuperAdminLogin,
  trackUserBanAttempt,
  trackUserDeleteAttempt,
  trackOrgPauseAttempt,
  trackOrgDeleteAttempt,
  setAnalyticsUser,
};