import { useSession } from "next-auth/react";
import { useState } from "react";
import useInput from "~/hooks/useInput";
import Image from "next/image";
import IngredientForm from "./ingredient-form";
import { RouterOutputs } from "~/utils/api";

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

type RecipeWithUser = RouterOutputs["recipes"]["getAll"][number];

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
  ingredients = [],
  name = "",
  description = "",
  instructions = "",
}: Props) => {
  const [localIngredients, setLocalIngredients] = useState(ingredients);
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
    reset: resetRecipeDescriptionInput,
  } = useInput((value: string) => true, description);

  const {
    inputValue: recipeInstrcutions,
    valueHandler: recipeInstructionsHandler,
    reset: resetRecipeInstructionsInput,
  } = useInput((value: string) => true, instructions);

  const addIngredient = (ingredient: Ingredient) => {
    console.log(ingredient);

    setLocalIngredients([...ingredients, ingredient]);
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
    setLocalIngredients(updatedIngredients);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    console.log(updatedIngredient);

    const newIngredients = [...localIngredients].map(
      (ingredient: Ingredient) => {
        return editableIngredient?.id === ingredient.id
          ? updatedIngredient
          : ingredient;
      },
    );

    setLocalIngredients(newIngredients);

    // submitRecipe(
    //   { ...props.recipe, ingredients: newIngredients },
    //   props.recipe?._id
    // );

    setEditableIngredient(null);
    setIngredientFormState(IngredientType.Add);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
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
      <form onSubmit={onSubmitHandler}>
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
        {localIngredients.map((ingredient: Ingredient) => {
          return (
            <div key={ingredient.id} className="flex gap-2">
              <p>
                {ingredient.name} ({ingredient.quantity} {ingredient.unit})
              </p>
              <div onClick={() => deleteIngredient(ingredient.id)}>x</div>
              <div onClick={() => editIngredient(ingredient)}>edit</div>
            </div>
          );
        })}
        <IngredientForm
          addIngredient={addIngredient}
          ingredient={editableIngredient}
          viewState={ingredientFormState}
          updateIngredient={updateIngredient}
        />
      </form>
    </>
  );
};

export default RecipeForm;
