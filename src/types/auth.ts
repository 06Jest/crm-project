import type { Role } from "./profile";
import type { Profile } from "./profile";

export interface UserState {
  user: Profile | null;
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
  role: Role;
  orgId: string | null;
}


export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}