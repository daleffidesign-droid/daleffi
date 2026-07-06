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
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full sm:w-48">
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

        <div className="flex shrink-0 items-center gap-1 self-start rounded-lg border border-border p-1 sm:self-auto">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
            title="Visualizar em grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
            title="Visualizar em lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <p className="text-muted-foreground text-xs">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "produto encontrado"
          : "produtos encontrados"}
      </p>

      {/* Lista/Grade */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          {products.length === 0 ? (
            <>
              <PackageX className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Nenhum produto disponível no momento.
              </p>
            </>
          ) : (
            <>
              <SearchX className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">
                Nenhum produto encontrado para essa busca.
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
