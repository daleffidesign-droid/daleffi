"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, User, Loader2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/src/shared/components/ui/command";
import { Dialog, DialogContent } from "@/src/shared/components/ui/dialog";
import { searchGlobal } from "../actions/searchGlobal";

type SearchResult = Awaited<ReturnType<typeof searchGlobal>>;

const PAGES = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    label: "Colaboradores",
    href: "/team",
    icon: User,
  },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandMenu({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open || query.length < 2) {
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchGlobal(query);
        setResults(data);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, open]);

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
    setQuery("");
    setResults(null);
  }

  const normalizedQuery = query.trim().toLowerCase();

  const pages = useMemo(() => {
    return PAGES.filter(
      (page) =>
        !normalizedQuery || page.label.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const visibleResults = query.length >= 2 ? results : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          setQuery("");
          setResults(null);
        }
      }}
    >
      <DialogContent className="p-2">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar produtos, colaboradores..."
            value={query}
            onValueChange={setQuery}
          />

          <CommandList className="max-h-[70vh]">
            {isPending && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isPending && (
              <>
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

                {pages.length > 0 && (
                  <CommandGroup heading="Páginas">
                    {pages.map((page) => (
                      <CommandItem
                        key={page.href}
                        onSelect={() => go(page.href)}
                      >
                        <page.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {page.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* PRODUTOS — ainda sem página de detalhe, então leva pra
                    lista; troque para `/products/${product.id}` quando
                    existir a rota individual. */}
                {visibleResults?.products?.length ? (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Produtos">
                      {visibleResults.products.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => go(`/products`)}
                        >
                          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-1 items-center gap-2 overflow-hidden">
                            <span className="truncate">{product.title}</span>
                            <span className="ml-auto text-[11px] text-muted-foreground">
                              {product.category?.name ?? "Sem categoria"}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                ) : null}

                {/* COLABORADORES */}
                {visibleResults?.users?.length ? (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Colaboradores">
                      {visibleResults.users.map((user) => (
                        <CommandItem key={user.id} onSelect={() => go(`/team`)}>
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-1 items-center gap-2 overflow-hidden">
                            <span className="truncate">{user.name}</span>
                            <span className="ml-auto text-[11px] text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                ) : null}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
