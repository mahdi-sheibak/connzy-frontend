"use server";

import { fetchApi } from "@/actions/api";
import { z } from "zod";

export const loginAction = async () => {
  const authData = await fetchApi(
    "/oauth/google?link=http://localhost:3000/api/callback"
  );
  const validateAuthData = z
    .object({
      data: z.string(),
    })
    .parse(authData);
  console.log({ validateAuthData });

  return validateAuthData;
};
