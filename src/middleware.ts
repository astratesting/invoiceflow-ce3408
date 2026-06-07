// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth";

const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*", "/clients/:path*", "/api/invoices/:path*", "/api/clients/:path*"],
};
