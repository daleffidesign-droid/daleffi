import Link from "next/link";
import { Button } from "./ui/button";
import { MobileNav } from "./MobileNav";
import Image from "next/image";

export default function PublicHeader() {
  return (
    <header className="fixed top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logos/logo-extenso.png"
              width={36}
              height={36}
              alt="Daleffi Design"
              className="h-15 w-30 rounded-full"
            />
          </div>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="#sobre"
            className="text-sm text-white/70 transition-colors hover:text-[var(--gold)]"
          >
            Sobre
          </Link>
          <Link
            href="#colecoes"
            className="text-sm text-white/70 transition-colors hover:text-[var(--gold)]"
          >
            Coleções
          </Link>
          <Link
            href="#contato"
            className="text-sm text-white/70 transition-colors hover:text-[var(--gold)]"
          >
            Contato
          </Link>
        </nav>

        <div className="hidden sm:block">
          <Button
            size="sm"
            className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
            render={<Link href="/catalogo">Ver catálogo</Link>}
          />
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
