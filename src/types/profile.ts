import type { Roles } from "./global";

export interface ProfileState {
  items: ProfileIDName[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const PROFILE_STATUSES = [
  "pending",
  "inactive",
  "active",
  "banned",
  "deleted",
] as const;

export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export interface Profile {
  id: string;
  display_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: Roles;
  org_id: string;
  employee_id?: string;  
  position?: string; 
  status: ProfileStatus;
  avatar_url?: string;  
  created_at?: string;
  deleted_at?: string;
  last_login?: string;
}

export interface DisplayProfile {
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_id?: string;
  position?: string;
  avatar_url?: string;
}

export interface ProfileIDName {
  id: string;
  display_name: string;
}

export interface AddProfileDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  phone?: string;
  position?: string;
  org_id: string;
}

export interface AddAdminProfileDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  org_id: string;
}

export interface UpdateProfileDTO {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  position?: string;
}
