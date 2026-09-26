import Image from "next/image";
import Link from "next/link";
import { Button } from "./UI/button";

const ComingSoon = () => {
  return (
    <section className="bg-forked-background px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="max-w-xl">
          <h2 className="text-headline text-foreground">Ready when dinner needs an answer.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-forked-secondary-foreground md:text-lg">Browse the recipes you keep close, or start with the ingredients on the counter and see what is possible.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-11 w-full whitespace-normal sm:w-auto"><Link href="/recipes">Browse my recipes</Link></Button>
            <Button asChild size="lg" variant="primary-outline" className="min-h-11 w-full whitespace-normal sm:w-auto"><Link href="/recipe/build">Build from ingredients</Link></Button>
          </div>
        </div>
        <Image src="/pantry-grill.png" alt="" aria-hidden="true" width={512} height={512} className="mx-auto hidden w-full max-w-sm md:block" />
      </div>
    </section>
  );
};

export default ComingSoon;
