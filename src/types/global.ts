export const INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Banking",
  "Construction",
  "Consulting",
  "Consumer Goods",
  "Education",
  "Energy",
  "Engineering",
  "Entertainment",
  "Finance",
  "Food & Beverage",
  "Government",
  "Healthcare",
  "Hospitality",
  "Human Resources",
  "Information Technology",
  "Insurance",
  "Legal",
  "Logistics",
  "Manufacturing",
  "Marketing & Advertising",
  "Media",
  "Mining",
  "Non-Profit",
  "Pharmaceutical",
  "Real Estate",
  "Retail",
  "Telecommunications",
  "Tourism",
  "Transportation",
  "Utilities",
  "Wholesale",
  "Other",
] as const;

export const DEPARTMENTS = [
  "Administration",
  "Business Development",
  "Customer Service",
  "Engineering",
  "Executive",
  "Finance",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Marketing",
  "Operations",
  "Procurement",
  "Product Management",
  "Project Management",
  "Quality Assurance",
  "Research & Development",
  "Sales",
  "Security",
  "Support",
  "Training",
  "Warehouse",
  "Other",
] as const;

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

export const ROLES = [
  "admin",
  "agent",
] as const;

export type Roles = typeof ROLES[number];

export const PREFERRED_CONTACT_TIMES = [
  "Morning",
  "Afternoon",
  "Evening",
  "Anytime",
] as const;

export type PreferredTime = typeof PREFERRED_CONTACT_TIMES[number];
