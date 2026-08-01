import type { Roles } from "./global";
import type { DisplayProfile } from "./profile";

export interface UserState {
  user: DisplayProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}


export interface SignUpDTO {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  org_name: string;
}

export interface SignInDTO {
  email: string;
  password: string;
}


export interface AccessTokenPayload {
  sub: string;
  role: Roles;
  orgId: string | null;
}


export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}