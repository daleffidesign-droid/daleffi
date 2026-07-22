"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { FeaturedProduct } from "../actions/get-featured-products";

const SPEED_PX_PER_SECOND = 40;
const MIN_REPEATS = 4;

export function FeaturedCarousel({
  products,
}: {
  products: FeaturedProduct[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLAnchorElement>(null);
  const isPaused = useRef(false);
  const rafRef = useRef<number | null>(null);
  const singleSetWidthRef = useRef(0);
  const positionRef = useRef(0); // acumulador fracionário próprio
  const lastTimeRef = useRef<number | null>(null);

  const repeatCount = Math.max(MIN_REPEATS, 2);
  const loopedProducts = Array.from(
    { length: repeatCount },
    () => products,
  ).flat();

  useEffect(() => {
    if (products.length === 0) return;

    function measure() {
      if (markerRef.current) {
        singleSetWidthRef.current = markerRef.current.offsetLeft;
      }
    }
    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    function tick(time: number) {
      const track = trackRef.current;
      const singleSetWidth = singleSetWidthRef.current;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const deltaSeconds = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (track && !isPaused.current && singleSetWidth > 0) {
        // acumula no seu próprio float, nunca lê de volta do DOM
        positionRef.current += SPEED_PX_PER_SECOND * deltaSeconds;

        if (positionRef.current >= singleSetWidth) {
          positionRef.current -= singleSetWidth;
        }

        track.scrollLeft = positionRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [products.length]);

  if (products.length === 0) return null;

  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent sm:w-28" />

      <div
        ref={trackRef}
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        style={{ scrollBehavior: "auto" }}
        className="no-scrollbar flex gap-4 overflow-x-scroll"
      >
        {loopedProducts.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            ref={index === products.length ? markerRef : undefined}
            href={`/catalogo/${product.id}`}
            className="group relative aspect-[3/4] w-[260px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:w-[340px]"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="340px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white/20" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-12">
              <p className="truncate font-medium text-base text-white">
                {product.title}
              </p>
              <p className="text-[var(--gold)] text-sm">
                {currency.format(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
