import { contactPhoneNumber } from "./contacts";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function buildWhatsAppOrderLink(product: {
  title: string;
  price: string;
}) {
  const formattedPrice = currencyFormatter.format(Number(product.price));
  const message = `Olá! Gostaria de pedir o produto "${product.title}" (${formattedPrice}). Poderia me passar mais informações?`;

  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${contactPhoneNumber}?${params.toString()}`;
}