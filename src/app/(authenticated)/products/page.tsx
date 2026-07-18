import { db } from "@/prisma";
import { NewProductDialog } from "@/src/features/products/components/NewProduct";
import { ProductsList } from "@/src/features/products/components/ProductsList";

export default async function ProductsPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Produtos</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Gerencie os produtos exibidos na loja.
          </p>
        </div>
        <NewProductDialog categories={categories} />
      </div>

      <ProductsList />
    </div>
  );
}
