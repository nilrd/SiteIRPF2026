import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/painel-nb-2025",
    },
  }
);

export const config = {
  matcher: [
    "/painel-nb-2025/dashboard/:path*",
    "/painel-nb-2025/leads/:path*",
    "/painel-nb-2025/blog/:path*",
    "/painel-nb-2025/chat-ia/:path*",
    "/painel-nb-2025/campanhas/:path*",
  ],
};
