"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./UI/button";

const Hero = () => {
  return (
    <section className="flex h-[100dvh] w-full items-center bg-[#FAFAF7] px-6 py-20">
      <div className="container grid h-full items-center justify-center gap-4 px-4 lg:gap-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Find and Share Delicious Recipes
          </h1>
          <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
            Save your favorites, swap with friends, and dive into a world of
            recipes!
          </p>

          <Button asChild>
            <Link href="recipes">Explore Recipes</Link>
          </Button>
          <Button asChild>
            <Link href="recipe/build">Build a Recipe</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
