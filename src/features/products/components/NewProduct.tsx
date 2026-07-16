"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog";
import { Category, ProductForm } from "./ProductForm";

interface NewProductDialogProps {
  categories: Category[];
}

export function NewProductDialog({ categories }: NewProductDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[var(--gold)] text-[var(--gold-foreground)] hover:bg-[var(--gold-hover)]">
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um item ao catálogo.
          </DialogDescription>
        </DialogHeader>
        <ProductForm categories={categories} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
