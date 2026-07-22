"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { Label } from "@/src/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { ShippingCalculatorAdmin } from "./OwnerShippingCalculator";

type Product = { id: string; title: string; imageUrl: string | null };

export function ShippingCalculatorAdminPage({
  products,
}: {
  products: Product[];
}) {
  const [productId, setProductId] = useState<string>("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="product-select"
          className="text-xs uppercase tracking-[0.15em]"
        >
          Produto
        </Label>
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger id="product-select" className="w-full">
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                <span className="flex items-center gap-2.5">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0 rounded-sm object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-muted">
                      <ImageOff className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                  )}
                  {product.title}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {productId ? (
        <ShippingCalculatorAdmin productId={productId} key={productId} />
      ) : (
        <p className="text-muted-foreground text-sm italic">
          Selecione um produto para calcular o frete.
        </p>
      )}
    </div>
  );
}
