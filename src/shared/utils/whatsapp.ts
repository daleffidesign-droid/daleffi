const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function buildWhatsAppOrderLink(
  whatsappNumber: string,
  product: {
    title: string;
    price: string;
  },
) {
  const formattedPrice = currencyFormatter.format(Number(product.price));

  const message = `Olá! Gostaria de pedir o produto "${product.title}" (${formattedPrice}). Poderia me passar mais informações?`;

  return `https://wa.me/55${whatsappNumber}?${new URLSearchParams({
    text: message,
  })}`;
}