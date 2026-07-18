import { unstable_cache } from "next/cache";
import { db } from "@/prisma";

export const getSiteSettings = unstable_cache(
  async () => {
    const settings = await db.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    return (
      settings ?? {
        id: "singleton",
        whatsappNumber: "35997613373",
        contactEmail: "marc.fran38@gmail.com",
        instagramHandle: "daleffi_desing",
        addressLine: "Poços de Caldas, MG - Brasil",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );
  },
  ["site-settings"],
  { tags: ["site-settings"] },
);