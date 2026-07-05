import { auth } from "@/src/features/auth/lib/auth";
import { MainHeader } from "@/src/shared/components/Header";
import { MainSidebar } from "@/src/shared/components/Sidebar";
import { SidebarProvider } from "@/src/shared/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <MainSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <MainHeader />
          <div className="p-4 max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
