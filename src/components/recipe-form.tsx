import { useSession } from "next-auth/react";
import { useState } from "react";
import useInput from "~/hooks/useInput";
import Image from "next/image";
import IngredientForm from "./ingredient-form";
import Button, { ButtonStyle } from "./UI/button";
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { type Ingredient } from "~/models/ingredient";
import { type Recipe } from "~/models/recipe";

export enum IngredientFormType {
  Add,
  Edit,
}

type Props = {
  recipe?: Recipe;
  isLoading?: boolean;
  onSubmit?: (recipe?: Partial<Recipe>) => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
};

const RecipeForm = ({
  recipe,
  isLoading = false,
  onSubmit,
  onCancel,
}: Props) => {
  const {
    description,
    ingredients: recipeIngredients,
    instructions,
    name,
  } = recipe ?? {};
  const [ingredients, setIngredients] = useState(recipeIngredients ?? []);
  const [editableIngredient, setEditableIngredient] =
    useState<Ingredient | null>(null);
  const [ingredientFormState, setIngredientFormState] = useState(
    IngredientFormType.Add,
  );

  const { data } = useSession();

  const {
    inputValue: recipeName,
    isValueValid: recipeIsValid,
    isInputInvalid: recipeFormIsInvalid,
    valueHandler: recipeNameHandler,
    blurHandler: recipeNameBlurHandler,
    reset: resetRecipeInput,
  } = useInput((value: string) => value.trim() !== "", name);

  const {
    inputValue: recipeDescription,
    valueHandler: recipeDescriptionHandler,
    reset: resetRecipeDescription,
  } = useInput(() => true, description);

  const {
    inputValue: recipeInstrcutions,
    valueHandler: recipeInstructionsHandler,
    reset: resetRecipeInstrcutions,
  } = useInput(() => true, instructions);

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const editIngredient = (ingredient: Ingredient) => {
    setIngredientFormState(IngredientFormType.Edit);
    setEditableIngredient(ingredient);
  };

  const deleteIngredient = (id: string | null) => {
    if (!id) return;
    const updatedIngredients = [...ingredients].filter(
      (ingredient: Ingredient) => ingredient.ingredientId !== id,
    );
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    const newIngredients = [...ingredients].map((ingredient: Ingredient) => {
      return editableIngredient?.ingredientId === ingredient.ingredientId
        ? updatedIngredient
        : ingredient;
    });

    setIngredients(newIngredients);
    setEditableIngredient(null);
    setIngredientFormState(IngredientFormType.Add);
  };

  const reset = () => {
    setIngredients([]);
    resetRecipeInput();
    resetRecipeDescription();
    resetRecipeInstrcutions();
  };

  const onSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const recipeToUpsert = {
      ...recipe,
      name: recipeName,
      description: recipeDescription,
      instructions: recipeInstrcutions,
      ingredients: ingredients,
    };
    try {
      await onSubmit?.(recipeToUpsert);
      reset();
    } catch (error) {}
  };

  const isCreating = recipe === undefined;
  const buttonText = isCreating ? "Submit" : "Update";

  return (
    <>
      {!!data?.user.image && (
        <Image
          src={data.user.image}
          alt={"Profile Picture"}
          width={100}
          height={100}
        />
      )}
      <form
        onSubmit={(event) => void onSubmitHandler(event)}
        className="space-y-2"
      >
        <div className="flex flex-col space-y-2">
          <div>
            <label htmlFor="recipe-name">Recipe Name</label>
            <input
              type="text"
              id="recipe-name"
              className="form-input mt-2 w-full rounded-xl px-4 py-3 text-black"
              value={recipeName}
              onChange={recipeNameHandler}
              onBlur={recipeNameBlurHandler}
            />
            {recipeFormIsInvalid && (
              <p className="mt-2 text-red-400">Please enter a recipe name</p>
            )}
          </div>
          <div>
            <label htmlFor="recipe-description">Recipe Description</label>
            <input
              type="text"
              id="recipe-description"
              className="form-input mt-2 w-full rounded-xl px-4 py-3 text-black"
              value={recipeDescription}
              onChange={recipeDescriptionHandler}
            />
          </div>
          <div>
            <label htmlFor="recipe-instructions">Instructions</label>
            <textarea
              id="recipe-instructions"
              className="form-input mt-2 w-full rounded-xl px-4 py-3 text-black"
              rows={3}
              value={recipeInstrcutions}
              onChange={recipeInstructionsHandler}
            />
          </div>
        </div>
        {ingredients.length ? (
          <>
            <p>Ingredients</p>
            {ingredients.map((ingredient: Ingredient) => {
              return (
                <div
                  key={ingredient.ingredientId}
                  className="flex items-center justify-between gap-2"
                >
                  <p>
                    {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                  </p>
                  <div className="flex gap-2 hover:cursor-pointer">
                    <div onClick={() => editIngredient(ingredient)}>
                      <MdOutlineEdit />
                    </div>
                    <div
                      onClick={() => deleteIngredient(ingredient.ingredientId)}
                    >
                      <IoClose />
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : null}
        <IngredientForm
          addIngredient={addIngredient}
          ingredient={editableIngredient}
          viewState={ingredientFormState}
          updateIngredient={updateIngredient}
          recipeId={recipe?.id}
        />
        <div className="mx-auto flex justify-center gap-2 pt-6">
          {!isCreating && (
            <Button style={ButtonStyle.secondary} onClickHandler={onCancel}>
              <>Cancel</>
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || recipeFormIsInvalid || !recipeIsValid}
            style={
              isLoading || recipeFormIsInvalid || !recipeIsValid
                ? ButtonStyle.disabled
                : ButtonStyle.primary
            }
          >
            <>{isLoading ? "Loading" : buttonText}</>
          </Button>
        </div>
      </form>
    </>
  );
};

export default RecipeForm;
