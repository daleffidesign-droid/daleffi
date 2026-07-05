"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Contato", href: "#contato" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white"
        aria-label="Abrir menu"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-white/10 bg-black px-6 py-6">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/80 hover:text-[var(--gold)]"
              >
                {link.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="mt-2 w-full bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
              render={<Link href="/catalogo">Ver catálogo</Link>}
            />
          </nav>
        </div>
      )}
    </div>
  );
}