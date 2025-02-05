import { User } from "next-auth";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string | null;
    email: string;
    surname?: string | null;
    completedOnboarding?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      username: string | null;
      email: string;
      name?: string | null;
      completedOnboarding: boolean;
      surname?: string | null;
      provider?: string
    };
  }
}
