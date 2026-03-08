import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/painel-nb-2025",
  },
});

export const config = {
  matcher: ["/painel-nb-2025/dashboard/:path*", "/painel-nb-2025/leads/:path*", "/painel-nb-2025/blog/:path*", "/painel-nb-2025/chat-ia/:path*", "/painel-nb-2025/campanhas/:path*"],
};
