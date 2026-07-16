/* eslint-disable react-hooks/set-state-in-effect */
// src/features/security/components/UserSessionsCard.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Laptop, Loader2, Smartphone, Users } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/src/features/auth/lib/auth-client";
import { Button } from "@/src/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
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

interface TeamOption {
  id: string;
  name: string;
  email: string;
}

interface UserSessionItem {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: string | Date;
}

export function UserSessionsCard({ currentUserId }: { currentUserId: string }) {
  const [members, setMembers] = useState<TeamOption[] | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [sessions, setSessions] = useState<UserSessionItem[] | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  useEffect(() => {
    authClient.admin.listUsers({ query: { limit: 100 } }).then(({ data }) => {
      if (!data) return;
      setMembers(
        data.users
          .filter((user) => user.id !== currentUserId)
          .map((user) => ({ id: user.id, name: user.name, email: user.email })),
      );
    });
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedUserId) {
      setSessions(null);
      return;
    }

    setIsLoadingSessions(true);
    authClient.admin
      .listUserSessions({ userId: selectedUserId })
      .then(({ data }) => {
        setSessions(data?.sessions ?? []);
      })
      .finally(() => setIsLoadingSessions(false));
  }, [selectedUserId]);

  function handleRevokeOne(token: string) {
    setRevokingToken(token);
    startTransition(async () => {
      const { error } = await authClient.admin.revokeUserSession({
        sessionToken: token,
      });
      if (error) {
        toast.error("Não foi possível encerrar essa sessão.");
      } else {
        setSessions((prev) => prev?.filter((s) => s.token !== token) ?? null);
        toast.success("Sessão encerrada.");
      }
      setRevokingToken(null);
    });
  }

  function handleRevokeAll() {
    if (!selectedUserId) return;
    startTransition(async () => {
      const { error } = await authClient.admin.revokeUserSessions({
        userId: selectedUserId,
      });
      if (error) {
        toast.error("Não foi possível encerrar as sessões deste colaborador.");
      } else {
        setSessions([]);
        toast.success("Todas as sessões do colaborador foram encerradas.");
      }
    });
  }

  function describeSession(session: UserSessionItem) {
    const ua = session.userAgent ?? "";
    const isMobile = /mobile|android|iphone/i.test(ua);
    return {
      Icon: isMobile ? Smartphone : Laptop,
      label: isMobile ? "Dispositivo móvel" : "Computador",
    };
  }

  const selectedMember = members?.find((m) => m.id === selectedUserId);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10">
          <Users className="h-5 w-5 text-[var(--gold)]" />
        </div>
        <div>
          <h2 className="font-medium text-foreground">
            Sessões de colaboradores
          </h2>
          <p className="text-muted-foreground text-sm">
            Como Dono, você pode encerrar sessões ativas de qualquer colaborador
            da equipe.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder="Selecione um colaborador" />
          </SelectTrigger>
          <SelectContent>
            {members === null && (
              <div className="px-3 py-2 text-muted-foreground text-sm">
                Carregando colaboradores...
              </div>
            )}
            {members?.length === 0 && (
              <div className="px-3 py-2 text-muted-foreground text-sm">
                Nenhum outro colaborador cadastrado.
              </div>
            )}
            {members?.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name} · {member.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedUserId && (
          <>
            {isLoadingSessions && (
              <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando sessões...
              </div>
            )}

            {!isLoadingSessions && sessions?.length === 0 && (
              <p className="py-2 text-muted-foreground text-sm">
                Este colaborador não tem sessões ativas no momento.
              </p>
            )}

            {!isLoadingSessions && sessions && sessions.length > 0 && (
              <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                {sessions.map((session) => {
                  const { Icon, label } = describeSession(session);
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{label}</p>
                          <p className="text-muted-foreground text-xs">
                            {session.ipAddress ?? "IP desconhecido"} ·{" "}
                            {new Date(session.createdAt).toLocaleString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                      </div>

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
                    </div>
                  );
                })}
              </div>
            )}

            {sessions && sessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    className="self-start"
                  >
                    Encerrar todas as sessões deste colaborador
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Encerrar sessões de {selectedMember?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso vai desconectar {selectedMember?.name} de todos os
                      dispositivos. A pessoa precisará entrar novamente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Encerrar sessões
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        )}
      </div>
    </div>
  );
}
