import Link from "next/link";
import {
  Package,
  Tags,
  Star,
  Truck,
  Users,
  Share2,
  ArrowRight,
  Shield,
} from "lucide-react";
import { db } from "@/prisma";

export default async function DashboardPage() {
  const [
    activeProductsCount,
    inactiveProductsCount,
    categoriesCount,
    featuredCount,
    missingShippingCount,
    recentProducts,
  ] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.product.count({ where: { active: false } }),
    db.category.count(),
    db.product.count({ where: { featured: true } }),
    db.product.count({
      where: {
        active: true,
        OR: [
          { weightKg: null },
          { heightCm: null },
          { widthCm: null },
          { lengthCm: null },
        ],
      },
    }),
    db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Produtos ativos",
      value: activeProductsCount,
      icon: Package,
      href: "/products",
    },
    {
      label: "Categorias",
      value: categoriesCount,
      icon: Tags,
      href: "/products",
    },
    {
      label: "Em destaque",
      value: featuredCount,
      icon: Star,
      href: "/products",
    },
    {
      label: "Sem dados de frete",
      value: missingShippingCount,
      icon: Truck,
      href: "/products",
      alert: missingShippingCount > 0,
    },
  ];

  const quickLinks = [
    { label: "Colaboradores", href: "/team", icon: Users },
    { label: "Segurança", href: "/security", icon: Shield },
    { label: "Redes e contato", href: "/settings", icon: Share2 },
  ];

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Bem-vindo ao painel administrativo.
          </p>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col gap-3 border border-border p-5 transition-colors hover:border-[var(--gold)]/40"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  stat.alert ? "bg-destructive/10" : "bg-[var(--gold)]/10"
                }`}
              >
                <stat.icon
                  className={`h-4 w-4 ${
                    stat.alert ? "text-destructive" : "text-[var(--gold)]"
                  }`}
                />
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </div>
            <div>
              <p className="font-display text-3xl text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Produtos recentes */}
        <div className="border border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Adicionados recentemente
            </h2>
            <Link
              href="/products"
              className="text-muted-foreground text-xs transition-colors hover:text-[var(--gold)]"
            >
              Ver todos
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="mt-6 text-muted-foreground text-sm">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <div className="mt-4 flex flex-col divide-y divide-border">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-foreground text-sm">{product.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {product.category.name}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {dateFormatter.format(product.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Atalhos + status */}
        <div className="flex flex-col gap-4">
          <div className="border border-border p-6">
            <h2 className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Atalhos
            </h2>
            <div className="mt-4 flex flex-col gap-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-[var(--gold)]/5"
                >
                  <span className="flex items-center gap-2.5 text-foreground text-sm">
                    <link.icon className="h-4 w-4 text-muted-foreground" />
                    {link.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {inactiveProductsCount > 0 && (
            <div className="border border-border border-dashed p-6">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                Rascunhos
              </p>
              <p className="mt-2 font-display text-2xl text-foreground">
                {inactiveProductsCount}
              </p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Produto{inactiveProductsCount === 1 ? "" : "s"} inativo
                {inactiveProductsCount === 1 ? "" : "s"}, fora do catálogo
                público.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
