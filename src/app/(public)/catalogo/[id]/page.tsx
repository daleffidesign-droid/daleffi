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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/catalogo"
        className="mb-6 inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
        {/* Coluna principal: imagem + título + descrição */}
        <div className="flex flex-col gap-6">
          <ProductGallery
            images={serializedProduct.images}
            title={serializedProduct.title}
          />

          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">
              {serializedProduct.category.name}
            </Badge>
            <h1 className="font-display text-2xl text-foreground sm:text-3xl">
              {serializedProduct.title}
            </h1>

            {/* Preço visível no mobile, logo abaixo do título */}
            <p className="font-semibold text-2xl text-foreground lg:hidden">
              {currencyFormatter.format(Number(serializedProduct.price))}
            </p>

            <p className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed sm:text-base">
              {serializedProduct.description}
            </p>

            {/* Botões de compra no mobile, no final do fluxo */}
            <div className="lg:hidden">
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

        {/* Sidebar: só aparece no desktop, sticky */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {serializedProduct.category.name}
              </Badge>
              <h2 className="font-display text-lg text-foreground">
                {serializedProduct.title}
              </h2>
            </div>

            <p className="font-semibold text-3xl text-foreground">
              {currencyFormatter.format(Number(serializedProduct.price))}
            </p>

            <ProductPurchaseActions
              product={{
                title: serializedProduct.title,
                price: serializedProduct.price,
                mercadoLivreLink: serializedProduct.mercadoLivreLink,
              }}
            />

            <p className="text-muted-foreground text-xs leading-relaxed">
              Ao clicar em comprar, você será direcionado para finalizar o
              pedido diretamente com a loja.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
