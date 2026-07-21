"use client";

import { useState, useTransition } from "react";
import { Loader2, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import {
  calculateShipping,
  type ShippingCalculationState,
} from "../actions/calculate-shipping";

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length <= 5
    ? digits
    : `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function ShippingCalculator({ productId }: { productId: string }) {
  const [cep, setCep] = useState("");
  const [state, setState] = useState<ShippingCalculationState>({
    status: "idle",
  });
  const [isPending, startTransition] = useTransition();

  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  function handleCalculate() {
    setState({ status: "loading" });
    startTransition(async () => {
      setState(await calculateShipping({ productId, destinationCep: cep }));
    });
  }

  return (
    <div className="flex flex-col gap-3 border-border border-t pt-5">
      <Label
        htmlFor="shipping-cep"
        className="text-xs uppercase tracking-[0.15em]"
      >
        Calcular frete
      </Label>

      <div className="flex gap-2 items-center">
        <Input
          id="shipping-cep"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(formatCep(e.target.value))}
          maxLength={9}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          className="h-9"
          disabled={cep.replace(/\D/g, "").length !== 8 || isPending}
          onClick={handleCalculate}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Calcular"
          )}
        </Button>
      </div>

      {state.status === "loading" && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {state.status === "error" && (
        <p className="text-destructive text-xs">{state.message}</p>
      )}

      {state.status === "success" && (
        <div className="flex flex-col gap-2">
          {state.quotes.map((quote) => (
            <div
              key={`${quote.carrier}-${quote.id}`}
              className="flex items-center justify-between border border-border p-3"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {quote.carrier}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {quote.service}
                    {quote.deliveryDays &&
                      ` · até ${quote.deliveryDays} dias úteis`}
                  </p>
                </div>
              </div>
              <span className="font-display text-foreground text-sm">
                {currency.format(quote.price)}
              </span>
            </div>
          ))}
          <p className="mt-1 inline-flex items-center gap-1.5 text-muted-foreground text-xs">
            <PackageCheck className="h-3.5 w-3.5" />
            Valores estimados; confirmação final no fechamento do pedido.
          </p>
        </div>
      )}
    </div>
  );
}
