import React from "react";

import { BookOpen, Search, ShieldCheck } from "lucide-react";
import { Section } from "~/components/UI/section";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Your recipes, kept together",
    description:
      "Keep ingredients, timings, and instructions in one calm collection.",
  },
  {
    icon: Search,
    title: "Cook from what you have",
    description:
      "Start with the ingredients already in your kitchen and find a recipe that fits.",
  },
  {
    icon: ShieldCheck,
    title: "No ads, no noise",
    description:
      "The recipe is the point. Nothing competes with the meal you are trying to make.",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  return (
    <div className="border-t border-border pt-5">
      <Icon className="h-5 w-5 text-forked-accent" aria-hidden="true" />
      <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
      <p className="mt-2 leading-7 text-forked-secondary-foreground">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <Section
      heading="A collection that stays out of the way."
      subheading="Keep what matters, cook from what you have, and leave the clutter behind."
      classes="bg-forked-neutral"
    >
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </Section>
  );
};

export default Features;
