"use server";

import { fetchApi } from "@/actions/api";
import { config } from "@/config";
import { z } from "zod";

export const loginAction = async () => {
  const authData = await fetchApi(
    `/oauth/google?link=${config.appUrl}/api/callback`
  );
  const validateAuthData = z
    .object({
      data: z.string(),
    })
    .parse(authData);
  console.log({ validateAuthData });

  return validateAuthData;
};
