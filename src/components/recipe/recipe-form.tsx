import { useState } from "react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Combobox, type OptionType } from "../UI/combobox";
import { Textarea } from "../UI/textarea";
import { v4 as uuidv4 } from "uuid";
import { type Ingredient } from "~/models/ingredient";
import { type Recipe, type Category } from "~/models/recipe";
import { categoryToOption, optionToCategory } from "~/models/mappings/recipe";
import { type FieldApi, useForm } from "@tanstack/react-form";
import IngredientForm from "./ingredient-form";

export enum IngredientFormType {
  Add,
  Edit,
}

type Props = {
  categories?: Category[];
  recipe?: Recipe;
  isLoading?: boolean;
  onSubmit?: (recipe?: Partial<Recipe>) => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
};

const RecipeForm = ({
  recipe,
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
  const [isEditingIngredient, setIsEditingIngredient] = useState(false);

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
    const updatedIngredients = [
      ...(form.getFieldValue("ingredients") ?? []),
    ].filter((ingredient: Ingredient) => ingredient.ingredientId !== id);
    form.setFieldValue("ingredients", updatedIngredients);
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
          quantity: string | null;
          newQuantity: number | null;
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
          field.pushValue({
            // Temp id to manage local state
            ingredientId: uuidv4(),
            recipeId: "",
            name: "",
            quantity: null,
            newQuantity: null,
            unit: null,
          });
          setIsEditingIngredient(true);
        }}
      >
        Add Ingredient
      </Button>
    );
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
              {field.state.value?.length ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Ingredients</p>
                    {addIngredientButton(field)}
                  </div>
                  {field.state.value.map((ingredient: Ingredient, i) => {
                    return (
                      <IngredientForm
                        key={ingredient.ingredientId}
                        ingredient={ingredient}
                        i={i}
                        form={form}
                        onDelete={deleteIngredient}
                        onEditIngredient={setIsEditingIngredient}
                      />
                    );
                  })}
                </>
              ) : (
                <div className="flex justify-center">
                  {addIngredientButton(field)}
                </div>
              )}
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
            [state.canSubmit, state.isSubmitting, state.isTouched] as const
          }
        >
          {([canSubmit, isSubmitting, isTouched]) => (
            <Button
              type="submit"
              disabled={
                isLoading ||
                !canSubmit ||
                isSubmitting ||
                !isTouched ||
                isEditingIngredient
              }
            >
              <>{isLoading ? "Loading" : buttonText}</>
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

export default RecipeForm;
