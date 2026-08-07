import { apiClient } from "./apiClient";

import type {
  Profile,
  DisplayProfile,
  CompleteProfileDTO,
  UpdateProfileDTO,
  ProfileStatus,
} from "../types/profile";


export const fetchProfileAPI = async (): Promise<DisplayProfile> => {

  const result = await apiClient(
    "/api/profile/me",
    {
      method: "GET",
    }
  );

  return result.data as DisplayProfile;

};


export const completeProfileSetupAPI = async (
  profile: CompleteProfileDTO
): Promise<Profile> => {

  const result = await apiClient(
    "/api/profile/setup",
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    }
  );

  return result.data as Profile;

};


export const updateProfileAPI = async (
  profile: UpdateProfileDTO
): Promise<Profile> => {

  const result = await apiClient(
    "/api/profile/me",
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    }
  );

  return result.data as Profile;

};


export const updateProfileAvatarAPI = async (
  avatar_url: string | null
): Promise<{
  avatar_url: string | null;
}> => {

  const result = await apiClient(
    "/api/profile/me/avatar",
    {
      method: "PATCH",
      body: JSON.stringify({
        avatar_url,
      }),
    }
  );

  return result.data as {
    avatar_url: string | null;
  };

};


export const updateProfileStatusAPI = async (
  status: ProfileStatus
): Promise<{
  status: ProfileStatus;
}> => {

  const result = await apiClient(
    "/api/profile/me/status",
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );

  return result.data as {
    status: ProfileStatus;
  };

};