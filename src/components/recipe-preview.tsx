"use client";

import React from "react";

import { Card } from "~/components/UI/card";
import { Section } from "~/components/UI/section";
import RecipeDetails from "./recipe/recipe-details";
import { Recipe } from "~/models/recipe";

const RecipePreview = () => {
  const mockRecipe: Recipe = {
    id: "1",
    name: "Classic Margherita Pizza",
    description:
      "A timeless Italian classic featuring fresh mozzarella, ripe tomatoes, and aromatic basil on a perfectly crispy crust.",
    servings: 4,
    prepTime: 20,
    cookTime: 15,
    ingredients: [
      {
        id: "1",
        name: "All-purpose flour",
        recipeId: "1",
      },
      { id: "2", name: "Active dry yeast", recipeId: "1" },
      { id: "3", name: "Fresh mozzarella cheese", recipeId: "1" },
      { id: "4", name: "Fresh basil leaves", recipeId: "1" },
      { id: "5", name: "Olive oil", recipeId: "1" },
      { id: "6", name: "Salt", recipeId: "1" },
      { id: "7", name: "Ripe tomatoes", recipeId: "1" },
    ],
    steps: [
      {
        id: "1",
        content: "Combine flour, yeast, and salt in a bowl.",
        order: 0,
      },
      {
        id: "2",
        content: "Knead the dough for 8-10 minutes until smooth.",
        order: 1,
      },
      {
        id: "3",
        content: "Let the dough rise for 1 hour until doubled in size.",
        order: 2,
      },
      {
        id: "4",
        content: "Preheat oven to 475°F (245°C).",
        order: 3,
      },
      {
        id: "5",
        content: "Shape the dough into a pizza base and add toppings.",
        order: 4,
      },
      {
        id: "6",
        content: "Bake for 10-12 minutes until crust is golden.",
        order: 5,
      },
    ],
    categories: [{ id: "1", name: "Italian" }],
    isFavorited: false,
    favoriteCount: 13,
  };

  return (
    <Section
      heading="See It In Action"
      subheading="Take a look at how beautiful your recipes will look"
      classes="bg-forked-neutral"
    >
      <div className="flex items-center justify-center">
        <Card className="group relative flex h-[600px] w-full flex-col justify-between overflow-hidden border border-border bg-forked-background transition-shadow">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
          <div className="overflow-hidden">
            <RecipeDetails
              recipe={mockRecipe}
              pageTypeHandler={function (): void {
                console.log("Not implemented for preview");
              }}
              onDelete={function (): Promise<void> {
                console.log("Not implemented for preview");
                return Promise.resolve();
              }}
              onFavorite={function (favorited: boolean): Promise<void> {
                console.log("Not implemented for preview");
                return Promise.resolve();
              }}
            />
          </div>
        </Card>
      </div>
    </Section>
  );
};

export default RecipePreview;
