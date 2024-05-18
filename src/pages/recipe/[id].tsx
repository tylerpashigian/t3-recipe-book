import { useState } from "react";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { createServerSideHelpers } from "@trpc/react-query/server";
import toast from "react-hot-toast";
import superjson from "superjson";

import WithNavBar from "~/components/UI/with-nabvar";
import RecipeDetails, {
  DetailsPageType,
} from "~/components/recipe/recipe-details";
import RecipeForm from "~/components/recipe/recipe-form";
import { api } from "~/utils/api";
import prisma from "~/utils/prisma";
import { type Recipe } from "~/models/recipe";
import { appRouter } from "~/server/api/root";

export default function Recipe({ id }: { id: string }) {
  const router = useRouter();

  const [pageType, setPageType] = useState(DetailsPageType.Details);

  const { data, isLoading, refetch } = api.recipes.getDetails.useQuery({
    id: id,
  });
  const { data: categories } = api.recipes.getCategories.useQuery();
  const { isLoading: isUpdating, mutateAsync: updateRecipe } =
    api.recipes.update.useMutation({});
  const { mutateAsync: deleteRecipe } = api.recipes.delete.useMutation({});
  const { mutateAsync: favoriteRecipe } = api.recipes.favorite.useMutation({});

  const recipe: Recipe | undefined | null = data?.recipe;

  const pageTypeHandler = () => {
    setPageType((prevType) =>
      prevType === DetailsPageType.Details
        ? DetailsPageType.Edit
        : DetailsPageType.Details,
    );
  };

  const onUpdate = async (recipeToUpdate?: Partial<Recipe>) => {
    if (
      !recipeToUpdate?.id ||
      !recipeToUpdate?.name ||
      !recipeToUpdate?.authorId
    ) {
      setPageType(DetailsPageType.Details);
      return;
    }

    const cleanedRecipe = {
      ...recipeToUpdate,
      id: recipeToUpdate.id,
      name: recipeToUpdate.name,
      authorId: recipeToUpdate.authorId,
    };

    const update = updateRecipe(cleanedRecipe, {
      async onSuccess() {
        setPageType(DetailsPageType.Details);
        // TODO: update local copy of recipe
        await refetch();
        // const key = getQueryKey(api.recipes.getDetails, undefined, "query");
        // queryClient.setQueryData(key, (oldData) => recipe);
      },
    });

    await toast.promise(update, {
      error: "Failed to update",
      loading: "Updating recipe",
      success: "Updated recipe",
    });
  };

  const cancelHandler = () => {
    setPageType(DetailsPageType.Details);
  };

  const onFavorite = async (favorited: boolean) => {
    if (!recipe) return;
    const favorite = favoriteRecipe(
      {
        id: recipe.id,
        authorId: recipe.authorId,
        isFavorited: favorited,
      },
      {
        async onSuccess() {
          await refetch();
        },
      },
    );
    await toast.promise(favorite, {
      error: "Failed to update",
      loading: "Updating recipe",
      success: "Updated recipe",
    });
  };

  const deleteHandler = async () => {
    if (!data?.recipe?.id || !data.author.id) {
      toast.error("Invalid recipe");
      return;
    }
    const asyncDelete = deleteRecipe(
      { id: data.recipe.id, authorId: data.author.id },
      {
        async onSuccess() {
          await router.push("/");
        },
      },
    );

    await toast.promise(asyncDelete, {
      error: "Failed to delete",
      loading: "Deleting recipe",
      success: "Deleted recipe",
    });
  };

  return (
    <>
      <Head>
        <title>Recipe Details</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WithNavBar>
        <main className="flex flex-col">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <div className="flex flex-col items-center gap-2">
              <>
                {recipe && !isLoading && (
                  <>
                    {pageType === DetailsPageType.Details && (
                      <RecipeDetails
                        recipe={recipe}
                        pageTypeHandler={pageTypeHandler}
                        onDelete={deleteHandler}
                        onFavorite={onFavorite}
                      />
                    )}
                    {pageType === DetailsPageType.Edit && (
                      <RecipeForm
                        categories={categories}
                        recipe={recipe}
                        isLoading={isLoading || isUpdating}
                        onSubmit={(recipe) => onUpdate(recipe)}
                        onCancel={cancelHandler}
                      />
                    )}
                  </>
                )}
              </>
            </div>
          </div>
        </main>
      </WithNavBar>
    </>
  );
}

export async function getStaticPaths({}: GetStaticPropsContext) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });

  const recipes = await helpers.recipes.getAll.fetch({ max: 10 });
  const paths = recipes.map((recipe) => ({ params: { id: recipe.id } }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson,
  });
  const id = context.params?.id ?? "";
  await helpers.recipes.getDetails.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 10,
  };
}
