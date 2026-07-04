import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const ownerRole = ac.newRole({
  ...adminAc.statements,
});

export const adminRole = ac.newRole({
  ...adminAc.statements,
});

export const sellerRole = ac.newRole({});
