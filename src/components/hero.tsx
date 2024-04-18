import React from "react";
import Link from "next/link";

const Landing = () => {
  return (
    <section className="w-full">
      <div className="container grid items-center gap-4 px-4 lg:grid-cols-2 lg:gap-8 ">
        <div className="hidden lg:block">
          <img
            alt="Hero Image"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-contain"
            src="/cooking.jpg"
          />
        </div>
        <div className="flex-col space-y-4 text-center lg:text-start">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Find and Share Delicious Recipes
            </h1>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
              Save your favorites, swap with friends, and dive into a world of
              recipes!
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            href="recipes"
          >
            Explore Recipes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Landing;
