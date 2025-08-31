import React from "react";

import { Copy, Heart, Scale } from "lucide-react";

import { Section } from "~/components/UI/section";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Copy,
    title: "Copy Ingredients",
    description:
      "Copy ingredient lists to your clipboard for easy shopping list",
  },
  {
    icon: Scale,
    title: "Recipe Scaling",
    description:
      "Automatically adjust ingredient quantities for different serving sizes",
  },
];

const ListItem = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  return (
    <li className="flex items-start gap-3">
      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-foreground" />
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Icon className="text-forked-secondary h-4 w-4" />
          <span className="font-medium text-foreground">{feature.title}</span>
        </div>
        <p className="text-sm text-forked-secondary-foreground">
          {feature.description}
        </p>
      </div>
    </li>
  );
};

const ComingSoon = () => {
  return (
    <Section
      heading="Coming Soon"
      subheading="Exciting features we're working on to make your cooking experience even better"
      classes="bg-forked-background"
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-forked-background p-8 shadow-lg">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <ListItem key={index} feature={feature} />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default ComingSoon;
