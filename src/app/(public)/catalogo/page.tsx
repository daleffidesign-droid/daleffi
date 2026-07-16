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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-10 border-border border-b pb-8">
        <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Coleção completa
        </span>
        <h1 className="mt-2 font-display text-3xl text-foreground tracking-tight sm:text-4xl">
          Catálogo
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-base">
          Confira nossos produtos e faça seu pedido pelo WhatsApp ou Mercado
          Livre.
        </p>
      </div>

      <CatalogClient products={serializedProducts} categories={categories} />
    </div>
  );
}
