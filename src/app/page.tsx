import { Metadata } from "next";
import ComingSoon from "~/components/coming-soon";
import Features from "~/components/features";

import Hero from "~/components/hero";
import RecipePreview from "~/components/recipe-preview";

export const metadata: Metadata = {
  title: "Forked Recipe Book",
  description: "Recipe Book built on the T3 Stack",
};

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <ComingSoon />
      <RecipePreview />
    </main>
  );
};

export default Home;
