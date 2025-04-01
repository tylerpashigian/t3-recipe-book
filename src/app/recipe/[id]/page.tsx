import { prisma } from "~/server/db";
import { notFound } from "next/navigation";
import RecipePage from "~/app/recipe/[id]/recipe-page";
import { api } from "~/trpc/server";
import { convertRecipeSchemaToRecipe } from "~/models/mappings/recipe";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ id: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    select: { id: true },
    take: 10, // Match `max: 10` from your old getStaticPaths
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
