import { redirect } from "next/navigation";

export default function SignUpPage() {
  redirect("/signin");

  return null;

  /*<AuthLayout
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
    </AuthLayout>*/
}
