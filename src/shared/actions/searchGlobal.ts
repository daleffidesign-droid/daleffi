// src/features/search/actions/search-global.ts

"use server";

import { db } from "@/prisma";

export async function searchGlobal(query: string) {
  const normalized = query.trim();

  if (!normalized || normalized.length < 2) {
    return {
      products: [],
      users: [],
    };
  }

  const q = {
    contains: normalized,
    mode: "insensitive" as const,
  };

  const [products, users] = await Promise.all([
    // PRODUTOS
    db.product.findMany({
      where: {
        OR: [{ title: q }, { description: q }],
      },

      select: {
        id: true,
        title: true,
        price: true,

        category: {
          select: {
            name: true,
          },
        },
      },

      take: 5,
    }),

    // COLABORADORES (users)
    db.user.findMany({
      where: {
        OR: [{ name: q }, { email: q }, { cpf: q }],
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },

      take: 5,
    }),
  ]);

  return {
    products,
    users,
  };
}
