"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/prisma";
import { auth } from "../../auth/lib/auth";

const siteSettingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Use DDD + número, só dígitos (ex: 35997613373)"),
  contactEmail: z.string().trim().email("E-mail inválido"),
  instagramHandle: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9._]*$/, "Sem @ ou espaços, só o usuário")
    .optional()
    .or(z.literal("")),
  addressLine: z.string().trim().max(160).optional().or(z.literal("")),
});

export type SiteSettingsFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof siteSettingsSchema>, string>>;
};

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return {
      status: "error",
      message: "Você não tem permissão para essa ação.",
    };
  }

  const parsed = siteSettingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    contactEmail: formData.get("contactEmail"),
    instagramHandle: formData.get("instagramHandle"),
    addressLine: formData.get("addressLine"),
  });

  if (!parsed.success) {
    const errors: SiteSettingsFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Confira os campos destacados.",
      errors,
    };
  }

  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: { ...parsed.data },
  });

  updateTag("site-settings");

  return { status: "success", message: "Informações atualizadas com sucesso." };
}
