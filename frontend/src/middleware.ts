import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const loginPath = "/login";
const registerPath = "/register";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token_qs")?.value;

  const path = request.nextUrl.pathname;
  if (token && (path === loginPath || path === registerPath))
    return NextResponse.redirect(new URL("/", request.url));
  else if (!token && !(path === loginPath || path === registerPath)) return;
  else if (token) return;
  else return NextResponse.redirect(new URL(loginPath, request.url));
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
