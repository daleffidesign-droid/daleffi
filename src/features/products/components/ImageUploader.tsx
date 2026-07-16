"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/src/shared/components/ui/utils/cn";
import {
  ProductImageValue,
  MAX_PRODUCT_IMAGES,
} from "@/src/shared/schemas/product-schema";
import { supabaseClient } from "@/src/shared/utils/supabase-client";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BUCKET = "products";

interface ProductImageUploaderProps {
  value: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
  className?: string;
}

export function ProductImageUploader({
  value,
  onChange,
  className,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = MAX_PRODUCT_IMAGES - value.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setError(null);
    const selected = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setError(`Você pode enviar no máximo ${MAX_PRODUCT_IMAGES} imagens.`);
    }

    const invalidFile = selected.find(
      (file) => !ACCEPTED_TYPES.includes(file.type),
    );
    if (invalidFile) {
      setError(
        `"${invalidFile.name}" não é um formato aceito (use JPG, PNG ou WebP).`,
      );
      return;
    }

    const oversizedFile = selected.find(
      (file) => file.size > MAX_SIZE_MB * 1024 * 1024,
    );
    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" tem ${(oversizedFile.size / 1024 / 1024).toFixed(1)}MB — o máximo é ${MAX_SIZE_MB}MB.`,
      );
      return;
    }

    setIsUploading(true);

    try {
      const uploaded: ProductImageValue[] = [];

      for (const file of selected) {
        const extension = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabaseClient.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          console.error(
            `[ProductImageUploader] Falha ao enviar "${file.name}":`,
            uploadError,
          );
          throw new Error(
            `Falha ao enviar "${file.name}": ${uploadError.message}`,
          );
        }

        const { data } = supabaseClient.storage.from(BUCKET).getPublicUrl(path);

        if (!data?.publicUrl) {
          throw new Error(
            `Upload de "${file.name}" concluído, mas não foi possível gerar a URL pública.`,
          );
        }

        uploaded.push({ url: data.publicUrl, path });
      }

      onChange([...value, ...uploaded]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível enviar uma ou mais imagens. Tente novamente.";

      console.error("[ProductImageUploader] Upload falhou:", err);
      setError(message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove(path: string) {
    onChange(value.filter((image) => image.path !== path));
    void supabaseClient.storage
      .from(BUCKET)
      .remove([path])
      .then(({ error: removeError }) => {
        if (removeError) {
          console.error(
            "[ProductImageUploader] Falha ao remover do storage:",
            removeError,
          );
        }
      });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {value.map((image) => (
          <div
            key={image.path}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(image.path)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remover imagem"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-border border-dashed text-muted-foreground text-xs transition-colors hover:border-[var(--gold)]/60 hover:text-[var(--gold)] disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Adicionar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <p className="text-muted-foreground text-xs">
        {value.length}/{MAX_PRODUCT_IMAGES} imagens enviadas
      </p>
    </div>
  );
}
