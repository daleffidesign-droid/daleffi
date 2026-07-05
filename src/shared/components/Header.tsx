"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { authClient } from "@/src/features/auth/lib/auth-client";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { CommandMenu } from "./CommandMenu";

export function MainHeader() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const now = new Date();
  const formatted = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const iconBtnClass =
    "size-8 shrink-0 rounded-lg border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors";

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <SidebarTrigger />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">
            Olá, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-[11px] text-muted-foreground capitalize truncate">
            {formatted}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Buscar"
          className={iconBtnClass + " sm:hidden"}
        >
          <Search size={15} />
        </Button>

        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20 transition-colors text-xs"
        >
          <Search size={13} />
          Buscar...
          <kbd className="inline-flex items-center text-[10px] text-muted-foreground bg-background border border-border rounded px-1">
            ⌘K
          </kbd>
        </Button>
      </header>

      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  );
}
