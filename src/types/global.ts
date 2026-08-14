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

export const PRODUCT_TYPES = [
  "Software",
  "SaaS",
  "Hardware",
  "Physical Products",
  "Digital Products",
  "Professional Services",
  "Consulting Services",
  "IT Services",
  "Marketing & Advertising Services",
  "Financial Services",
  "Healthcare Services",
  "Education & Training",
  "Logistics & Transportation Services",
  "Manufacturing",
  "Retail",
  "Wholesale",
  "Subscription Services",
  "Marketplace",
  "Other",
] as const;

export type ProductType = typeof PRODUCT_TYPES[number];

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

export const JOB_TITLE_OPTIONS = [
  // Sales
  "Sales Representative",
  "Sales Executive",
  "Sales Associate",
  "Sales Consultant",
  "Sales Manager",
  "Regional Sales Manager",
  "Sales Director",
  "Vice President of Sales",
  "Business Development Representative",
  "Business Development Manager",
  "Account Executive",

  // Account Management
  "Account Manager",
  "Senior Account Manager",
  "Key Account Manager",
  "Client Relationship Manager",

  // Customer Success
  "Customer Success Representative",
  "Customer Success Specialist",
  "Customer Success Manager",
  "Customer Experience Manager",
  "Customer Support Representative",
  "Customer Support Specialist",
  "Customer Support Manager",

  // Marketing
  "Marketing Coordinator",
  "Marketing Specialist",
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Growth Manager",

  // Operations
  "Operations Coordinator",
  "Operations Manager",
  "Business Operations Manager",
  "Revenue Operations Manager",
  "Sales Operations Manager",

  // Leadership
  "Team Lead",
  "Department Manager",
  "General Manager",
  "Chief Executive Officer",
  "Chief Operating Officer",
  "Founder",
  "Owner",
] as const;

export const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1,000 employees",
  "1,001-5,000 employees",
  "5,001-10,000 employees",
  "10,001+ employees",
] as const;

export type CompanySize = typeof COMPANY_SIZES[number];

export type JobTitles = (typeof JOB_TITLE_OPTIONS)[number];


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
  "owner",  
  "manager",
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
