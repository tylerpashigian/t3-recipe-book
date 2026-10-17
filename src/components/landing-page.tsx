"use client";

import { useCallback, useState } from "react";

import Hero from "./hero";
import LandingCollection from "./landing-collection";

const LandingPage = () => {
  const [builderProjection, setBuilderProjection] = useState<number>();

  const handleBuilderProjectionChange = useCallback((projection: number) => {
    setBuilderProjection(projection);
  }, []);

  return (
    <main>
      <Hero onBuilderProjectionChange={handleBuilderProjectionChange} />
      <LandingCollection builderProjection={builderProjection} />
    </main>
  );
};

export default LandingPage;
