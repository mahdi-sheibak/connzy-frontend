import { type NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

export const GET = (request: NextRequest) => {
  cookies().delete("accessToken");

  return NextResponse.redirect(new URL("/", request.url));
};
