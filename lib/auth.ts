import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

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

        try {
          const user = await prisma.adminUser.findUnique({
            where: { username: credentials.username, active: true },
          });

          if (!user) return null;

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!isValidPassword) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email ?? undefined,
          };
        } catch {
          return null;
        }
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
