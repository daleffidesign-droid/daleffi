"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { FeaturedProduct } from "../actions/get-featured-products";

const SPEED_PX_PER_FRAME = 0.6;
const MIN_REPEATS = 4; // garante largura suficiente mesmo com poucos produtos

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

  // Repete o suficiente pra sempre haver espaço de sobra pro scroll
  const repeatCount = Math.max(MIN_REPEATS, 2);
  const loopedProducts = Array.from(
    { length: repeatCount },
    () => products,
  ).flat();

  useEffect(() => {
    if (products.length === 0) return;

    // mede a largura real do primeiro "set" via offsetLeft do item
    // que marca o início do segundo set (posição = largura do 1º set)
    function measure() {
      if (markerRef.current) {
        singleSetWidthRef.current = markerRef.current.offsetLeft;
      }
    }
    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    function tick() {
      const track = trackRef.current;
      const singleSetWidth = singleSetWidthRef.current;

      if (track && !isPaused.current && singleSetWidth > 0) {
        track.scrollLeft += SPEED_PX_PER_FRAME;

        if (track.scrollLeft >= singleSetWidth) {
          track.scrollLeft -= singleSetWidth;
        }
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
        className="no-scrollbar flex gap-4 overflow-x-scroll"
      >
        {loopedProducts.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            ref={index === products.length ? markerRef : undefined}
            href={`/catalogo/${product.id}`}
            className="group relative aspect-[3/4] w-[220px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] sm:w-[260px]"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="260px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white/20" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10">
              <p className="truncate text-sm font-medium text-white">
                {product.title}
              </p>
              <p className="text-xs text-[var(--gold)]">
                {currency.format(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
