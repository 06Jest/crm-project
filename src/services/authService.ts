import type { ChangePasswordDTO, SignInDTO, SignUpDTO } from "../types/auth";
import { apiClient } from "./apiClient";


export const signUpAPI = async (dto: SignUpDTO) => {
  return apiClient("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const signInAPI = async (dto: SignInDTO) => {
  return apiClient("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(dto),
  });
};


export const getCurrentUserAPI = async () => {
  return apiClient("/api/auth/me", {
    method: "GET",
  });
};



export const changePasswordAPI = async (
  dto: ChangePasswordDTO
) => {
  return apiClient("/api/auth/me/change-password", {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
};


export const signOutAPI = async () => {
  return apiClient("/api/auth/signout", {
    method: "DELETE",
  });
};