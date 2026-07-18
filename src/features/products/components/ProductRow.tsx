"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  MoreVertical,
  Pencil,
  Trash2,
  EyeOff,
  Eye,
  ImageIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/src/shared/components/ui/alert-dialog";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import {
  deleteProductAction,
  toggleProductStatusAction,
} from "../actions/update-products";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EditProductDialog } from "./EditProductDialog";

type ProductRowData = {
  id: string;
  title: string;
  description: string;
  price: string;
  active: boolean;
  categoryId: string;
  mercadoLivreLink: string | null;
  category: { id: string; name: string };
  images: { url: string; path: string }[];
  featured: boolean;
  weightKg: number | null;
  heightCm: number | null;
  widthCm: number | null;
  lengthCm: number | null;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductRow({ product }: { product: ProductRowData }) {
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const thumbnail = product.images[0]?.url;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (result.success) {
        toast.success("Produto excluído.");
        setDeleteOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggleStatus() {
    startTransition(async () => {
      const result = await toggleProductStatusAction(
        product.id,
        !product.active,
      );
      if (result.success) {
        toast.success(
          product.active ? "Produto desativado." : "Produto ativado.",
        );
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <div className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/40 sm:gap-4 sm:px-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted sm:h-14 sm:w-14">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-foreground text-sm sm:text-base">
              {product.title}
            </p>
            {!product.active && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                Inativo
              </Badge>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
            <span className="truncate">{product.category.name}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="shrink-0 font-medium text-foreground">
              {currencyFormatter.format(Number(product.price))}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={isPending}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleStatus}>
              {product.active ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Desativar
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir &quot;{product.title}&quot;? Essa
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditProductDialog
        product={product}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
