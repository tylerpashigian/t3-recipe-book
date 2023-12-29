import { useSession } from "next-auth/react";
import { useState } from "react";
import useInput from "~/hooks/useInput";
import Image from "next/image";
import IngredientForm from "./ingredient-form";
import { api } from "~/utils/api";
import Button, { ButtonStyle } from "./UI/button";
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

export type Ingredient = {
  id: string | null;
  name: string;
  quantity: number;
  unit: string;
};

type Recipe = {
  ingredients: Ingredient[];
  name: string;
  description: string;
  instructions: string;
};

export enum DetailsPageType {
  Details,
  Edit,
}

export enum IngredientType {
  Add,
  Edit,
}

type Props = Partial<Recipe>;

const RecipeForm = ({
  ingredients: recipeIngredients = [],
  name = "",
  description = "",
  instructions = "",
}: Props) => {
  const [ingredients, setIngredients] = useState(recipeIngredients);
  const [editableIngredient, setEditableIngredient] =
    useState<Ingredient | null>(null);
  const [ingredientFormState, setIngredientFormState] = useState(
    IngredientType.Add,
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

  const { isLoading, mutate } = api.recipes.create.useMutation({});

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const editIngredient = (ingredient: Ingredient) => {
    setIngredientFormState(IngredientType.Edit);
    setEditableIngredient(ingredient);
  };

  const deleteIngredient = (id: string | null) => {
    if (!id) return;
    const updatedIngredients = [...ingredients].filter(
      (ingredient: Ingredient) => ingredient.id !== id,
    );
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    const newIngredients = [...ingredients].map((ingredient: Ingredient) => {
      return editableIngredient?.id === ingredient.id
        ? updatedIngredient
        : ingredient;
    });

    setIngredients(newIngredients);
    setEditableIngredient(null);
    setIngredientFormState(IngredientType.Add);
  };

  const reset = () => {
    setIngredients([]);
    resetRecipeInput();
    resetRecipeDescription();
    resetRecipeInstrcutions();
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    mutate({
      name: recipeName,
      description: recipeDescription,
      instructions: recipeInstrcutions,
      ingredients: ingredients,
    });
    reset();
  };

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
      <form onSubmit={onSubmitHandler} className="space-y-2">
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
                  key={ingredient.id}
                  className="flex items-center justify-between gap-2"
                >
                  <p>
                    {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                  </p>
                  <div className="flex gap-2 hover:cursor-pointer">
                    <div onClick={() => editIngredient(ingredient)}>
                      <MdOutlineEdit />
                    </div>
                    <div onClick={() => deleteIngredient(ingredient.id)}>
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
        />
        <div className="mx-auto flex justify-center pt-6">
          <Button
            type="submit"
            disabled={isLoading || recipeFormIsInvalid || !recipeIsValid}
            style={
              isLoading || recipeFormIsInvalid || !recipeIsValid
                ? ButtonStyle.disabled
                : ButtonStyle.primary
            }
          >
            <>{isLoading ? "Loading" : "Submit"}</>
          </Button>
        </div>
      </form>
    </>
  );
};

export default RecipeForm;
