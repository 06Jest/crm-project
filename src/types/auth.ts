
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
}

export interface SignInDTO {
  email: string;
  password: string;
}


export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}