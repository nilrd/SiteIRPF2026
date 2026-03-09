import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) return null;
        if (credentials.username !== adminUsername) return null;

        // SHA-256 hex — sem $ no hash, seguro para env vars
        const inputHash = crypto
          .createHash("sha256")
          .update(credentials.password)
          .digest("hex");

        let isValid = false;
        try {
          isValid = crypto.timingSafeEqual(
            Buffer.from(inputHash),
            Buffer.from(adminPasswordHash)
          );
        } catch {
          return null;
        }

        if (!isValid) return null;

        return { id: "1", name: "Admin NSB", email: "nilson.brites@gmail.com" };
      },
    }),
  ],
  pages: {
    signIn: "/painel-nb-2025",
  },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
