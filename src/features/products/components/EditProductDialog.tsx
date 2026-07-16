// src/features/products/components/EditProductDialog.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Label } from "@/src/shared/components/ui/label";
import { Button } from "@/src/shared/components/ui/button";
import { Switch } from "@/src/shared/components/ui/switch";
import { toast } from "sonner";
import { updateProductAction } from "../actions/update-products";
import { ProductImageUploader } from "./ImageUploader";
import type { ProductImageValue } from "@/src/shared/schemas/product-schema";

type Category = { id: string; name: string };

type EditableProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  categoryId: string;
  mercadoLivreLink: string | null;
  category: Category;
  images: ProductImageValue[];
  featured: boolean;
};

export function EditProductDialog({
  product,
  open,
  onOpenChange,
}: {
  product: EditableProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    mercadoLivreLink: product.mercadoLivreLink ?? "",
    images: product.images,
    featured: product.featured,
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: product.title,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        mercadoLivreLink: product.mercadoLivreLink ?? "",
        images: product.images,
        featured: product.featured,
      });
    }
  }, [open, product]);

  function handleSubmit() {
    startTransition(async () => {
      const result = await updateProductAction({
        id: product.id,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        mercadoLivreLink: form.mercadoLivreLink,
        images: form.images,
        featured: form.featured,
      });

      if (result.success) {
        toast.success("Produto atualizado.");
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mercadoLivreLink">Link Mercado Livre</Label>
            <Input
              id="mercadoLivreLink"
              value={form.mercadoLivreLink}
              onChange={(e) =>
                setForm({ ...form, mercadoLivreLink: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Imagens</Label>
            <ProductImageUploader
              value={form.images}
              onChange={(next) => setForm({ ...form, images: next })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="featured">Destaque</Label>
              <p className="text-muted-foreground text-xs">
                Exibir este produto no carrossel da home
              </p>
            </div>
            <Switch
              id="featured"
              checked={form.featured}
              onCheckedChange={(checked) =>
                setForm({ ...form, featured: checked })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
