import { z } from "zod";

export const NEW_CATEGORY_VALUE = "__new__";
export const MAX_PRODUCT_IMAGES = 5;

export const productImageSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
});

export const productFormSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(1, "Descrição obrigatória"),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  categoryId: z.string(),
  newCategoryName: z.string().optional(),
  mercadoLivreLink: z.string().url().optional().or(z.literal("")),
  images: z.array(productImageSchema),
  featured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductImageValue = z.infer<typeof productImageSchema>;
