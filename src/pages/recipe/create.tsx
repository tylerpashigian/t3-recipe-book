import Head from "next/head";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { api } from "~/utils/api";
import RecipeForm from "~/components/recipe-form";
import { type Recipe } from "~/models/recipe";
import WithNavBar from "~/components/UI/with-nabvar";

export default function CreateRecipe() {
  const router = useRouter();

  const { isLoading, mutateAsync: createRecipe } =
    api.recipes.create.useMutation({});

  const onCreate = async (recipeToCreate?: Partial<Recipe>) => {
    if (!recipeToCreate?.name) return;

    const cleanedRecipe = {
      ...recipeToCreate,
      name: recipeToCreate.name,
    };

    const create = createRecipe(cleanedRecipe, {
      onSuccess(createdRecipe) {
        createdRecipe?.id && router.push(`/recipe/${createdRecipe.id}`);
      },
    });

    await toast.promise(create, {
      error: "Failed to create",
      loading: "Creating recipe",
      success: "Recipe created",
    });
  };

  return (
    <>
      <Head>
        <title>Create Recipe</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar>
        <main className="flex flex-col">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <div className="flex flex-col items-center gap-2">
              <RecipeForm onSubmit={onCreate} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </WithNavBar>
    </>
  );
}
