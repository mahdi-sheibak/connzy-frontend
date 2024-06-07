"use server";

import { config } from "@/config";

export const getProfile = async (accessToken: string) => {
  const profileResponse = await fetch(`${config.apiBaseUrl}/users/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profileData = await profileResponse.json();
  return profileData;
};
