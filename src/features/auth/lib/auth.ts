import { db } from "@/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, ownerRole, adminRole, sellerRole } from "../permissions";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "owner",
        input: false,
      },
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        seller: sellerRole,
      },
      defaultRole: "owner",
      adminRoles: ["owner", "admin"],
    }),
  ],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
