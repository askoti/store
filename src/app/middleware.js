// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Only protect the admin route
  if (path.startsWith("/admin")) {
    const session = request.cookies.get("admin_session")?.value;

    // If no session and not already on the login page, redirect to login
    if (!session && path !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};