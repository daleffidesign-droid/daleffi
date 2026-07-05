import { headers } from "next/headers";
import { db } from "@/prisma";
import { auth } from "@/src/features/auth/lib/auth";
import { NewMemberDialog } from "@/src/features/team/components/NewMemberDialog";
import { TeamTable } from "@/src/features/team/components/TeamTable";

export default async function TeamPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const members = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Colaboradores
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Gerencie funções, acessos e contas da equipe.
          </p>
        </div>
        <NewMemberDialog />
      </div>

      <div className="mt-8">
        <TeamTable
          members={members.map((member) => ({
            ...member,
            role: member.role ?? "seller",
            banned: member.banned ?? false,
          }))}
          currentUserId={session?.user.id ?? ""}
        />
      </div>
    </div>
  );
}
