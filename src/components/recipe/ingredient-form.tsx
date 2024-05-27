import { useEffect, useRef } from "react";

import { v4 as uuidv4 } from "uuid";
import { IoAdd } from "react-icons/io5";

import useInput from "~/hooks/useInput";
import { IngredientFormType } from "./recipe-form";
import { type Ingredient } from "~/models/ingredient";
import { Input } from "../UI/input";

type Props = {
  ingredient?: Ingredient | null;
  updateIngredient: (ingredient: Ingredient) => void;
  addIngredient: (ingredient: Ingredient) => void;
  recipeId?: string;
  viewState: IngredientFormType;
};

const IngredientForm = ({
  ingredient = null,
  updateIngredient,
  addIngredient,
  recipeId,
  viewState,
}: Props) => {
  const {
    inputValue: ingredientName,
    isInputInvalid: ingredientNameInputIsInvalid,
    valueHandler: ingredientNameHandler,
    reset: resetIngredientNameInput,
    blurHandler: ingredientNameBlurHandler,
  } = useInput((value: string) => value.trim() !== "", ingredient?.name);

  const {
    inputValue: ingredientQuantity,
    valueHandler: ingredientQuantityHandler,
    reset: resetTngredientQuantityInput,
  } = useInput(() => true, ingredient?.quantity ?? undefined);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    viewState === IngredientFormType.Edit &&
      inputRef.current &&
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [viewState, inputRef.current, ingredient]);

  const addIngredientLocal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const ingredient = {
      // Temp id to manage local state
      ingredientId: uuidv4(),
      name: ingredientName,
      quantity: ingredientQuantity,
      // TODO: create a new interface with optional id?
      recipeId: recipeId ?? "",
    };

    addIngredient(ingredient);
    resetForm();
  };

  const updateIngredientLocal = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    !!ingredient &&
      updateIngredient({
        recipeId: ingredient.recipeId,
        ingredientId: ingredient.ingredientId,
        name: ingredientName,
        quantity: ingredientQuantity,
      });
    resetForm();
  };

  const resetForm = () => {
    resetIngredientNameInput();
    resetTngredientQuantityInput();
  };

  return (
    <div className="flex flex-col">
      <p className="font-bold">
        {viewState === IngredientFormType.Edit
          ? "Update Ingredient"
          : "Add Ingredient"}
      </p>
      <div className="mb-md-3 mb-0 mt-2 flex items-center gap-2">
        <div>
          <Input
            ref={inputRef}
            type="text"
            className="w-full px-4 py-3 text-black"
            value={ingredientName}
            onChange={ingredientNameHandler}
            onBlur={ingredientNameBlurHandler}
            placeholder="Ingredient name"
            aria-label="Ingredient name"
          />
        </div>
        <div>
          <Input
            type="text"
            className="w-full px-4 py-3 text-black"
            value={ingredientQuantity}
            onChange={ingredientQuantityHandler}
            placeholder="Ingredient quantity"
            aria-label="Ingredient quantity"
          />
        </div>
        <div className="flex items-center">
          <button
            disabled={ingredientNameInputIsInvalid}
            onClick={
              viewState === IngredientFormType.Edit
                ? updateIngredientLocal
                : addIngredientLocal
            }
          >
            {viewState === IngredientFormType.Edit ? "Update" : <IoAdd />}
          </button>
        </div>
      </div>
      {ingredientNameInputIsInvalid && (
        <p className="mt-2 text-red-400">Please enter an ingredient name</p>
      )}
    </div>
  );
};

export default IngredientForm;
