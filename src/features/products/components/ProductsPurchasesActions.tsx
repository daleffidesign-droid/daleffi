"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { buildWhatsAppOrderLink } from "@/src/shared/utils/whatsapp";

export function ProductPurchaseActions({
  product,
}: {
  product: {
    title: string;
    price: string;
    mercadoLivreLink: string | null;
  };
}) {
  const whatsappLink = buildWhatsAppOrderLink(product);

  return (
    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
      <Button
        size="lg"
        className="flex-1 bg-[#25D366] text-white hover:bg-[#1ea952]"
        render={
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Comprar pelo WhatsApp
          </a>
        }
      />

      {product.mercadoLivreLink && (
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          render={
            <a
              href={product.mercadoLivreLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShoppingBag className="h-4 w-4" />
              Comprar no Mercado Livre
            </a>
          }
        />
      )}
    </div>
  );
}