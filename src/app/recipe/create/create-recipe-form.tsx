"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";

import { useRecipe } from "~/hooks/data/recipe";
import RecipeForm from "~/components/recipe/recipe-form";
import WithNavBar from "~/components/UI/with-nabvar";
import { type RecipeFormModel } from "~/models/recipe";
import { Button } from "~/components/UI/button";
import { Input } from "~/components/UI/input";
import { api } from "~/trpc/react";

export default function CreateRecipeForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { create, isLoading, categories, allIngredients } = useRecipe();
  const [url, setUrl] = useState("");
  const [draft, setDraft] = useState<RecipeFormModel>();
  const importer = api.recipes.importFromUrl.useMutation({
    onSuccess: setDraft,
  });

  const createHandler = async (recipeToCreate?: RecipeFormModel) => {
    if (!recipeToCreate?.name || !userId) return;

    const createRecipe = create(
      recipeToCreate,
      userId,
      (newRecipe) =>
        newRecipe.recipe.id && router.push(`/recipe/${newRecipe.recipe.id}`),
    );

    await toast.promise(createRecipe, {
      error: (error: unknown) =>
        error instanceof Error ? error.message : "Failed to create recipe.",
      loading: "Creating recipe",
      success: "Recipe created",
    });
  };

  return (
    <>
      <WithNavBar classes="bg-forked-neutral">
        <main className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-6 md:py-12">
          {!draft ? (
            <form
              className="mb-7 space-y-2 rounded-lg border border-border bg-forked-background p-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (url.trim() && !importer.isPending)
                  importer.mutate({ url: url.trim() });
              }}
            >
              <label
                className="block font-semibold"
                htmlFor="recipe-import-url"
              >
                Paste a recipe URL
              </label>
              <p className="text-sm text-muted-foreground">
                Import a recipe from a website to fill in the form below.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="recipe-import-url"
                  type="url"
                  maxLength={2048}
                  placeholder="https://example.com/recipe"
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                    if (importer.error) importer.reset();
                  }}
                  disabled={importer.isPending}
                  aria-describedby={
                    importer.error ? "recipe-import-error" : undefined
                  }
                  aria-invalid={Boolean(importer.error)}
                />
                <Button
                  type="submit"
                  disabled={!url.trim() || importer.isPending || isLoading}
                >
                  {importer.isPending ? "Preparing draft…" : "Import recipe"}
                </Button>
              </div>
              {importer.error ? (
                <p
                  id="recipe-import-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {importer.error.message}
                </p>
              ) : null}
              {importer.isPending ? (
                <span role="status" className="sr-only">
                  Preparing recipe draft
                </span>
              ) : null}
            </form>
          ) : null}
          <RecipeForm
            key={draft ? "imported" : "manual"}
            draft={draft}
            allIngredients={allIngredients}
            categories={categories}
            onSubmit={createHandler}
            isLoading={isLoading || importer.isPending}
          />
        </main>
      </WithNavBar>
    </>
  );
}
