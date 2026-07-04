import Link from "next/link";

import { SignInForm } from "@/src/features/auth/components/Signin";
import { AuthLayout } from "@/src/features/auth/components/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout
      title="Acessar painel"
      subtitle="Entre com suas credenciais de administrador."
    >
      <SignInForm />

      <p className="mt-6 text-center text-muted-foreground text-sm">
        Precisa de acesso?{" "}
        <Link href="/signup" className="text-[var(--gold)] hover:underline">
          Criar conta de equipe
        </Link>
      </p>
    </AuthLayout>
  );
}
