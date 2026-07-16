"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, PackageX, SearchX } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { ProductCard, type CatalogProduct } from "./ProductCard";
import { cn } from "@/src/shared/components/ui/utils/cn";

type Category = { id: string; name: string };
type ViewMode = "grid" | "list";

export function CatalogClient({
  products,
  categories,
}: {
  products: CatalogProduct[];
  categories: Category[];
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        categoryId === "all" || product.category.id === categoryId;
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryId, search]);

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-border border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-none border-0 border-border border-b bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:border-foreground sm:max-w-xs"
          />

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full rounded-none border-0 border-border border-b bg-transparent px-0 shadow-none focus:ring-0 sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start border border-border sm:self-auto">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setView("grid")}
            title="Visualizar em grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setView("list")}
            title="Visualizar em lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <p className="text-muted-foreground text-xs uppercase tracking-[0.15em]">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "produto encontrado"
          : "produtos encontrados"}
      </p>

      {/* Lista/Grade */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 border border-border border-dashed py-24 text-center">
          {products.length === 0 ? (
            <>
              <PackageX className="h-8 w-8 text-muted-foreground/40" />
              <p className="font-display text-foreground text-lg">
                Nenhum produto disponível
              </p>
              <p className="text-muted-foreground text-sm">
                Volte em breve para conferir novidades.
              </p>
            </>
          ) : (
            <>
              <SearchX className="h-8 w-8 text-muted-foreground/40" />
              <p className="font-display text-foreground text-lg">
                Nenhum resultado
              </p>
              <p className="text-muted-foreground text-sm">
                Tente buscar por outro termo ou categoria.
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
              : "flex flex-col gap-3",
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}
