"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/prisma";
import {
  ProductFormValues,
  productFormSchema,
  NEW_CATEGORY_VALUE,
} from "@/src/shared/schemas/product-schema";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductFormValues) {
  const data = productFormSchema.parse(input);

  let categoryId = data.categoryId;

  if (categoryId === NEW_CATEGORY_VALUE) {
    const name = data.newCategoryName!.trim();
    const slug = slugify(name);

    // upsert: se duas pessoas criarem "Poltronas" ao mesmo tempo, não duplica
    const category = await db.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });

    categoryId = category.id;
  }

  await db.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      mercadoLivreLink: data.mercadoLivreLink || null,
      categoryId,
      images: {
        create: data.images.map((image, index) => ({
          url: image.url,
          path: image.path,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/products");
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}
