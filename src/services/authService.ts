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

// export const oauthLoginAPI = async (accessToken: string) => {
//   return apiClient("/api/auth/oauth", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
// };

export const oauthLoginAPI = async (accessToken: string) => {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/oauth`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.error ??
        data?.message ??
        `API Error: ${response.status}`
      );
    }

    return data;
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