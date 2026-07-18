import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/src/shared/components/ui/utils/cn";
import { getSiteSettings } from "@/src/features/site-settings/actions/get-site-settings";

const currentYear = new Date().getFullYear();
const companyCnpj = "65.868.723/0001-52";

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
];

type PublicFooterProps = {
  compact?: boolean;
  variant?: "light" | "dark";
};

export async function PublicFooter({
  compact = false,
  variant = "light",
}: PublicFooterProps) {
  const isDark = variant === "dark";
  const settings = await getSiteSettings();

  const whatsappHref = `https://wa.me/55${settings.whatsappNumber}?text=${encodeURIComponent(
    "Olá! Vi o site da Daleffi e gostaria de mais informações.",
  )}`;

  return (
    <footer
      className={cn(
        "border-t",
        isDark
          ? "border-white/10 bg-black text-white"
          : "border-border bg-background text-foreground",
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6",
          compact ? "py-10" : "py-16",
        )}
      >
        <div
          className={cn(
            "grid gap-10",
            compact ? "sm:grid-cols-2" : "sm:grid-cols-3",
          )}
        >
          {/* Marca */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/logo-extenso.png"
                width={140}
                height={36}
                alt="Daleffi Design"
                className="h-9 w-auto object-contain"
              />
            </Link>

            <p
              className={cn(
                "mt-4 text-xs tracking-wide",
                isDark ? "text-white/40" : "text-muted-foreground",
              )}
            >
              CNPJ {companyCnpj}
            </p>
          </div>

          {/* Links rápidos */}
          {!compact && (
            <div className="flex flex-col gap-2.5">
              <span
                className={cn(
                  "text-xs uppercase tracking-[0.2em]",
                  isDark ? "text-white/40" : "text-muted-foreground",
                )}
              >
                Navegação
              </span>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    isDark
                      ? "text-white/70 hover:text-[var(--gold)]"
                      : "text-foreground/70 hover:text-[var(--gold)]",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Contato */}
          <div className="flex flex-col gap-3 sm:items-end">
            <span
              className={cn(
                "mb-1 text-xs uppercase tracking-[0.2em] sm:text-right",
                isDark ? "text-white/40" : "text-muted-foreground",
              )}
            >
              Contato
            </span>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                isDark
                  ? "text-white/70 hover:text-[var(--gold)]"
                  : "text-foreground/70 hover:text-[var(--gold)]",
              )}
            >
              <MessageCircle className="h-4 w-4" />
              {settings.whatsappNumber}
            </a>

            <a
              href={`mailto:${settings.contactEmail}`}
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                isDark
                  ? "text-white/70 hover:text-[var(--gold)]"
                  : "text-foreground/70 hover:text-[var(--gold)]",
              )}
            >
              <Mail className="h-4 w-4" />
              {settings.contactEmail}
            </a>

            {settings.addressLine && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 text-sm",
                  isDark ? "text-white/70" : "text-foreground/70",
                )}
              >
                <MapPin className="h-4 w-4" />
                {settings.addressLine}
              </span>
            )}

            {settings.instagramHandle && (
              <a
                href={`https://www.instagram.com/${settings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-sm transition-colors",
                  isDark
                    ? "text-white/70 hover:text-[var(--gold)]"
                    : "text-foreground/70 hover:text-[var(--gold)]",
                )}
              >
                @{settings.instagramHandle}
              </a>
            )}
          </div>
        </div>

        <div
          className={cn(
            "mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row",
            isDark
              ? "border-white/10 text-white/40"
              : "border-border text-muted-foreground",
          )}
        >
          <span>
            © {currentYear} Daleffi Design. Todos os direitos reservados.
          </span>
          <Link href="/catalogo" className="hover:text-[var(--gold)]">
            Ver catálogo
          </Link>
        </div>
      </div>
    </footer>
  );
}
