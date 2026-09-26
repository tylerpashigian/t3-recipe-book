"use client";

import React from "react";

interface SectionProps {
  heading: string;
  subheading: string;
  classes?: string;
  children: React.ReactNode;
}

export const Section = ({
  heading,
  subheading,
  classes = "",
  children,
}: SectionProps) => {
  return (
    <section className={`px-6 py-16 sm:py-20 md:py-28 ${classes}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mx-auto mb-5 max-w-3xl text-headline text-foreground">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-forked-secondary-foreground sm:text-lg sm:leading-8">
            {subheading}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
};
