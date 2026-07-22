"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Loader2, Truck } from "lucide-react";
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

export function ShippingCalculatorAdmin({ productId }: { productId: string }) {
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
        htmlFor="shipping-cep-admin"
        className="text-xs uppercase tracking-[0.15em]"
      >
        Calcular frete (visão interna)
      </Label>

      <div className="flex items-center gap-2">
        <Input
          id="shipping-cep-admin"
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
        </div>
      )}

      {state.status === "error" && (
        <p className="text-destructive text-xs">{state.message}</p>
      )}

      {state.status === "success" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">
              Disponíveis ({state.quotes.length})
            </p>
            {state.quotes.length === 0 && (
              <p className="text-muted-foreground text-xs italic">
                Nenhuma disponível.
              </p>
            )}
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
          </div>

          {state.excluded.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs">
                Indisponíveis ({state.excluded.length})
              </p>
              {state.excluded.map((item) => (
                <div
                  key={`${item.carrier}-${item.id}`}
                  className="flex items-center gap-2.5 border border-border/50 p-3"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {item.carrier}
                      {item.service && ` · ${item.service}`}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}