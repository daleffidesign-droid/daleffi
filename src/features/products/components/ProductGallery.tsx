"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/src/shared/components/ui/utils/cn";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-muted ring-2 ring-transparent transition",
                index === activeIndex && "ring-foreground"
              )}
            >
              <Image
                src={image.url}
                alt={`${title} - imagem ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}