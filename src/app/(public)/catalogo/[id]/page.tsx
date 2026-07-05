import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/prisma";
import { Badge } from "@/src/shared/components/ui/badge";
import { ProductGallery } from "@/src/features/products/components/ProductGallery";
import { ProductPurchaseActions } from "@/src/features/products/components/ProductsPurchasesActions";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id, active: true },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    price: product.price.toString(),
  };

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <ProductGallery
          images={serializedProduct.images}
          title={serializedProduct.title}
        />

        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {serializedProduct.category.name}
            </Badge>
            <h1 className="font-display text-2xl text-foreground sm:text-3xl">
              {serializedProduct.title}
            </h1>
          </div>

          <p className="font-semibold text-2xl text-foreground sm:text-3xl">
            {currencyFormatter.format(Number(serializedProduct.price))}
          </p>

          <p className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed sm:text-base">
            {serializedProduct.description}
          </p>

          <ProductPurchaseActions
            product={{
              title: serializedProduct.title,
              price: serializedProduct.price,
              mercadoLivreLink: serializedProduct.mercadoLivreLink,
            }}
          />
        </div>
      </div>
    </div>
  );
}
