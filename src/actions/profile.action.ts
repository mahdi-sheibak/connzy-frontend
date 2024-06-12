"use server";

import { z } from "zod";
import { config } from "@/config";

const ResponseSchema = z.object({
  data: z.object({
    email: z.string(),
    fullName: z.string().nullable(),
    expert: z.string().nullable(),
    profile: z.any().nullable(),
  }),
});

export const getProfile = async (accessToken: string) => {
  const profileResponse = await fetch(`${config.apiBaseUrl}/users/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profileData = ResponseSchema.parse(await profileResponse.json());
  return profileData;
};
