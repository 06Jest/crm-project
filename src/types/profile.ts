import type { Roles } from "./global";
import type { OrganizationType } from "./organization";

export interface ProfileState {
  profile: DisplayProfile | null;
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
  onboarding_completed: boolean;
  job_title?: string; 
  status: ProfileStatus;
  avatar_url?: string;  
  created_at?: string;
  deleted_at?: string;
  last_login?: string;
}

export interface DisplayProfile {
    id: string;
    avatar_url?: string;
    first_name: string;
    last_name: string;
    display_name?: string;
    email: string;
    display_id?: string;
    position?: string;
    status: ProfileStatus;
    created_at: string;
    onboarding_completed: boolean;
    last_login?: string;
    job_title?: string;
    membership?: {
      id: string;
      display_id: string;
      role: Roles;
      status: string;
      created_at: string;
      org?: {
        id: string;
        display_id: string;
        name: string;
        logo_url?: string;
        type: OrganizationType;
    };
  }[];
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
  job_title?: string;
}

export type CreateInitialProfileDTO = {
  id: string;
  email: string;
};

export interface CompleteProfileDTO {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  job_title?: string;
}

export interface UpdateProfileDTO {
  first_name: string;
  last_name: string;
  display_name: string;
  job_title: string;
}

export interface PasswordChangeValues {
    currentPassword: string;
    newPassword: string;
}
