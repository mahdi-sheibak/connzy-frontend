"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { stringToJSONSchema } from "@/utils/zod-utils";
import { config } from "@/config";
import { PostResponse } from "@/schema";

const RequestSchema = z.object({
  fullName: z.string(),
  image: z.string(),
  bio: z.string(),
  acceptTerms: z.coerce.boolean(),
  phone: stringToJSONSchema.pipe(
    z.object({
      code: z.string(),
      number: z.string(),
    })
  ),
});

export async function createCustomerProfile(userInfo: FormData) {
  const accessToken = cookies().get("accessToken");

  const data = RequestSchema.parse(Object.fromEntries(userInfo.entries()));

  const customerProfileResponse = await fetch(
    `${config.apiBaseUrl}/customers/profile`,
    {
      method: "PUT",
      body: JSON.stringify({
        customer: {
          ...data,
          customerTC: String(data.acceptTerms),
        },
      }),
      headers: {
        Authorization: accessToken?.value ? `Bearer ${accessToken.value}` : "",
        "Content-Type": "application/json",
      },
    }
  );

  const customerProfile = PostResponse<unknown>(z.unknown()).parse(
    await customerProfileResponse.json()
  );
  return customerProfile;
}

export async function createExpertProfile(userInfo: FormData) {
  const accessToken = cookies().get("accessToken");

  const data = RequestSchema.parse(Object.fromEntries(userInfo.entries()));

  const expertProfileResponse = await fetch(
    `${config.apiBaseUrl}/experts/profile`,
    {
      method: "POST",
      body: JSON.stringify({
        expert: {
          ...data,
          expertTC: String(data.acceptTerms),
          services: [],
        },
      }),
      headers: {
        Authorization: accessToken?.value ? `Bearer ${accessToken.value}` : "",
        "Content-Type": "application/json",
      },
    }
  );

  const expertProfile = PostResponse<unknown>(z.unknown()).parse(
    await expertProfileResponse.json()
  );
  return expertProfile;
}
