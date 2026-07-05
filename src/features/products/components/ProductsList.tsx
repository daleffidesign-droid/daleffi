import { db } from "@/prisma";
import { PackageX } from "lucide-react";
import { ProductRow } from "./ProductRow";

export async function ProductsList() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  if (products.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
        <PackageX className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-muted-foreground text-sm">
          Nenhum produto cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-2">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={{
            ...product,
            price: product.price.toString(),
          }}
        />
      ))}
    </div>
  );
}
