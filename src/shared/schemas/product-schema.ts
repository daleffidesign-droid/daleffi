import { z } from "zod";

export const NEW_CATEGORY_VALUE = "__new__";
export const MAX_PRODUCT_IMAGES = 5;

export const productImageSchema = z.object({
  url: z.string().url(),
  path: z.string().min(1),
});

export const productFormSchema = z
  .object({
    title: z.string().min(2, "Informe um título"),
    description: z.string().min(10, "Descreva o produto com mais detalhes"),
    price: z.coerce
      .number({ message: "Informe um preço válido" })
      .positive("O preço deve ser maior que zero"),
    categoryId: z.string().min(1, "Selecione uma categoria"),
    newCategoryName: z.string().optional(),
    mercadoLivreLink: z
      .string()
      .url("Informe uma URL válida")
      .optional()
      .or(z.literal("")),
    images: z
      .array(productImageSchema)
      .max(MAX_PRODUCT_IMAGES, `Máximo de ${MAX_PRODUCT_IMAGES} imagens`),
  })
  .refine(
    (data) =>
      data.categoryId !== NEW_CATEGORY_VALUE || !!data.newCategoryName?.trim(),
    { message: "Informe o nome da nova categoria", path: ["newCategoryName"] },
  );

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductImageValue = z.infer<typeof productImageSchema>;