import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        const email = user.email;
        
        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        // If user doesn't exist, create them
        if (!dbUser) {
          const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          
          // Ensure username is unique
          let username = emailPrefix;
          let counter = 1;
          while (true) {
            const existing = await prisma.user.findUnique({
              where: { username },
            });
            if (!existing) break;
            username = `${emailPrefix}${counter}`;
            counter++;
          }

          dbUser = await prisma.user.create({
            data: {
              email: email,
              name: user.name || username,
              image: user.image,
              username,
              theme: "light",
            },
          });
        }
        
        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        
        // Fetch user details from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, theme: true, bio: true },
        });
        
        if (dbUser) {
          session.user.username = dbUser.username || "";
          session.user.theme = dbUser.theme;
          session.user.bio = dbUser.bio || "";
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
