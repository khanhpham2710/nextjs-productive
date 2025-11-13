import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { generateFromEmail } from "unique-username-generator";

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    error: "/sign-in",
    signIn: "/sign-in",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const username = generateFromEmail(profile.email, 5);
        return {
          id: profile.sub,
          username,
          name: profile.given_name ? profile.given_name : profile.name,
          surname: profile.family_name ? profile.family_name : "",
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      async profile(profile) {
        const username = generateFromEmail(profile.email!, 5);
        const fullName = profile.name?.split(" ") || null;

        if (fullName) {
          return {
            id: profile.id.toString(),
            username: profile.login ? profile.login : username,
            name: fullName.at(0),
            surname: fullName.at(1),
            email: profile.email,
            image: profile.avatar_url,
          };
        } else {
          return {
            id: profile.id.toString(),
            username: profile.login ? profile.login : username,
            email: profile.email,
            image: profile.avatar_url,
          };
        }
      },
    }),
    Credentials({
      name: "credential",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Name" },
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          throw new CustomError("ERRORS.INVALID_CREDIDENTIALS");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new CustomError("ERRORS.NO_USER_API");
        }

        const passwordMatch = await bcrypt.compare(
          String(credentials.password),
          user.hashedPassword
        );

        if (!passwordMatch) {
          throw new Error(
            "The entered password is incorrect, please enter the correct one."
          );
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
        session.user.surname = token.surname;
        session.user.completedOnboarding = !!token.completedOnboarding;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: token.id,
        },
        include: {
          accounts: true,
        },
      });

      if (user) {
        session.user.image = user.image;
        session.user.completedOnboarding = user.completedOnboarding;
        session.user.username = user.username;
        session.user.name = user.name;
        session.user.surname = user.surname

        if (user.accounts && user.accounts.length > 0) {
          session.user.provider = user.accounts[0].provider;
        }
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: String(token.email),
        },
      });

      if (!dbUser) {
        token.id = String(user!.id);
        return token;
      }


      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
});
