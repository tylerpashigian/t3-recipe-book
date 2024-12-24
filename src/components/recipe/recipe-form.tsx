import { useState } from "react";

import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import { formatFraction } from "~/utils/conversions";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Combobox, type OptionType } from "../UI/combobox";
import { Textarea } from "../UI/textarea";
import { type Ingredient } from "~/models/ingredient";
import { type Recipe, type Category } from "~/models/recipe";
import { categoryToOption, optionToCategory } from "~/models/mappings/recipe";
import IngredientForm from "./ingredient-form";
import IngredientPopover from "./ingredient-popover";
import { type Ingredient as PrismaIngredient } from "@prisma/client";
import { toFirstLetterUppercase } from "~/utils/string";

export enum IngredientFormType {
  Add,
  Edit,
}

type Props = {
  categories?: Category[];
  allIngredients?: PrismaIngredient[];
  recipe?: Recipe;
  isLoading?: boolean;
  onSubmit?: (recipe?: Partial<Recipe>) => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
};

const RecipeForm = ({
  recipe,
  allIngredients = [],
  categories = [],
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

  const [ingredientIndex, setIngredientIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Partial<Recipe>>({
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
      instructions: instructions ?? "",
      categories: [...(recipe?.categories ?? [])],
      ingredients: [...(recipeIngredients ?? [])],
    },
    onSubmit: async ({ value }) => {
      await onSubmitHandler(value);
    },
  });

  const deleteIngredient = (id: string | null) => {
    if (!id) return;
    const index = (form.getFieldValue("ingredients") ?? []).findIndex(
      (ingredient) => ingredient.ingredientId === id,
    );
    form.fieldInfo.ingredients.instance
      ?.removeValue(index)
      .catch(() => toast.error("Error deleting ingredient"));
  };

  const onSubmitHandler = async (value: Partial<Recipe>) => {
    const recipeToUpsert = {
      ...recipe,
      name: value.name,
      description: value.description,
      instructions: value.instructions,
      ingredients: value.ingredients,
      categories: value.categories,
    };

    try {
      await onSubmit?.(recipeToUpsert);
      form.reset();
    } catch (error) {}
  };

  const isCreating = recipe === undefined;
  const buttonText = isCreating ? "Submit" : "Update";

  const addIngredientButton = (
    field: FieldApi<
      Partial<Recipe>,
      "ingredients",
      undefined,
      undefined,
      | {
          ingredientId: string;
          recipeId: string;
          name: string;
          quantity: number | null;
          unit: string | null;
        }[]
      | undefined
    >,
  ) => {
    return (
      <Button
        variant={"ghost"}
        onClick={(e) => {
          e.preventDefault();
          const ingredientId = uuidv4();
          field.pushValue({
            // Temp id to manage local state
            ingredientId: ingredientId,
            recipeId: "",
            name: "",
            quantity: null,
            unit: null,
          });
          // I need to get the new index in the ingredients array here to set
          // the ingredientIndex globally which triggers the modal opening
          // How can I confirm the value has been added before searching?
          const index = form.state.values.ingredients?.findIndex(
            (ingredient) => ingredient.ingredientId === ingredientId,
          );

          if (index !== undefined) setIngredientIndex(index);
          setIsOpen(true);
        }}
      >
        Add Ingredient
      </Button>
    );
  };

  const togglePopoverHandler = async () => {
    const removeEmptyIngredient = (): Promise<void> => {
      return new Promise((resolve) => {
        if (ingredientIndex !== null) {
          form.state.values.ingredients?.[ingredientIndex]?.name === ""
            ? deleteIngredient(
                form.state.values.ingredients?.[ingredientIndex]
                  ?.ingredientId ?? null,
              )
            : null;
          setIngredientIndex(null);
        }
        resolve();
      });
    };
    removeEmptyIngredient().then(() => setIsOpen((prev) => !prev));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="w-full space-y-2 md:w-1/2"
    >
      <div className="flex flex-col space-y-2">
        <div>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value === "" ? "Please enter a recipe name" : undefined,
            }}
          >
            {(field) => (
              <>
                <label htmlFor={field.name} className="font-bold">
                  Recipe Name
                </label>
                <Input
                  type="text"
                  id={field.name}
                  className="mt-2 w-full px-4 py-3 text-black"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors ? (
                  <p className="mt-2 text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="categories">
            {(field) => (
              <>
                <label className="font-bold">Recipe Categories</label>
                <Combobox
                  className="mt-2"
                  options={[...(categories ?? []).map(categoryToOption)]}
                  selected={(field.state.value ?? []).map(categoryToOption)}
                  onChange={(value: OptionType[]) =>
                    field.setValue(value.map(optionToCategory))
                  }
                  placeholder="Select a Category..."
                />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="description">
            {(field) => (
              <>
                <label htmlFor={field.name} className="font-bold">
                  Recipe Description
                </label>
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  className="mt-2 w-full px-4 py-3 text-black"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="instructions">
            {(field) => (
              <>
                <label htmlFor={field.name} className="font-bold">
                  Instructions
                </label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-black"
                  rows={3}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
        </div>
      </div>
      <form.Field name="ingredients" mode="array">
        {(field) => {
          return (
            <>
              <div className="flex items-center justify-between">
                <p className="font-bold">Ingredients</p>
                {addIngredientButton(field)}
              </div>
              {(field.state.value ?? []).map((ingredient: Ingredient, i) => {
                return (
                  // <AnimatePresence key={i}>
                  <div
                    className="flex items-center justify-between"
                    key={`ingredients[${i}].name`}
                    // layoutId={`modal-${i}`}
                    // animate={isDesktop}
                  >
                    <p
                    //  layoutId={`title-${i}`}
                    >
                      {toFirstLetterUppercase(ingredient.name)}{" "}
                      {ingredient.quantity
                        ? `(${formatFraction(ingredient.quantity)} ${
                            ingredient.unit
                          })`
                        : null}
                    </p>
                    <div className="flex gap-2 hover:cursor-pointer">
                      <Button
                        variant={"ghost"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIngredientIndex(i);
                          setIsOpen(true);
                        }}
                      >
                        <MdOutlineEdit />
                      </Button>
                      <Button
                        variant={"ghost"}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteIngredient(ingredient.ingredientId);
                        }}
                      >
                        <IoClose />
                      </Button>
                    </div>
                  </div>
                  // </AnimatePresence>
                );
              })}
              <IngredientPopover
                isOpen={isOpen}
                setIsOpen={togglePopoverHandler}
                key={ingredientIndex}
              >
                <IngredientForm
                  allIngredients={allIngredients}
                  key={ingredientIndex}
                  i={ingredientIndex}
                  form={form}
                  onEditIngredient={togglePopoverHandler}
                />
              </IngredientPopover>
            </>
          );
        }}
      </form.Field>
      <div className="mx-auto flex justify-center gap-2 pt-6">
        {!isCreating && (
          <Button variant={"secondary"} onClick={onCancel}>
            <>Cancel</>
          </Button>
        )}
        <form.Subscribe
          selector={(state) =>
            [
              state.canSubmit,
              state.isSubmitting,
              state.isTouched,
              state.isDirty,
            ] as const
          }
        >
          {([canSubmit, isSubmitting, isTouched, isDirty]) => {
            return (
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !canSubmit ||
                  isSubmitting ||
                  !isTouched ||
                  !isDirty ||
                  !!ingredientIndex
                }
              >
                <>{isLoading ? "Loading" : buttonText}</>
              </Button>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};

export default RecipeForm;
