"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

import { Button } from "./UI/button";
import LandingBuilderPreview from "./landing-builder-preview";
import { LANDING_BUILDER_LAYOUT } from "./landing-layout";

type HeroProps = {
  onBuilderProjectionChange: (projection: number) => void;
};

const Hero = ({ onBuilderProjectionChange }: HeroProps) => {
  const builderRef = useRef<HTMLDivElement>(null);
  const [builderTopReserve, setBuilderTopReserve] = useState(128);

  useLayoutEffect(() => {
    const builder = builderRef.current;
    if (!builder) return;

    const updateBuilderTopReserve = () => {
      const height = builder.offsetHeight;
      setBuilderTopReserve(
        Math.round(height * LANDING_BUILDER_LAYOUT.heroContentReserve),
      );
      onBuilderProjectionChange(
        Math.round(height * LANDING_BUILDER_LAYOUT.collectionProjection),
      );
    };

    updateBuilderTopReserve();
    const observer = new ResizeObserver(updateBuilderTopReserve);
    observer.observe(builder);

    return () => observer.disconnect();
  }, [onBuilderProjectionChange]);

  return (
    <section className="relative flex min-h-[100svh] flex-col bg-secondary px-6 pt-24 sm:pt-28 md:pt-32">
      <div
        className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:gap-16"
        style={{ paddingBottom: builderTopReserve }}
      >
        <div className="max-w-2xl">
          <h1 className="max-w-xl text-display text-foreground">
            Your recipes, in one calm place.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-forked-secondary-foreground md:text-lg md:leading-8">
            A calm, ad-free place for the dishes you make again and again—and an
            easy way to see what dinner could be tonight.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-h-11 w-full whitespace-normal sm:w-auto"
            >
              <Link href="/recipes">Browse recipes</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="primary-outline"
              className="min-h-11 w-full whitespace-normal sm:w-auto"
            >
              <Link href="/recipe/build">Build from ingredients</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-xs sm:max-w-md lg:block lg:max-w-none">
          <Image
            src="/pantry-cook.png"
            alt=""
            aria-hidden="true"
            width={512}
            height={512}
            priority
            className="relative mx-auto w-full max-w-md"
          />
        </div>
      </div>
      <div
        ref={builderRef}
        className="absolute bottom-0 left-6 right-6 z-10 mx-auto"
        style={{
          transform: `translateY(${
            LANDING_BUILDER_LAYOUT.collectionProjection * 100
          }%)`,
        }}
      >
        <LandingBuilderPreview />
      </div>
    </section>
  );
};

export default Hero;
