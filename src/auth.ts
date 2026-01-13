import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";

import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When a user signs in (via credentials or Google), ensure we have
      // a corresponding User document and store its id on the JWT.
      if (user) {
        try {
          await connectDB();

          const email =
            (token.email as string | undefined) ??
            ((user as any).email as string | undefined);

          if (email) {
            let dbUser = await User.findOne({ email });

            if (!dbUser) {
              dbUser = await User.create({
                name: (user as any).name,
                email,
                image: (user as any).image,
              });
            }

            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("JWT callback error", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
