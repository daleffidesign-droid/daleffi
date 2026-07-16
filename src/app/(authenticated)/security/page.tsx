import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/src/features/auth/lib/auth";
import { ChangePasswordCard } from "@/src/features/auth/components/ChangePasswordCard";
import { SessionsCard } from "@/src/features/auth/components/SessionsCard";
import { UserSessionsCard } from "@/src/features/auth/components/UserSessionsCard";

export default async function SecurityPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "owner") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="font-medium text-foreground text-lg">Acesso restrito</h1>
        <p className="text-muted-foreground text-sm">
          Somente o Dono da conta pode acessar as configurações de segurança.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Segurança</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Gerencie sua senha e as sessões ativas da conta e da equipe.
        </p>
      </div>

      <ChangePasswordCard />
      <SessionsCard currentSessionToken={session.session.token} />
      <UserSessionsCard currentUserId={session.user.id} />
    </div>
  );
}
