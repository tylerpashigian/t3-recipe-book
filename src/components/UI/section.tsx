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
    <section className={`px-6 py-20 ${classes}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-forked-secondary-foreground">
            {subheading}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
};
