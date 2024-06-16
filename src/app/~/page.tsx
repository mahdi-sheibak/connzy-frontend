import { getProfile } from "@/actions/profile.action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const accessToken = cookies().get("accessToken");

  if (accessToken) {
    const profile = await getProfile(accessToken.value);
    profile.data.profile === "customer"
      ? redirect("/~/customer")
      : redirect("/~/expert");
  }

  return <></>;
}
