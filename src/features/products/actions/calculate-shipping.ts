"use server";

import { z } from "zod";
import { db } from "@/prisma";

const calculateShippingSchema = z.object({
  productId: z.string().uuid(),
  destinationCep: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 8, "CEP inválido"),
});

export type ShippingQuote = {
  id: number;
  carrier: string;
  service: string;
  price: number;
  deliveryDays: number | null;
  error?: string;
};

export type ShippingCalculationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; quotes: ShippingQuote[] }
  | { status: "error"; message: string };

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
      title: true,
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
      message: "Este produto ainda não tem peso e dimensões cadastrados.",
    };
  }

  const originCep = process.env.STORE_ORIGIN_CEP;
  const token = process.env.MELHOR_ENVIO_TOKEN;
  const baseUrl = process.env.MELHOR_ENVIO_BASE_URL;

  if (!originCep || !token || !baseUrl) {
    return {
      status: "error",
      message: "Cálculo de frete indisponível no momento.",
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": `${process.env.MELHOR_ENVIO_APP_NAME} (${process.env.MELHOR_ENVIO_APP_EMAIL})`,
      },
      body: JSON.stringify({
        from: { postal_code: originCep },
        to: { postal_code: destinationCep },
        products: [
          {
            id: product.title,
            width: product.widthCm,
            height: product.heightCm,
            length: product.lengthCm,
            weight: product.weightKg,
            insurance_value: Number(product.price),
            quantity: 1,
          },
        ],
        options: { receipt: false, own_hand: false },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "error",
        message: "Não foi possível calcular o frete agora.",
      };
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return {
        status: "error",
        message: "Resposta inesperada do serviço de frete.",
      };
    }

    const quotes: ShippingQuote[] = data
      .filter((item) => !item.error && typeof item.price !== "undefined")
      .map((item) => ({
        id: item.id,
        carrier: item.company?.name ?? "Transportadora",
        service: item.name ?? "",
        price: Number(item.custom_price ?? item.price),
        deliveryDays: item.delivery_time?.days ?? null,
      }))
      .sort((a, b) => a.price - b.price);

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
