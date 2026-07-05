import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, ownerRole, adminRole, sellerRole } from "../permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  plugins: [
    adminClient({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        seller: sellerRole,
      },
    }),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
