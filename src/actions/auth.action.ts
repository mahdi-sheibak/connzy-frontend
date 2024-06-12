"use server";
import { redirect } from "next/navigation";

import { config } from "@/config";
import { GoogleLoginSchema } from "@/schema";

export const loginAction = async () => {
  const authDataResponse = await fetch(
    `${config.apiBaseUrl}/oauth/google?link=${config.appUrl}/api/callback`
  );
  const validateAuthData = GoogleLoginSchema.parse(
    await authDataResponse.json()
  );

  redirect(validateAuthData.data);
};
