import Link from "next/link";
import { SignUpForm } from "@/src/features/auth/components/Signup";
import { AuthLayout } from "@/src/features/auth/components/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Criar conta de equipe"
      subtitle="Cadastre um novo administrador ou vendedor."
    >
      <SignUpForm />

      <p className="mt-6 text-center text-muted-foreground text-sm">
        Já tem uma conta?{" "}
        <Link href="/signin" className="text-[var(--gold)] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
