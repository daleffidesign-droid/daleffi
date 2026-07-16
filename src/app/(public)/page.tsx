import Link from "next/link";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  PenTool,
} from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { getFeaturedProducts } from "@/src/features/products/actions/get-featured-products";
import { FeaturedCarousel } from "@/src/features/products/components/FeaturedCarousel";

const HIGHLIGHTS = [
  {
    icon: Crown,
    title: "Curadoria exclusiva",
    description:
      "Peças selecionadas com critério e atenção aos detalhes, pensadas para durar gerações.",
  },
  {
    icon: Sparkles,
    title: "Acabamento premium",
    description:
      "Qualidade em cada material escolhido, do primeiro molde à peça final.",
  },
  {
    icon: ShieldCheck,
    title: "Compra com confiança",
    description:
      "Atendimento próximo do início ao fim do seu pedido, com suporte real.",
  },
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-1 flex-col bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--gold)/8%,_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-4 py-1.5 text-[var(--gold)] text-xs tracking-wide">
            <Crown className="h-3.5 w-3.5" />
            Design de excelência desde 2010
          </span>

          <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-6xl">
            Elegância que atravessa o tempo,{" "}
            <span className="text-[var(--gold)]">peça por peça</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Design autoral esculpido à mão, pensado pra dar personalidade a
            barbearias, salões, spas e clínicas.
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
              className="border-white/20 text-black hover:bg-white/5"
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

      {/* Destaques — carrossel infinito */}
      {featuredProducts.length > 0 && (
        <section
          id="destaques"
          className="border-b border-white/10 py-16 sm:py-20"
        >
          <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div>
              <span className="text-[var(--gold)] text-xs uppercase tracking-widest">
                Destaques
              </span>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                Peças em evidência
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

          <FeaturedCarousel products={featuredProducts} />
        </section>
      )}

      {/* Sobre */}
      <section id="sobre" className="border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            {/* Coluna esquerda: número + abertura */}
            <div className="flex flex-col gap-6">
              <span className="font-display text-7xl leading-none text-[var(--gold)]/20 sm:text-8xl">
                15
              </span>
              <div>
                <span className="text-[var(--gold)] text-xs uppercase tracking-widest">
                  Nossa história
                </span>
                <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
                  Há 15 anos transformando design autoral em identidade
                </h2>
              </div>
            </div>

            {/* Coluna direita: narrativa */}
            <div className="flex flex-col gap-6 text-sm leading-relaxed text-white/60 sm:text-base">
              <p>
                A Daleffi nasceu de forma orgânica, movida pela paixão pelo
                design e pelas antiguidades. Tudo começou com a restauração de
                antigas cadeiras Ferrante, cuidadosamente recuperadas e
                destinadas a barbearias — o que era um hobby logo revelou uma
                oportunidade de mercado.
              </p>
              <p>
                O interesse crescia a cada peça entregue, e foi desse movimento
                que nasceu a vontade de criar algo original: o primeiro modelo
                autoral, esculpido manualmente em madeira, deu origem aos
                primeiros moldes e ao início da fabricação das cadeiras Daleffi.
                Desde o princípio, o propósito nunca foi apenas produzir móveis,
                mas criar peças com personalidade, beleza e funcionalidade.
              </p>

              {/* Card do designer */}
              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10">
                  <PenTool className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Paulo Daleffi
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-[var(--gold)]">
                    Artista plástico &amp; designer industrial
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Cada criação é desenvolvida com atenção rigorosa à simetria,
                    ao equilíbrio das formas, à ergonomia e à identidade visual.
                    Cada cadeira carrega uma assinatura própria, transformando
                    função em expressão artística.
                  </p>
                </div>
              </div>

              <p>
                Assim como grandes nomes do design transformaram móveis em peças
                atemporais, a Daleffi acredita que uma cadeira pode ir além da
                sua utilidade: pode contar uma história, transmitir conceito e
                afirmar identidade. Essa essência se manifesta nas linhas de
                barbearias, salões de beleza, spas e clínicas em toda a coleção,
                onde o trabalho artesanal, a qualidade dos materiais e a
                originalidade tornam cada peça única.
              </p>

              <p className="font-display text-xl text-white sm:text-2xl">
                Daleffi é design autoral que transforma móveis em obras com
                identidade própria.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
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

      {/* CTA banner */}
      <section className="border-b border-white/10 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Pronto para encontrar a sua peça?
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Explore nosso catálogo completo ou fale diretamente com a gente.
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
              className="border-white/20 text-black hover:bg-white/5"
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
