import type { ChangePasswordDTO, SignInDTO, SignUpDTO } from "../types/auth";
import { apiClient } from "./apiClient";


export const signUpAPI = async (dto: SignUpDTO) => {
  return apiClient("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const adminSignInAPI = async (dto: SignInDTO) => {
  return apiClient("/api/auth/admin-signin", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const agentSignInAPI = async (dto: SignInDTO) => {
  return apiClient("/api/auth/agent-signin", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const getCurrentUserAPI = async () => {
  return apiClient("/api/auth/me", {
    method: "GET",
  });
};


export const refreshAPI = async () => {
  return apiClient("/api/auth/refresh", {
    method: "PATCH",
  });
};


export const changePasswordAPI = async (
  dto: ChangePasswordDTO
) => {
  return apiClient("/api/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
};


export const signOutAPI = async () => {
  return apiClient("/api/auth/signout", {
    method: "DELETE",
  });
};