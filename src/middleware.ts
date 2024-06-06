import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getProfile } from "@/actions/profile";

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get("accessToken");

  if (accessToken?.value) {
    const profile = await getProfile(accessToken.value);
    if (!profile?.data?.expert) {
      return NextResponse.redirect(new URL("/choose-profile", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/~/:path*",
};
