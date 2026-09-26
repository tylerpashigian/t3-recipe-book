import Image from "next/image";
import Link from "next/link";
import { Button } from "./UI/button";

const Hero = () => (
  <section className="bg-forked-background overflow-hidden px-6 pb-16 pt-28 md:pb-24 md:pt-36">
    <div className="mx-auto grid max-w-6xl items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:gap-16">
      <div className="max-w-2xl">
        <h1 className="max-w-xl text-display text-foreground">Keep the recipes you actually want to make.</h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-forked-secondary-foreground md:text-lg md:leading-8">Forked is your ad-free home for weeknight staples, family favorites, and every recipe worth returning to.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-11 w-full whitespace-normal sm:w-auto"><Link href="/recipes">Browse my recipes</Link></Button>
          <Button asChild size="lg" variant="primary-outline" className="min-h-11 w-full whitespace-normal sm:w-auto"><Link href="/recipe/build">Find a recipe from my ingredients</Link></Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-none">
        <div className="absolute inset-x-8 bottom-5 top-12 rounded-[2rem] bg-forked-neutral" />
        <Image src="/pantry-cook.png" alt="" aria-hidden="true" width={512} height={512} priority className="relative mx-auto w-full max-w-md drop-shadow-[0_24px_28px_rgb(53_65_54_/_0.16)]" />
      </div>
    </div>
  </section>
);

export default Hero;
