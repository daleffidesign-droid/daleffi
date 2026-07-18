"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";

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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
}

const ROLE_OPTIONS = [
  { value: "owner", label: "Dono" },
  { value: "admin", label: "Administrador" },
  { value: "seller", label: "Vendedor" },
] as const;

interface TeamTableProps {
  members: TeamMember[];
  currentUserId: string;
  currentUserRole: string;
}

export function TeamTable({
  members,
  currentUserId,
  currentUserRole,
}: TeamTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const isOwner = currentUserRole === "owner";

  function handleRoleChange(userId: string, role: string) {
    setPendingId(userId);
    startTransition(async () => {
      await authClient.admin.setRole({
        userId,
        role: role as "owner" | "admin" | "seller",
      });
      router.refresh();
      setPendingId(null);
    });
  }

  function handleToggleBan(userId: string, banned: boolean) {
    setPendingId(userId);
    startTransition(async () => {
      if (banned) {
        await authClient.admin.unbanUser({ userId });
      } else {
        await authClient.admin.banUser({
          userId,
          banReason: "Acesso revogado pela administração",
        });
      }
      router.refresh();
      setPendingId(null);
    });
  }

  function handleRemove(userId: string) {
    setPendingId(userId);
    startTransition(async () => {
      await authClient.admin.removeUser({ userId });
      router.refresh();
      setPendingId(null);
    });
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-white text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">E-mail</th>
            <th className="px-4 py-3 font-medium">Função</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {isOwner && (
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => {
            const isSelf = member.id === currentUserId;
            const isBusy = isPending && pendingId === member.id;

            return (
              <tr key={member.id} className="text-foreground">
                <td className="whitespace-nowrap px-4 py-3">{member.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {member.email}
                </td>
                <td className="px-4 py-3">
                  {isOwner ? (
                    <Select
                      value={member.role}
                      onValueChange={(role) =>
                        handleRoleChange(member.id, role)
                      }
                      disabled={isSelf || isBusy}
                    >
                      <SelectTrigger className="h-8 w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-muted-foreground">
                      {ROLE_OPTIONS.find((role) => role.value === member.role)
                        ?.label ?? member.role}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {member.banned ? (
                    <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[var(--accent)] text-xs">
                      Banido
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[var(--gold)] text-xs">
                      Ativo
                    </span>
                  )}
                </td>
                {isOwner && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSelf || isBusy}
                        onClick={() =>
                          handleToggleBan(member.id, member.banned)
                        }
                        title={member.banned ? "Desbanir" : "Banir"}
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : member.banned ? (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldBan className="h-3.5 w-3.5" />
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSelf || isBusy}
                            title="Excluir"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Excluir colaborador
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação remove permanentemente {member.name} do
                              sistema. Não é possível desfazer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemove(member.id)}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}

          {members.length === 0 && (
            <tr>
              <td
                colSpan={isOwner ? 5 : 4}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                Nenhum colaborador cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
