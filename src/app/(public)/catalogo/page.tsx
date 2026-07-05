import { db } from "@/prisma";
import { CatalogClient } from "@/src/features/products/components/CatalogClient";
    
export const revalidate = 60;

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Catálogo</h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          Confira nossos produtos e faça seu pedido pelo WhatsApp ou Mercado
          Livre.
        </p>
      </div>

      <CatalogClient products={serializedProducts} categories={categories} />
    </div>
  );
}
