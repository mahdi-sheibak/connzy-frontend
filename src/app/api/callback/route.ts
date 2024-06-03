import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  const accessToken = request.nextUrl.searchParams.get("accessToken");
  accessToken && cookies().set("accessToken", accessToken);

  return NextResponse.redirect(new URL("/~", request.url));
};
