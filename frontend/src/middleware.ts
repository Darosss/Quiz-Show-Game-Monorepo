import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN_NAME } from "./api/fetch";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN_NAME)?.value;
  const path = request.nextUrl.pathname;

  if (token && (path === "/auth/login" || path === "/auth/register"))
    return NextResponse.redirect(new URL("/", request.url));
  else if (!token && (path === "/auth/login" || path === "/auth/register"))
    return;
  else if (token) return;
  else return NextResponse.redirect(new URL("/auth/login", request.url));
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
