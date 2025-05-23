import { Metadata } from "next";

import Hero from "~/components/hero";

export const metadata: Metadata = {
  title: "T3 Recipe Book",
  description: "Recipe Book built on the T3 Stack",
};

const Home = () => {
  return (
    <main>
      <Hero />
    </main>
  );
};

export default Home;
