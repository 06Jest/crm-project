const SETTINGS_KEY = 'crm_settings';

export interface NotificationSettings {
  emailNewContact: boolean;
  emailNewDeal: boolean;
  emailNewMessage: boolean;
  emailWeeklyReport: boolean;
  inAppNewMessage: boolean;
  inAppNewLead: boolean;
}

export const defaultNotifications: NotificationSettings = {
  emailNewContact: true,
  emailNewDeal: true,
  emailNewMessage: true,
  emailWeeklyReport: false,
  inAppNewMessage: true,
  inAppNewLead: true,
};

export const loadSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? { ...defaultNotifications, ...JSON.parse(saved) }
     : defaultNotifications; 
  } catch {
    return defaultNotifications;
  }
};

export const saveSettings = (settings: NotificationSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

