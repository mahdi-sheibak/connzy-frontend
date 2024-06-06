"use server";

import { config } from "@/config";
import { z } from "zod";

export const loginAction = async () => {
  const authDataResponse = await fetch(
    `${config.apiBaseUrl}/oauth/google?link=${config.appUrl}/api/callback`
  );
  const authData = await authDataResponse.json();

  const validateAuthData = z
    .object({
      data: z.string(),
    })
    .parse(authData);
  console.log({ validateAuthData });

  return validateAuthData;
};
