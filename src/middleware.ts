// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnAuth = nextUrl.pathname.startsWith("/sign-in") || nextUrl.pathname.startsWith("/sign-up");

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
