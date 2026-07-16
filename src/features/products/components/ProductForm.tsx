"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Switch } from "@/src/shared/components/ui/switch";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/src/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import {
  productFormSchema,
  NEW_CATEGORY_VALUE,
} from "@/src/shared/schemas/product-schema";
import { createProduct } from "../actions/create-product";
import { ProductImageUploader } from "./ImageUploader";

export interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  onSuccess?: () => void;
}

export function ProductForm({ categories, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<
    z.input<typeof productFormSchema>,
    unknown,
    z.output<typeof productFormSchema>
  >({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      categoryId: "",
      newCategoryName: "",
      mercadoLivreLink: "",
      images: [],
      featured: false, // 👈
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedCategory = form.watch("categoryId");
  const images = form.watch("images");

  function onSubmit(values: z.output<typeof productFormSchema>) {
    setFormError(null);

    startTransition(async () => {
      try {
        await createProduct(values);
        form.reset();
        router.refresh();
        onSuccess?.();
      } catch {
        setFormError("Não foi possível salvar o produto. Tente novamente.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert className="border-[var(--accent)]/40 bg-[var(--accent)]/10 text-foreground">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Poltrona Chesterfield" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Detalhes do produto, materiais, acabamento..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                    value={(field.value as string | number | undefined) ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mercadoLivreLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link no Mercado Livre</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://produto.mercadolivre.com.br/..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY_VALUE}>
                    + Criar nova categoria
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCategory === NEW_CATEGORY_VALUE && (
          <FormField
            control={form.control}
            name="newCategoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da nova categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Poltronas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Imagens</FormLabel>
              <FormDescription>Até 5 imagens, máximo 5MB cada.</FormDescription>
              <FormControl>
                <ProductImageUploader
                  value={images ?? []}
                  onChange={(next) =>
                    form.setValue("images", next, { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5">
                <FormLabel htmlFor="featured">Destaque</FormLabel>
                <FormDescription>
                  Exibir este produto no carrossel da home
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[var(--gold)] text-[var(--gold-foreground)] hover:bg-[var(--gold-hover)] sm:w-auto"
        >
          {isPending ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>
    </Form>
  );
}