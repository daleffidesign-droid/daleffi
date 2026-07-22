import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { MobileNav } from "./MobileNav";
import { getSiteSettings } from "@/src/features/site-settings/actions/get-site-settings";

export default async function PublicHeader() {
  const settings = await getSiteSettings();

  const navLinks = [
    { label: "Sobre", href: "/#sobre" },
    { label: "Coleções", href: "/catalogo" },
    {
      label: "Contato",
      href: `https://wa.me/55${settings.whatsappNumber}?text=${encodeURIComponent(
        "Olá! Vi o site da Daleffi e gostaria de mais informações.",
      )}`,
      external: true,
    },
  ];

  return (
    <header className="fixed top-0 z-40 w-full border-white/10 border-b bg-black/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo-extenso.png"
            width={140}
            height={36}
            alt="Daleffi Design"
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative text-sm text-white/70 transition-colors hover:text-[var(--gold)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm text-white/70 transition-colors hover:text-[var(--gold)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ),
          )}
        </nav>

        <div className="hidden sm:block">
          <Button
            size="sm"
            className="h-10 bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90 text-sm"
            render={<Link href="/catalogo">Ver catálogo</Link>}
          />
        </div>

        <MobileNav navLinks={navLinks} />
      </div>
    </header>
  );
}
