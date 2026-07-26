/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/src/shared/components/ui/utils/cn";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/src/shared/components/ui/carousel"; // ajusta esse path se necessário

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setActiveIndex(api.selectedScrollSnap());

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  return (
    <div className="flex flex-col gap-3">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.length > 0 ? (
            images.map((image, index) => (
              <CarouselItem key={image.url + index}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted sm:aspect-square">
                  <Image
                    src={image.url}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-muted sm:aspect-square">
                <ImageIcon className="h-14 w-14 text-muted-foreground/40" />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-muted ring-2 ring-transparent transition",
                index === activeIndex && "ring-foreground",
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
