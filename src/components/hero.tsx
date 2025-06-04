"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./UI/button";
import { Badge } from "./UI/badge";

const Hero = () => {
  return (
    <section className="bg-forked-background flex h-[100dvh] w-full items-center px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-6 text-center">
        <Badge variant="accent">Your Personal Recipe Collection</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Organize Your Recipes
          <br />
          <span className="text-forked-primary">Like Never Before</span>
        </h1>
        <p className="text-forked-secondary-foreground mx-auto mb-2 max-w-xl leading-relaxed md:text-lg">
          Create, edit, and organize your favorite recipes with our beautiful
          and intuitive recipe management platform. From family traditions to
          new discoveries, keep them all in one place.
        </p>
        <div className="inline-grid w-auto grid-cols-1 gap-4 sm:w-auto sm:grid-cols-2">
          <Button asChild size="lg" className="w-full">
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="primary-outline"
            className="w-full "
          >
            <Link href="/recipe/build">✨ Pantry Magic</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
