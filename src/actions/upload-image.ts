"use server";
import { config } from "@/config";
import { cookies } from "next/headers";

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
  return uploadImage;
};
