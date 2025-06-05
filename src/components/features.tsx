import React from "react";

import { BookOpen, Clock, Edit3, Heart, Share, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/UI/card";
import { Section } from "~/components/UI/section";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Beautiful Recipe Views",
    description:
      "Display your recipes with clean, modern layouts that make cooking a pleasure. Clear instructions and organized ingredients.",
  },
  {
    icon: Edit3,
    title: "Easy Editing",
    description:
      "Switch between view and edit modes seamlessly. Add ingredients, modify instructions, and update details with intuitive forms.",
  },
  {
    icon: Clock,
    title: "Smart Organization",
    description:
      "Track prep time, cook time, servings, and categories. Find exactly what you're looking for when you need it.",
  },
  {
    icon: Share,
    title: "Easy Sharing",
    description:
      "Share your favorite recipes with a simple link. No sign-up required for friends or family to view.",
  },
  {
    icon: Users,
    title: "Family Archive",
    description:
      "Collect recipes from different generations in one place. A digital home for your family’s culinary history.",
  },
  {
    icon: Heart,
    title: "Favorites",
    description:
      "Save recipes you love for quick access. Build your personal collection of go-to meals.",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;
  return (
    <Card className="border border-border bg-forked-background shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-forked-accent/10">
          <Icon className="h-6 w-6 text-forked-accent" />
        </div>
        <CardTitle className="text-foreground">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-forked-secondary-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <Section
      heading="Everything You Need"
      subheading="Powerful features designed to make recipe management effortless and enjoyable"
      classes="bg-forked-neutral"
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </Section>
  );
};

export default Features;
