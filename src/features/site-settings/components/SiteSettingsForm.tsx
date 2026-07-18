"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { Separator } from "@/src/shared/components/ui/separator";
import {
  updateSiteSettings,
  type SiteSettingsFormState,
} from "../actions/update-site-settings";

interface SiteSettingsFormProps {
  settings: {
    whatsappNumber: string;
    contactEmail: string;
    instagramHandle: string | null;
    addressLine: string | null;
  };
}

const initialState: SiteSettingsFormState = { status: "idle" };

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateSiteSettings,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }
    if (state.status === "error" && state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="mx-auto max-w-5xl sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-display text-2xl text-foreground">
              Redes e contato
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Gerencie WhatsApp, e-mail e redes sociais exibidos no site — as
              mudanças aparecem em todo lugar automaticamente.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações de contato</CardTitle>
            <CardDescription>
              Usadas no botão flutuante de WhatsApp, cabeçalho e rodapé do site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="whatsappNumber">WhatsApp (DDD + número)</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  defaultValue={settings.whatsappNumber}
                  placeholder="35997613373"
                />
                {state.errors?.whatsappNumber && (
                  <p className="text-destructive text-xs">
                    {state.errors.whatsappNumber}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactEmail">E-mail de contato</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={settings.contactEmail}
                  placeholder="contato@daleffi.com"
                />
                {state.errors?.contactEmail && (
                  <p className="text-destructive text-xs">
                    {state.errors.contactEmail}
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="instagramHandle">Instagram (sem @)</Label>
                <Input
                  id="instagramHandle"
                  name="instagramHandle"
                  defaultValue={settings.instagramHandle ?? ""}
                  placeholder="daleffidesign"
                />
                {state.errors?.instagramHandle && (
                  <p className="text-destructive text-xs">
                    {state.errors.instagramHandle}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addressLine">Endereço exibido no rodapé</Label>
                <Input
                  id="addressLine"
                  name="addressLine"
                  defaultValue={settings.addressLine ?? ""}
                  placeholder="Poços de Caldas, MG - Brasil"
                />
                {state.errors?.addressLine && (
                  <p className="text-destructive text-xs">
                    {state.errors.addressLine}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="mt-2 self-start"
              >
                {isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
