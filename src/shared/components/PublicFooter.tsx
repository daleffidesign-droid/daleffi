import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/src/shared/components/ui/utils/cn";
import { contactPhoneNumber, emailAddress } from "../utils/contacts";

const currentYear = new Date().getFullYear();
const companyCnpj = "65.868.723/0001-52";

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Login", href: "/signin" },
];

type PublicFooterProps = {
  compact?: boolean;
  variant?: "light" | "dark";
};

export function PublicFooter({
  compact = false,
  variant = "light",
}: PublicFooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      id="contato"
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
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/logo.png"
                width={32}
                height={32}
                alt="Daleffi Design"
                className="h-8 w-8 rounded-full"
              />
              <span className="font-display text-base">
                Daleffi <span className="text-[var(--gold)]">Design</span>
              </span>
            </div>

            <p
              className={cn(
                "mt-4 text-xs",
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
                  "text-xs tracking-widest uppercase",
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
            <a
              href={`tel:${contactPhoneNumber}`}
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                isDark
                  ? "text-white/70 hover:text-[var(--gold)]"
                  : "text-foreground/70 hover:text-[var(--gold)]",
              )}
            >
              <Phone className="h-4 w-4" />
              {contactPhoneNumber}
            </a>

            <a
              href={`mailto:${emailAddress}`}
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                isDark
                  ? "text-white/70 hover:text-[var(--gold)]"
                  : "text-foreground/70 hover:text-[var(--gold)]",
              )}
            >
              <Mail className="h-4 w-4" />
              {emailAddress}
            </a>

            <span
              className={cn(
                "inline-flex items-center gap-2 text-sm",
                isDark ? "text-white/70" : "text-foreground/70",
              )}
            >
              <MapPin className="h-4 w-4" />
              Poços de Caldas, MG - Brasil
            </span>

            <a
              href="https://www.instagram.com/daleffi_desing"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm transition-colors",
                isDark
                  ? "text-white/70 hover:text-[var(--gold)]"
                  : "text-foreground/70 hover:text-[var(--gold)]",
              )}
            >
              @daleffidesign
            </a>
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
