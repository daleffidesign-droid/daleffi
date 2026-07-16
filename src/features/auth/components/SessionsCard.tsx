"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Laptop, Loader2, LogOut, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/src/features/auth/lib/auth-client";
import { Button } from "@/src/shared/components/ui/button";
import { Badge } from "@/src/shared/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/shared/components/ui/alert-dialog";

interface SessionItem {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string | Date;
}

export function SessionsCard({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    authClient.listSessions().then(({ data }) => {
      if (active && data) setSessions(data);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleRevokeOne(token: string) {
    setRevokingToken(token);
    startTransition(async () => {
      const { error } = await authClient.revokeSession({ token });
      if (error) {
        toast.error("Não foi possível encerrar essa sessão.");
      } else {
        setSessions((prev) => prev?.filter((s) => s.token !== token) ?? null);
        toast.success("Sessão encerrada.");
      }
      setRevokingToken(null);
    });
  }

  function handleRevokeOthers() {
    startTransition(async () => {
      const { error } = await authClient.revokeOtherSessions();
      if (error) {
        toast.error("Não foi possível encerrar as outras sessões.");
      } else {
        setSessions((prev) =>
          prev?.filter((s) => s.token === currentSessionToken) ?? null,
        );
        toast.success("Todas as outras sessões foram encerradas.");
      }
    });
  }

  function handleRevokeAll() {
    startTransition(async () => {
      const { error } = await authClient.revokeSessions();
      if (error) {
        toast.error("Não foi possível encerrar as sessões.");
        return;
      }
      toast.success("Todas as sessões foram encerradas. Saindo...");
      router.replace("/sign-in");
    });
  }

  function describeSession(session: SessionItem) {
    const ua = session.userAgent ?? "";
    const isMobile = /mobile|android|iphone/i.test(ua);
    return {
      Icon: isMobile ? Smartphone : Laptop,
      label: isMobile ? "Dispositivo móvel" : "Computador",
    };
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-medium text-foreground">Sessões ativas</h2>
          <p className="text-muted-foreground text-sm">
            Dispositivos e navegadores atualmente conectados à sua conta.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sair de todos os dispositivos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Encerrar todas as sessões?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso vai desconectar você deste e de todos os outros
                dispositivos, incluindo o atual. Você precisará entrar
                novamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRevokeAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sair de tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-5 flex flex-col divide-y divide-border">
        {sessions === null && (
          <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando sessões...
          </div>
        )}

        {sessions?.length === 0 && (
          <p className="py-4 text-muted-foreground text-sm">
            Nenhuma sessão ativa encontrada.
          </p>
        )}

        {sessions?.map((session) => {
          const isCurrent = session.token === currentSessionToken;
          const { Icon, label } = describeSession(session);

          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground">{label}</p>
                    {isCurrent && (
                      <Badge className="border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)] text-xs">
                        Sessão atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {session.ipAddress ?? "IP desconhecido"} ·{" "}
                    {new Date(session.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>

              {!isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isPending && revokingToken === session.token}
                  onClick={() => handleRevokeOne(session.token)}
                >
                  {isPending && revokingToken === session.token ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Encerrar"
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {sessions && sessions.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={isPending}
          onClick={handleRevokeOthers}
        >
          Encerrar todas as outras sessões
        </Button>
      )}
    </div>
  );
}