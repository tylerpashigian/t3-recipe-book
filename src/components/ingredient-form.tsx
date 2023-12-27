import { v4 as uuidv4 } from "uuid";

import useInput from "~/hooks/useInput";
import type { Ingredient } from "./recipe-form";
import { IngredientType } from "./recipe-form";
import { IoAdd } from "react-icons/io5";

type Props = {
  ingredient?: Ingredient | null;
  updateIngredient: (ingredient: Ingredient) => void;
  addIngredient: (ingredient: Ingredient) => void;
  viewState: IngredientType;
};

const IngredientForm = ({
  ingredient = null,
  updateIngredient,
  addIngredient,
  viewState,
}: Props) => {
  const {
    inputValue: ingredientName,
    valueHandler: ingredientNameHandler,
    reset: resetIngredientNameInput,
  } = useInput(() => true, ingredient?.name);

  const {
    inputValue: ingredientQuantity,
    valueHandler: ingredientQuantityHandler,
    reset: resetTngredientQuantityInput,
  } = useInput(() => true, ingredient?.quantity.toString());

  const {
    inputValue: ingredientUnit,
    valueHandler: ingredientUnitHandler,
    reset: resetIngredientUnitInput,
  } = useInput(() => true, ingredient?.unit);

  const addIngredientLocal = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const ingredient = {
      id: uuidv4(),
      name: ingredientName,
      quantity: +ingredientQuantity,
      unit: ingredientUnit,
    } as Ingredient;

    addIngredient(ingredient);
    resetForm();
  };

  const updateIngredientLocal = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    updateIngredient({
      id: ingredient?.id ?? null,
      name: ingredientName,
      quantity: +ingredientQuantity,
      unit: ingredientUnit,
    });
    resetForm();
  };

  const resetForm = () => {
    resetIngredientNameInput();
    resetTngredientQuantityInput();
    resetIngredientUnitInput();
  };

  return (
    <div className="flex flex-col">
      <p>Add Ingredient</p>
      <div className="mb-md-3 mb-0 mt-2 flex items-center gap-2">
        <div>
          <input
            type="text"
            className="form-input w-full rounded-xl px-4 py-3 text-black"
            value={ingredientName}
            onChange={ingredientNameHandler}
            placeholder="Ingredient name"
            aria-label="Ingredient name"
          />
        </div>
        <div>
          <input
            type="number"
            className="form-input w-full rounded-xl px-4 py-3 text-black"
            value={ingredientQuantity}
            onChange={ingredientQuantityHandler}
            onKeyPress={(e) => !/^\d*\.?\d*$/.test(e.key) && e.preventDefault()}
            placeholder="Ingredient quantity"
            aria-label="Ingredient quantity"
          />
        </div>
        <div>
          <input
            type="text"
            className="form-input w-full rounded-xl px-4 py-3 text-black"
            value={ingredientUnit}
            onChange={ingredientUnitHandler}
            placeholder="Ingredient unit"
            aria-label="Ingredient unit"
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={
              viewState === IngredientType.Edit
                ? updateIngredientLocal
                : addIngredientLocal
            }
          >
            {viewState === IngredientType.Edit ? "Update" : <IoAdd />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientForm;
