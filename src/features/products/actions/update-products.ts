"use server";

import { db } from "@/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PRODUCTS_PATH = "/products";

const updateProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  categoryId: z.string().uuid("Categoria inválida"),
  mercadoLivreLink: z.string().url().optional().or(z.literal("")),
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
  active: boolean
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
  input: z.infer<typeof updateProductSchema>
): Promise<ActionResult> {
  const parsed = updateProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { id, title, description, price, categoryId, mercadoLivreLink } =
    parsed.data;

  try {
    await db.product.update({
      where: { id },
      data: {
        title,
        description,
        price,
        categoryId,
        mercadoLivreLink: mercadoLivreLink || null,
      },
    });
    revalidatePath(PRODUCTS_PATH);
    return { success: true };
  } catch (error) {
    console.error("[updateProductAction]", error);
    return { success: false, error: "Não foi possível salvar as alterações." };
  }
}