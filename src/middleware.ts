import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { getProfile } from "@/actions/profile.action";

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get("accessToken");

  if (accessToken?.value) {
    try {
      const profile = await getProfile(accessToken.value);

      console.log({ profile });

      const shouldChooseProfile = Boolean(
        !profile.data.profile && request.nextUrl.pathname !== "/choose-profile"
      );

      return shouldChooseProfile
        ? NextResponse.redirect(new URL("/choose-profile", request.url))
        : NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/api/auth/logout", request.url));
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/~/:path*", "/choose-profile"],
};
