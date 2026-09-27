import { notFound } from "next/navigation";
import RecipePage from "~/app/recipe/[id]/recipe-page";
import { anonymousApi } from "~/trpc/server";
import { cache } from "react";
import { TRPCError } from "@trpc/server";
import { convertRecipeSchemaToRecipe } from "~/models/mappings/recipe";
import { type Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 3600;

type Props = {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;

// Deduplicate the page and metadata reads within a render, not across viewers.
const getRecipe = cache(async (id: string) => {
  try {
    return await anonymousApi.recipes.getDetails({ id });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
});

export async function generateStaticParams() {
  const recipes = await anonymousApi.recipes.getAll({ max: 10 });
  return recipes.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const recipe = await getRecipe(id);

  if (!recipe) {
    return {
      title: "Recipe not found",
    };
  }

  return {
    title: recipe.recipe.name,
    description: "Find this delicious recipe and more!",
  };
}

export default async function Recipe({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) return notFound();

  const initialRecipe = convertRecipeSchemaToRecipe(recipe);

  return <RecipePage initialRecipe={initialRecipe} />;
}
