import { useId, useState } from "react";

import { type useForm } from "@tanstack/react-form";
import { Minus, Plus } from "lucide-react";

import { type RecipeFormModel } from "~/models/recipe";
import { type IngredientSummary } from "~/models/ingredient";
import { formatFraction } from "~/utils/conversions";
import { formatIngredientAmount } from "./utils/ingredient-display";
import { toFirstLetterUppercase } from "../../utils/string";
import { Badge } from "../UI/badge";
import { Button } from "../UI/button";
import { Combobox } from "../UI/combobox";
import { Input } from "../UI/input";
import IngredientUnitField from "./ingredient-unit-field";

const IngredientForm = ({
  i,
  form,
  onEditIngredient,
  allIngredients = [],
}: {
  i: number | null;
  form: ReturnType<typeof useForm<RecipeFormModel>>;
  onEditIngredient: () => void;
  allIngredients?: IngredientSummary[];
}) => {
  const state = form.useStore();
  const fieldId = useId();
  const ingredient = i === null ? undefined : state.values.ingredients[i];
  const selected = allIngredients.find(
    ({ id }) => id === ingredient?.ingredientId,
  );
  const hasEmptyCustomUnit =
    ingredient?.unit != null && !ingredient.unit.trim();

  const [quantityIncrement, setQuantityIncrement] = useState<
    number | undefined
  >(undefined);

  const ingredientQuantities = [1 / 4, 1 / 3, 1 / 2, 1];

  return (
    <>
      {i !== null ? (
        <div className="flex w-full items-center justify-between gap-2">
          <div
            key={`ingredients[${i}].name`}
            className="flex w-full flex-col items-center justify-between gap-2"
          >
            <div className="flex w-full min-w-0 flex-col gap-2">
              <div className="space-y-2">
                <p className="font-bold">Pantry ingredient</p>
                <Combobox
                  aria-label="Pantry ingredient"
                  isMultiSelect={false}
                  options={allIngredients.map(({ id, name }) => ({
                    label: toFirstLetterUppercase(name),
                    value: id,
                  }))}
                  selected={
                    selected
                      ? [
                          {
                            label: toFirstLetterUppercase(selected.name),
                            value: selected.id,
                          },
                        ]
                      : []
                  }
                  onChange={([option]) => {
                    if (!option || !ingredient) return;
                    void form.replaceFieldValue("ingredients", i, {
                      ...ingredient,
                      ingredientId: option.value,
                      newIngredientName: undefined,
                      name: ingredient.name.trim()
                        ? ingredient.name
                        : option.label,
                    });
                  }}
                  placeholder="Select an ingredient"
                />
                {ingredient?.newIngredientName === undefined ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!ingredient) return;
                      void form.replaceFieldValue("ingredients", i, {
                        ...ingredient,
                        ingredientId: undefined,
                        newIngredientName: ingredient.name,
                      });
                    }}
                  >
                    Add a new catalog ingredient
                  </Button>
                ) : (
                  <div className="space-y-1">
                    <label htmlFor={`${fieldId}-catalog-name`}>
                      New catalog name
                    </label>
                    <Input
                      id={`${fieldId}-catalog-name`}
                      maxLength={250}
                      value={ingredient.newIngredientName}
                      onChange={(event) => {
                        const name = event.target.value;
                        void form.replaceFieldValue("ingredients", i, {
                          ...ingredient,
                          newIngredientName: name,
                          name:
                            ingredient.name === ingredient.newIngredientName
                              ? name
                              : ingredient.name,
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Added when you save the recipe.
                    </p>
                  </div>
                )}
              </div>
              <form.Field name={`ingredients[${i}].name`}>
                {(field) => (
                  <div className="space-y-1">
                    <label htmlFor={`${fieldId}-name`} className="font-bold">
                      Recipe wording
                    </label>
                    <Input
                      id={`${fieldId}-name`}
                      maxLength={250}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                    />
                  </div>
                )}
              </form.Field>
              {ingredient?.originalLine ? (
                <p className="text-sm text-muted-foreground">
                  Original line: {ingredient.originalLine}
                </p>
              ) : null}
              <p>
                <span className="font-bold">Quantity: </span>
                <span>
                  {formatIngredientAmount(
                    state.values.ingredients?.[i] ?? {},
                  ) ?? "Quantity not specified"}
                </span>
              </p>
              <form.Field
                key={`ingredients[${i}].quantity`}
                name={`ingredients[${i}].quantity`}
              >
                {(subfield) => (
                  <div className="flex flex-col gap-2" id={subfield.name}>
                    <label>Amount</label>
                    <div>
                      {ingredientQuantities.map((quantity, i) => (
                        <Badge
                          key={i}
                          variant={
                            quantity === quantityIncrement
                              ? "default"
                              : "outline"
                          }
                          className="m-1 hover:cursor-pointer"
                          onClick={() => {
                            subfield.handleChange((prev) => {
                              return !prev || prev === 0 ? quantity : prev;
                            });
                            setQuantityIncrement(quantity);
                          }}
                        >
                          <p>{formatFraction(quantity)}</p>
                        </Badge>
                      ))}
                      <Badge
                        variant={"destructive"}
                        className="m-1 hover:cursor-pointer"
                        onClick={() => subfield.handleChange(null)}
                      >
                        <p>Clear</p>
                      </Badge>
                    </div>
                    <div className="flex w-full gap-2">
                      <Button
                        type="button"
                        className="w-full"
                        disabled={!quantityIncrement}
                        onClick={() =>
                          subfield.handleChange((prev) => {
                            const updatedValue =
                              (prev ?? 0) - (quantityIncrement ?? 0);
                            return updatedValue > 0 ? updatedValue : null;
                          })
                        }
                        aria-label="Decrement"
                      >
                        <Minus />
                      </Button>
                      <Button
                        type="button"
                        className="w-full"
                        disabled={!quantityIncrement}
                        onClick={() =>
                          subfield.handleChange(
                            (prev) => (prev ?? 0) + (quantityIncrement ?? 0),
                          )
                        }
                        aria-label="Increment"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                )}
              </form.Field>
              <form.Field
                key={`ingredients[${i}].unit`}
                name={`ingredients[${i}].unit`}
                validators={{
                  onChange: ({ value }) =>
                    value !== null && !value.trim()
                      ? "Please enter a custom unit"
                      : undefined,
                }}
              >
                {(subfield) => (
                  <IngredientUnitField
                    value={subfield.state.value}
                    onChange={subfield.handleChange}
                    onBlur={subfield.handleBlur}
                  />
                )}
              </form.Field>
              <form.Field name={`ingredients[${i}].notes`}>
                {(subfield) => (
                  <div className="mt-2 flex flex-col gap-2">
                    <label htmlFor={`${fieldId}-notes`}>
                      Preparation notes{" "}
                      <span className="text-muted-foreground">· optional</span>
                    </label>
                    <Input
                      id={`${fieldId}-notes`}
                      value={subfield.state.value ?? ""}
                      onChange={(event) =>
                        subfield.handleChange(event.target.value)
                      }
                      onBlur={subfield.handleBlur}
                      placeholder="e.g. chopped, diced, or softened"
                      aria-describedby={`${fieldId}-notes-help`}
                    />
                    <p
                      id={`${fieldId}-notes-help`}
                      className="text-sm text-muted-foreground"
                    >
                      Shown with this ingredient when you cook.
                    </p>
                  </div>
                )}
              </form.Field>
            </div>
            <div className="flex w-full justify-end hover:cursor-pointer">
              <Button
                type="button"
                disabled={
                  !ingredient?.name.trim() ||
                  (!ingredient.ingredientId &&
                    !ingredient.newIngredientName?.trim()) ||
                  (ingredient.quantity !== null &&
                    (!Number.isFinite(ingredient.quantity) ||
                      ingredient.quantity < 0)) ||
                  hasEmptyCustomUnit
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditIngredient();
                }}
              >
                <p>Apply</p>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IngredientForm;
