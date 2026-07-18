"use server";

import { z } from "zod";
import { db } from "@/prisma";

const MELHOR_ENVIO_BASE_URL =
  process.env.MELHOR_ENVIO_BASE_URL ?? "https://sandbox.melhorenvio.com.br";

const calculateShippingSchema = z.object({
  productId: z.string().uuid(),
  destinationCep: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 8, "CEP inválido"),
});

export type ShippingQuote = {
  carrier: string;
  service: string;
  price: number;
  deliveryDays: number | null;
};

export type ShippingCalculationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; quotes: ShippingQuote[] }
  | { status: "error"; message: string };

// Transportadoras que queremos exibir, na ordem desejada.
// A API retorna vários serviços; filtramos e pegamos o mais barato de cada uma.
const TARGET_CARRIERS = ["Correios", "Jadlog", "Buslog"];

export async function calculateShipping(
  input: z.input<typeof calculateShippingSchema>,
): Promise<ShippingCalculationState> {
  const parsed = calculateShippingSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { productId, destinationCep } = parsed.data;

  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      weightKg: true,
      heightCm: true,
      widthCm: true,
      lengthCm: true,
      price: true,
    },
  });

  if (!product) {
    return { status: "error", message: "Produto não encontrado." };
  }

  if (
    !product.weightKg ||
    !product.heightCm ||
    !product.widthCm ||
    !product.lengthCm
  ) {
    return {
      status: "error",
      message:
        "Este produto ainda não tem peso e dimensões cadastrados. Fale com a loja para calcular o frete.",
    };
  }

  const originCep = process.env.STORE_ORIGIN_CEP;
  const token = process.env.MELHOR_ENVIO_TOKEN;

  if (!originCep || !token) {
    return {
      status: "error",
      message: "Cálculo de frete indisponível no momento.",
    };
  }

  try {
    const response = await fetch(
      `${MELHOR_ENVIO_BASE_URL}/api/v2/me/shipment/calculate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": `${process.env.MELHOR_ENVIO_APP_NAME ?? "App"} (${process.env.MELHOR_ENVIO_APP_EMAIL ?? "contato@example.com"})`,
        },
        body: JSON.stringify({
          from: { postal_code: originCep },
          to: { postal_code: destinationCep },
          package: {
            weight: product.weightKg,
            width: product.widthCm,
            height: product.heightCm,
            length: product.lengthCm,
          },
          options: {
            insurance_value: Number(product.price),
            receipt: false,
            own_hand: false,
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        status: "error",
        message: "Não foi possível calcular o frete agora. Tente novamente.",
      };
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return {
        status: "error",
        message: "Resposta inesperada do serviço de frete.",
      };
    }

    const validResults = data.filter(
      (item) => !item.error && typeof item.price !== "undefined",
    );

    const quotesByCarrier = new Map<string, ShippingQuote>();

    for (const item of validResults) {
      const carrierName: string = item.company?.name ?? "Transportadora";
      const matchesTarget = TARGET_CARRIERS.some((target) =>
        carrierName.toLowerCase().includes(target.toLowerCase()),
      );

      if (!matchesTarget) continue;

      const price = Number(item.price);
      const existing = quotesByCarrier.get(carrierName);

      if (!existing || price < existing.price) {
        quotesByCarrier.set(carrierName, {
          carrier: carrierName,
          service: item.name ?? carrierName,
          price,
          deliveryDays: item.delivery_time?.days ?? null,
        });
      }
    }

    const quotes = Array.from(quotesByCarrier.values())
      .sort((a, b) => a.price - b.price)
      .slice(0, 3);

    if (quotes.length === 0) {
      return {
        status: "error",
        message: "Nenhuma transportadora atende esse CEP no momento.",
      };
    }

    return { status: "success", quotes };
  } catch {
    return {
      status: "error",
      message: "Falha ao conectar com o serviço de frete.",
    };
  }
}