import Link from "next/link";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: Crown,
    title: "Curadoria exclusiva",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Peças selecionadas com critério e atenção aos detalhes.",
  },
  {
    icon: Sparkles,
    title: "Acabamento premium",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Qualidade em cada material escolhido.",
  },
  {
    icon: ShieldCheck,
    title: "Compra com confiança",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco. Atendimento próximo do início ao fim do seu pedido.",
  },
];

const GALLERY_PLACEHOLDERS = Array.from({ length: 4 });

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* Header */}
     

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--gold)/8%,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-4 py-1.5 text-[var(--gold)] text-xs tracking-wide">
            <Crown className="h-3.5 w-3.5" />
            Design de excelência
          </span>

          <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-6xl">
            Elegância que atravessa o tempo,{" "}
            <span className="text-[var(--gold)]">peça por peça</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
              render={
                <Link href="/catalogo">
                  Veja nosso catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5 text-black"
              render={
                <Link href="#contato">
                  <MessageCircle className="h-4 w-4" />
                  Entre em contato
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* Sobre / Highlights */}
      <section id="sobre" className="border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="text-[var(--gold)] text-xs tracking-widest uppercase">
              Sobre a Daleffi
            </span>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Tradição e sofisticação em cada detalhe
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/10">
                  <item.icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coleções / Galeria (placeholders) */}
      <section
        id="colecoes"
        className="border-b border-white/10 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[var(--gold)] text-xs tracking-widest uppercase">
                Coleções
              </span>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                Peças em destaque
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--gold)] hover:underline"
            >
              Ver catálogo completo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY_PLACEHOLDERS.map((_, index) => (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <ImageIcon className="h-8 w-8 text-white/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-b border-white/10 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Pronto para encontrar a sua peça?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Explore
            nosso catálogo completo ou fale diretamente com a gente.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
              render={
                <Link href="/catalogo">
                  Veja nosso catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 hover:bg-white/5 text-black"
              render={
                <Link href="#contato">
                  <MessageCircle className="h-4 w-4" />
                  Entre em contato
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* Contato / Footer */}
    </div>
  );
}
