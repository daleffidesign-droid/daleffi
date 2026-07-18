"use server";

import { db } from "@/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PRODUCTS_PATH = "/products";

const productImageSchema = z.object({
  url: z.string().url(),
  path: z.string(),
});

const updateProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  categoryId: z.string().uuid("Categoria inválida"),
  mercadoLivreLink: z.string().url().optional().or(z.literal("")),
  images: z.array(productImageSchema).default([]),
  featured: z.boolean().default(false),
  weightKg: z.coerce
    .number()
    .positive("Peso deve ser maior que zero")
    .optional(),
  heightCm: z.coerce
    .number()
    .positive("Altura deve ser maior que zero")
    .optional(),
  widthCm: z.coerce
    .number()
    .positive("Largura deve ser maior que zero")
    .optional(),
  lengthCm: z.coerce
    .number()
    .positive("Comprimento deve ser maior que zero")
    .optional(),
});

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    await db.product.delete({ where: { id } });
    revalidatePath(PRODUCTS_PATH);
    return { success: true };
  } catch (error) {
    console.error("[deleteProductAction]", error);
    return { success: false, error: "Não foi possível excluir o produto." };
  }
}

export async function toggleProductStatusAction(
  id: string,
  active: boolean,
): Promise<ActionResult> {
  try {
    await db.product.update({
      where: { id },
      data: { active },
    });
    revalidatePath(PRODUCTS_PATH);
    return { success: true };
  } catch (error) {
    console.error("[toggleProductStatusAction]", error);
    return { success: false, error: "Não foi possível atualizar o status." };
  }
}

export async function updateProductAction(
  input: z.infer<typeof updateProductSchema>,
): Promise<ActionResult> {
  const parsed = updateProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const {
    id,
    title,
    description,
    price,
    categoryId,
    mercadoLivreLink,
    images,
    featured,
    weightKg,
    heightCm,
    widthCm,
    lengthCm,
  } = parsed.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          title,
          description,
          price,
          categoryId,
          mercadoLivreLink: mercadoLivreLink || null,
          featured,
          weightKg: weightKg ?? null,
          heightCm: heightCm ?? null,
          widthCm: widthCm ?? null,
          lengthCm: lengthCm ?? null,
        },
      });

      // substitui as imagens pela lista atual, preservando a ordem
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((image, index) => ({
            productId: id,
            url: image.url,
            path: image.path,
            order: index,
          })),
        });
      }
    });

    revalidatePath(PRODUCTS_PATH);
    return { success: true };
  } catch (error) {
    console.error("[updateProductAction]", error);
    return { success: false, error: "Não foi possível salvar as alterações." };
  }
}
