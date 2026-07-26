import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/prisma";
import { ProductGallery } from "@/src/features/products/components/ProductGallery";
import { ProductPurchaseActions } from "@/src/features/products/components/ProductsPurchasesActions";
import { ShippingCalculator } from "@/src/features/products/components/ShippingCalculator";
import { getSiteSettings } from "@/src/features/site-settings/actions/get-site-settings";

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

  const settings = await getSiteSettings();

  const serializedProduct = {
    ...product,
    price: product.price.toString(),
  };

  const reference = serializedProduct.id.slice(0, 8).toUpperCase();

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <nav className="mb-10 flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Catálogo
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span>{serializedProduct.category.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,560px)_380px] lg:justify-center lg:gap-16">
        <div className="flex animate-in flex-col gap-8 fade-in slide-in-from-bottom-2 duration-700">
          <ProductGallery
            images={serializedProduct.images}
            title={serializedProduct.title}
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                {serializedProduct.category.name}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider">
                Ref. {reference}
              </span>
            </div>

            <h1 className="font-display text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
              {serializedProduct.title}
            </h1>

            <p className="font-display text-2xl text-foreground lg:hidden">
              {currencyFormatter.format(Number(serializedProduct.price))}
            </p>

            <div className="border-border border-t pt-5">
              <p className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed sm:text-base">
                {serializedProduct.description}
              </p>
            </div>

            <div className="lg:hidden">
              <ShippingCalculator productId={serializedProduct.id} />
            </div>

            <div className="lg:hidden">
              <ProductPurchaseActions
                whatsappNumber={settings.whatsappNumber}
                product={{
                  title: serializedProduct.title,
                  price: serializedProduct.price,
                  mercadoLivreLink: serializedProduct.mercadoLivreLink,
                }}
              />
            </div>
          </div>
        </div>

        <aside className="hidden animate-in lg:block fade-in slide-in-from-bottom-4 duration-700">
          <div className="sticky top-24 flex flex-col gap-6 border border-border p-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                {serializedProduct.category.name}
              </span>
              <h2 className="font-display text-xl text-foreground leading-snug">
                {serializedProduct.title}
              </h2>
              <span className="font-mono text-[11px] text-muted-foreground/60 tracking-wider">
                Ref. {reference}
              </span>
            </div>

            <div className="border-border border-t pt-6">
              <span className="mb-1 block text-muted-foreground text-xs uppercase tracking-[0.2em]">
                Valor
              </span>
              <p className="font-display text-4xl text-foreground">
                {currencyFormatter.format(Number(serializedProduct.price))}
              </p>
            </div>

            <ProductPurchaseActions
              whatsappNumber={settings.whatsappNumber}
              product={{
                title: serializedProduct.title,
                price: serializedProduct.price,
                mercadoLivreLink: serializedProduct.mercadoLivreLink,
              }}
            />

            <ShippingCalculator productId={serializedProduct.id} />

            <p className="text-muted-foreground text-xs italic leading-relaxed">
              Ao clicar em comprar, você será direcionado para finalizar o
              pedido diretamente com a loja.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
