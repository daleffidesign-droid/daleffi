"use client";

import { Button } from "@/src/shared/components/ui/button";
import { buildWhatsAppOrderLink } from "@/src/shared/utils/whatsapp";
import Image from "next/image";

export function ProductPurchaseActions({
  product,
  whatsappNumber,
}: {
  product: {
    title: string;
    price: string;
    mercadoLivreLink: string | null;
  };
  whatsappNumber: string;
}) {
  const whatsappLink = buildWhatsAppOrderLink(whatsappNumber, product);

  return (
    <div className="mt-2 flex flex-col gap-3">
      <Button
        size="lg"
        nativeButton={false}
        className="flex-1 py-3 bg-[#25D366] text-white hover:bg-[#1ea952]"
        render={
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Image
              src="/logos/whatsapp-logo.png"
              height={20}
              width={20}
              alt="WhatsApp"
            />
            <p className="font-bold">WhatsApp</p>
          </a>
        }
      />

      {product.mercadoLivreLink && (
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          className="flex-1 py-3 bg-[#FFE600] hover:bg-[#FFE600]/80 text-[#2F3476] font-bold"
          render={
            <a
              href={product.mercadoLivreLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/logos/ml-logo.svg"
                height={80}
                width={80}
                alt="Mercado Livre"
              />
            </a>
          }
        />
      )}
    </div>
  );
}
