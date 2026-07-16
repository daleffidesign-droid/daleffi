"use server";

import { db } from "@/prisma";

export async function getFeaturedProducts() {
  const products = await db.product.findMany({
    where: { active: true, featured: true },
    orderBy: { featuredOrder: "asc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    take: 12,
  });

  return products.map((product) => ({
    id: product.id,
    title: product.title,
    price: Number(product.price),
    imageUrl: product.images[0]?.url ?? null,
  }));
}

export type FeaturedProduct = Awaited<
  ReturnType<typeof getFeaturedProducts>
>[number];
