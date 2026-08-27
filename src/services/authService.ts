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
  console.log("🔥 OAUTH TOKEN EXISTS:", !!accessToken);
  console.log(
    "🔥 OAUTH TOKEN LENGTH:",
    accessToken?.length
  );

  return apiClient("/api/auth/oauth", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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