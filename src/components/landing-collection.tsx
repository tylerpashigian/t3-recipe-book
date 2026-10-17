import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "~/components/UI/button";

import { LANDING_BUILDER_LAYOUT } from "./landing-layout";

const collectionRecipes = [
  { category: "Dinner", name: "Weeknight tomato pasta", time: "25 min" },
  { category: "Grill", name: "Citrus chicken skewers", time: "35 min" },
  { category: "Baking", name: "Everyday milk bread", time: "2 hr" },
];

type LandingCollectionProps = {
  builderProjection?: number;
};

const LandingCollection = ({ builderProjection }: LandingCollectionProps) => {
  const collectionTopPadding = Math.max(
    LANDING_BUILDER_LAYOUT.collectionMinimumTopPadding,
    (builderProjection ?? 0) + LANDING_BUILDER_LAYOUT.collectionClearance,
  );

  return (
    <section
      className="bg-background px-6 pb-12 md:pb-16"
      style={{ paddingTop: collectionTopPadding }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-xl bg-forked-background p-6 sm:p-10">
            <Image
              src="/pantry-grill.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              className="mx-auto w-full max-w-sm"
            />
          </div>
          <div className="max-w-xl">
            <h2 className="text-headline text-foreground">
              A personal collection, ready whenever you are.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-forked-secondary-foreground md:text-lg md:leading-8">
              Keep the dishes that earn a place in your kitchen. Forked gives
              them room to be useful again.
            </p>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {collectionRecipes.map((recipe) => (
                <li
                  key={recipe.name}
                  className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-forked-secondary-foreground">
                    {recipe.category}
                  </span>
                  <span className="font-semibold text-foreground">
                    {recipe.name}
                  </span>
                  <span className="text-sm text-forked-secondary-foreground">
                    {recipe.time}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/recipes"
              className="min-h-11 mt-6 inline-flex items-center gap-2 text-sm font-bold text-forked-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore your recipes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-y border-border py-12 sm:mt-24 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-headline text-foreground">
              Keep the recipes that make your kitchen yours.
            </h2>
            <p className="mt-4 text-base leading-7 text-forked-secondary-foreground md:text-lg">
              Start with one you already love. Add the rest as you go.
            </p>
          </div>
          <Button asChild size="lg" className="w-full shrink-0 sm:w-auto">
            <Link href="/recipe/create">Start your collection</Link>
          </Button>
        </div>

        <footer className="flex flex-col gap-4 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-2xl text-foreground">Forked</span>
          <span className="text-forked-secondary-foreground">
            A calm recipe collection for everyday cooking.
          </span>
        </footer>
      </div>
    </section>
  );
};

export default LandingCollection;
