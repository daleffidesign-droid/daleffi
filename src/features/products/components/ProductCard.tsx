"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import { cn } from "@/src/shared/components/ui/utils/cn";

export interface CatalogProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  mercadoLivreLink: string | null;
  category: { id: string; name: string };
  images: { url: string }[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({
  product,
  view,
}: {
  product: CatalogProduct;
  view: "grid" | "list";
}) {
  const thumbnail = product.images[0]?.url;

  return (
    <Link
      href={`/catalogo/${product.id}`}
      className={cn(
        "group flex w-full overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        view === "grid" ? "flex-col" : "flex-row",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 bg-muted",
          view === "grid"
            ? "aspect-square w-full"
            : "h-32 w-32 sm:h-40 sm:w-40",
        )}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            sizes={view === "grid" ? "(max-width: 640px) 50vw, 25vw" : "160px"}
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-foreground text-sm sm:text-base">
            {product.title}
          </h3>
          <Badge variant="secondary" className="mt-1 text-[11px]">
            {product.category.name}
          </Badge>
        </div>

        <p
          className={cn(
            "text-muted-foreground text-xs sm:text-sm",
            view === "grid" ? "line-clamp-2" : "line-clamp-2 sm:line-clamp-3",
          )}
        >
          {product.description}
        </p>

        <span className="mt-auto font-semibold text-foreground text-sm sm:text-base">
          {currencyFormatter.format(Number(product.price))}
        </span>
      </div>
    </Link>
  );
}
