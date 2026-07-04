import { z } from "zod";
import { cpfValidator } from "@/src/shared/utils/formatCpfCnpj";
import { ValidBrazilianDDD } from "@/src/shared/utils/contact";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Insira seu nome" })
      .min(2, { message: "Nome muito curto" }),
    email: z
      .string()
      .min(1, { message: "Insira seu email" })
      .email({ message: "E-mail inválido" }),
    cpf: z.preprocess(
      (val) => (typeof val === "string" ? val.replace(/\D/g, "") : val),
      z
        .string()
        .length(11, { message: "CPF deve ter 11 dígitos" })
        .regex(/^\d{11}$/, { message: "CPF deve conter apenas números" })
        .refine(cpfValidator, { message: "CPF inválido" }),
    ),
    phoneNumber: z.preprocess(
      (val) => (typeof val === "string" ? val.replace(/\D/g, "") : val),
      z
        .string()
        .length(11, {
          message: "Telefone deve conter exatamente 11 dígitos (DDD + número)",
        })
        .regex(/^\d{11}$/, { message: "Telefone deve conter apenas números" })
        .refine(
          (value) => {
            const ddd = value.substring(0, 2);
            return ValidBrazilianDDD.includes(ddd);
          },
          { message: "DDD inválido para o Brasil" },
        ),
    ),
    password: z
      .string()
      .min(1, { message: "Insira sua senha" })
      .min(8, { message: "Senha deve conter no mínimo 8 caracteres" })
      .max(20, { message: "Senha deve conter no máximo 20 caracteres" })
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Deve conter pelo menos um símbolo especial",
      ),
    confirmPassword: z.string().min(1, { message: "Confirme sua senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type TypeSignupSchema = z.infer<typeof signupSchema>;
