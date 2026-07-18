import { headers } from "next/headers";
import { auth } from "@/src/features/auth/lib/auth";
import { getSiteSettings } from "@/src/features/site-settings/actions/get-site-settings";
import { SiteSettingsForm } from "@/src/features/site-settings/components/SiteSettingsForm";
import { ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
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

  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
