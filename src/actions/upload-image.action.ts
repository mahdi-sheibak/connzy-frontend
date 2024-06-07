"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { config } from "@/config";

const UploadImageResponseSchema = z.object({
  data: z.object({
    _id: z.string(),
  }),
});

export const uploadImageAction = async (formData: FormData) => {
  const accessToken = cookies().get("accessToken");

  const uploadImageResponse = await fetch(
    `${config.apiBaseUrl}/images/upload-profile-image`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken?.value}`,
      },
    }
  );

  const uploadImage = await uploadImageResponse.json();
  return UploadImageResponseSchema.parse(uploadImage);
};
