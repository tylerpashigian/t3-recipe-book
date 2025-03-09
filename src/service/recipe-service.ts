import {
  convertRecipeFormToRecipeRequest,
  convertRecipeSchemaToRecipe,
} from "~/models/mappings/recipe";
import {
  type Category,
  type FullRecipe,
  type RecipeFormModel,
} from "~/models/recipe";
import { api } from "~/trpc/react";
import {
  type QueryObserverResult,
  type RefetchOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

import { convertIngredientSchemaToIngredientSummary } from "~/models/mappings/ingredient";
import { type IngredientSummary } from "~/models/ingredient";
import {
  type FullRecipeSchemaType,
  type GetDetailsOutput,
  type RecipeSchemaResponseType,
} from "~/server/api/models/recipe";

type RecipeServiceType = {
  details: {
    recipe?: FullRecipe | undefined;
    isLoading: boolean;
    refetch: (
      options?: RefetchOptions,
    ) => Promise<QueryObserverResult<GetDetailsOutput, unknown>>;
    favoriteRecipe: (
      recipeId: string,
      authorId: string,
      isFavorited: boolean,
    ) => Promise<void>;
  };
  update: {
    isUpdating: boolean;
    updateRecipe: (
      recipeToUpdate: RecipeFormModel,
      authorId: string,
      onSuccess?: (updatedRecipe: RecipeSchemaResponseType) => void,
    ) => Promise<RecipeSchemaResponseType>;
  };
  create: {
    isCreating: boolean;
    createRecipe: (
      recipeToCreate: RecipeFormModel,
      authorId: string,
      onSuccess?: (newRecipe: FullRecipeSchemaType) => void,
    ) => Promise<FullRecipeSchemaType>;
  };
  delete: {
    isDeleting: boolean;
    deleteRecipe: (
      recipeId: string,
      authorId: string,
      onSuccess?: () => Promise<void>,
    ) => Promise<void>;
  };
  categories: {
    categories?: Category[];
    isLoadingCategories: boolean;
  };
  ingredients: {
    allIngredients: IngredientSummary[];
    isLoadingIngredients: boolean;
  };
};

export const useRecipeService = (id?: string): RecipeServiceType => {
  const queryClient = useQueryClient();

  const { data, isInitialLoading, isLoading, refetch } =
    api.recipes.getDetails.useQuery(
      {
        // eslint doesn't like casting here, so force unwrapping but that is protected by the enabled flag
        id: id!,
      },
      {
        enabled: !!id,
      },
    );

  const { isPending: isUpdating, mutateAsync: update } =
    api.recipes.update.useMutation({});
  const { isPending: isCreating, mutateAsync: create } =
    api.recipes.create.useMutation({});

  const { isPending: isDeleting, mutateAsync: deleteRecipe } =
    api.recipes.delete.useMutation({});
  const { mutateAsync: favorite } = api.recipes.favorite.useMutation({});

  // This should probably move to its own hook
  const { data: categories, isLoading: isLoadingCategories } =
    api.recipes.getCategories.useQuery();
  const { data: allIngredients, isLoading: isLoadingIngredients } =
    api.recipes.getIngredients.useQuery({
      // There is currently no need for search, we always want all ingredients
      // This hook should accept a search term if this changes in the future
      name: "",
    });

  const createRecipe = async (
    recipeToCreate: RecipeFormModel,
    authorId: string,
    onSuccess?: (newRecipe: FullRecipeSchemaType) => void,
  ) => {
    const createdRecipe = await create(
      convertRecipeFormToRecipeRequest(recipeToCreate, authorId),
      { onSuccess },
    );

    return createdRecipe;
  };

  const updateRecipe = async (
    recipeToUpdate: RecipeFormModel,
    authorId: string,
    onSuccess?: (updatedRecipe: RecipeSchemaResponseType) => void,
  ) => {
    const updatedRecipe = await update(
      convertRecipeFormToRecipeRequest(recipeToUpdate, authorId),
      { onSuccess },
    );

    const key = getQueryKey(api.recipes.getDetails, { id }, "query");
    queryClient.setQueryData<GetDetailsOutput | undefined>(key, (prev) => {
      return {
        author: prev?.author,
        recipe: {
          ...updatedRecipe,
        },
      };
    });

    return updatedRecipe;
  };

  const favoriteRecipe = async (
    recipeId: string,
    authorId: string,
    isFavorited: boolean,
  ) => {
    return await favorite(
      {
        id: recipeId,
        authorId: authorId,
        isFavorited: isFavorited,
      },
      {
        async onSuccess() {
          await refetch();
        },
      },
    );
  };

  const deleteRecipeHandler = async (
    recipeId: string,
    authorId: string,
    onSuccess?: () => Promise<void>,
  ) => {
    return await deleteRecipe(
      { id: recipeId, authorId: authorId },
      {
        onSuccess,
      },
    );
  };

  // This is gross, figure out with the conditional id
  const isRecipeLoading = !!id ? isLoading : isInitialLoading;

  const recipeData = data ? convertRecipeSchemaToRecipe(data) : undefined;
  const allIngredientsData = allIngredients
    ? allIngredients.map(convertIngredientSchemaToIngredientSummary)
    : [];

  return {
    details: {
      recipe: recipeData,
      isLoading: isRecipeLoading,
      refetch,
      favoriteRecipe,
    },
    update: {
      isUpdating,
      updateRecipe,
    },
    create: {
      isCreating,
      createRecipe,
    },
    delete: {
      isDeleting,
      deleteRecipe: deleteRecipeHandler,
    },
    categories: {
      categories,
      isLoadingCategories,
    },
    ingredients: {
      allIngredients: allIngredientsData,
      isLoadingIngredients,
    },
  };
};
