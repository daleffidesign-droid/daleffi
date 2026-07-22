import { db } from "@/prisma";
import { ShippingCalculatorAdminPage } from "@/src/features/products/components/ShippingCalculatorAdminPage";

export const revalidate = 0;

export default async function AdminFretePage() {
  const products = await db.product.findMany({
    where: { active: true },
    select: {
      id: true,
      title: true,
      images: {
        take: 1,
        orderBy: { order: "asc" },
        select: { url: true },
      },
    },
    orderBy: { title: "asc" },
  });

  const productsWithImage = products.map((p) => ({
    id: p.id,
    title: p.title,
    imageUrl: p.images[0]?.url ?? null,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl text-foreground mb-1">
        Calcular frete
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Escolha um produto e um CEP para ver todas as cotações, incluindo as
        transportadoras que não atendem e o motivo.
      </p>

      <ShippingCalculatorAdminPage products={productsWithImage} />
    </div>
  );
}
