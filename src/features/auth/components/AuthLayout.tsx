import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen w-full bg-background md:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden border-border border-r px-10 md:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(198,161,91,0.10), transparent 60%)",
          }}
        />

        <div className="relative flex flex-col items-center gap-8">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[var(--gold)]/30">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[var(--gold)]/70">
              <span className="font-display text-5xl text-[var(--gold)] tracking-wide">
                D
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-display text-2xl text-foreground tracking-[0.35em]">
              DALEFFI
            </p>
            <p className="mt-1 text-muted-foreground text-xs uppercase tracking-[0.4em]">
              Design
            </p>
          </div>

          <div className="h-px w-16 bg-[var(--gold)]/40" />

          <p className="max-w-xs text-center text-muted-foreground text-sm leading-relaxed">
            Painel administrativo restrito à equipe Daleffi Design.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 md:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)]/60">
              <span className="font-display text-2xl text-[var(--gold)]">
                D
              </span>
            </div>
            <p className="font-display text-foreground text-lg tracking-[0.3em]">
              DALEFFI
            </p>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-2xl text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
