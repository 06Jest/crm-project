export const SOURCES = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Google Search",
  "Google Ads",
  "Email Campaign",
  "Cold Call",
  "Trade Show",
  "Webinar",
  "Partner",
  "Walk-in",
  "WhatsApp",
  "Messenger",
  "Personal Network",
  "Direct Conversation",
  "Networking Event",
  "Conference",
  "Friend",
  "Family",
  "Other",
] as const;

export type Source = typeof SOURCES[number];

export const SUFFIXES = [
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
] as const;

export type Suffix = (typeof SUFFIXES)[number] | null;

export const GENDERS = [
  "Male",
  "Female",
  "Prefer not to say",
] as const;

export type Gender = typeof GENDERS[number];

export const PRIORITIES = [
  "Highest",
  "High",
  "Low",
] as const;

export type Priority = typeof PRIORITIES[number];