"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center text-white"
        aria-label="Abrir menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-white/10 border-t bg-black px-6 py-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/80 hover:text-[var(--gold)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/80 hover:text-[var(--gold)]"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Button
              size="sm"
              className="bg-[var(--gold)] h-8 text-black hover:bg-[var(--gold)]/90"
              render={<Link href="/catalogo">Ver catálogo</Link>}
            />
          </nav>
        </div>
      )}
    </div>
  );
}