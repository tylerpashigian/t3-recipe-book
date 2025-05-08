import { prisma } from "~/server/db";
import { notFound } from "next/navigation";
import RecipePage from "~/app/recipe/[id]/recipe-page";
import { api } from "~/trpc/server";
import { convertRecipeSchemaToRecipe } from "~/models/mappings/recipe";
import { Metadata } from "next";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const recipe = await api.recipes.getDetails({ id });

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

export async function generateStaticParams() {
  // convert this to api call
  const recipes = await prisma.recipe.findMany({
    select: { id: true },
    take: 10,
  });

  return recipes.map((recipe) => ({ id: recipe.id }));
}

export default async function Recipe({ params }: Props) {
  const { id } = await params;
  const recipe = await api.recipes.getDetails({
    id: id,
  });

  if (!recipe) return notFound();

  const initialRecipe = convertRecipeSchemaToRecipe(recipe);

  return <RecipePage initialRecipe={initialRecipe} />;
}
