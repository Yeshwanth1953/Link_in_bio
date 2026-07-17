import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      theme: string;
      bio: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
  }
}
