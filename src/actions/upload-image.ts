"use server";

import { fetchApi } from "@/actions/api";
import { cookies } from "next/headers";

export const uploadImageAction = async (formData: FormData) => {
  const accessToken = cookies().get("accessToken");

  return fetchApi("/images/upload-profile-image", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
    },
  });
};
