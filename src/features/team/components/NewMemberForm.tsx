"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/src/features/auth/lib/auth-client";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Alert, AlertDescription } from "@/src/shared/components/ui/alert";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";

const roles = [
  { value: "owner", label: "Dono" },
  { value: "admin", label: "Administrador" },
  { value: "seller", label: "Vendedor" },
] as const;

const newMemberSchema = z.object({
  name: z.string().min(2, "Informe o nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  role: z.enum(["owner", "admin", "seller"]),
  password: z.string().min(8, "Mínimo de 8 caracteres"),
});

type NewMemberValues = z.infer<typeof newMemberSchema>;

interface NewMemberFormProps {
  onSuccess?: () => void;
}

export function NewMemberForm({ onSuccess }: NewMemberFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<NewMemberValues>({
    resolver: zodResolver(newMemberSchema),
    defaultValues: { name: "", email: "", role: "seller", password: "" },
  });

  function onSubmit(values: NewMemberValues) {
    setFormError(null);

    startTransition(async () => {
      // admin.createUser cria a conta sem logar como ela — diferente de
      // signUp.email, que trocaria a sessão de quem está criando.
      const { error } = await authClient.admin.createUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (error) {
        setFormError(
          error.code === "USER_ALREADY_EXISTS"
            ? "Já existe uma conta com esse e-mail."
            : "Não foi possível criar o colaborador. Tente novamente.",
        );
        return;
      }

      form.reset();
      onSuccess?.();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {formError && (
          <Alert className="border-[var(--accent)]/40 bg-[var(--accent)]/10 text-foreground">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nome do colaborador"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="voce@daleffidesign.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha provisória</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[var(--gold)] text-[var(--gold-foreground)] hover:bg-[var(--gold-hover)]"
        >
          {isPending ? "Criando..." : "Criar colaborador"}
        </Button>
      </form>
    </Form>
  );
}