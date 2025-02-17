import { useState } from "react";

import toast from "react-hot-toast";
import { type FieldApi, useForm } from "@tanstack/react-form";
import { IoClose } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import { formatFraction } from "~/utils/conversions";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Combobox, type OptionType } from "../UI/combobox";
import { Textarea } from "../UI/textarea";
import {
  type IngredientSummary,
  type IngredientFormModel,
} from "~/models/ingredient";
import {
  type Recipe,
  type Category,
  type RecipeFormModel,
} from "~/models/recipe";
import {
  categoryToOption,
  convertRecipeToRecipeForm,
  optionToCategory,
} from "~/models/mappings/recipe";
import IngredientForm from "./ingredient-form";
import IngredientPopover from "./ingredient-popover";
import { toFirstLetterUppercase } from "~/utils/string";

export enum IngredientFormType {
  Add,
  Edit,
}

type Props = {
  categories?: Category[];
  allIngredients?: IngredientSummary[];
  recipe?: Recipe;
  isLoading?: boolean;
  onSubmit?: (recipe: RecipeFormModel) => Promise<void> | void;
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
  const [ingredientIndex, setIngredientIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<RecipeFormModel>({
    defaultValues: { ...convertRecipeToRecipeForm(recipe) },
    onSubmit: async ({ value }) => {
      await onSubmitHandler(value);
    },
  });

  const deleteIngredient = (index: number) => {
    // if (!id) return;
    // const index = (form.getFieldValue("ingredients") ?? []).findIndex(
    //   (ingredient) => ingredient.ingredientId === id,
    // );
    form.fieldInfo.ingredients.instance
      ?.removeValue(index)
      .catch(() => toast.error("Error deleting ingredient"));
  };

  const onSubmitHandler = async (value: RecipeFormModel) => {
    try {
      await onSubmit?.(value);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);
  const [tempIngredient, setTempIngredient] = useState<
    IngredientFormModel | undefined
  >(undefined);

  const isCreating = recipe === undefined;
  const buttonText = isCreating ? "Submit" : "Update";

  const addIngredientButton = (
    field: FieldApi<
      RecipeFormModel,
      "ingredients",
      undefined,
      undefined,
      IngredientFormModel[]
    >,
  ) => {
    return (
      <Button
        variant={"ghost"}
        onClick={(e) => {
          e.preventDefault();
          setIsCreatingIngredient(true);

          field.pushValue({
            recipeId: recipe?.id,
            name: "",
            quantity: null,
            unit: null,
          });
          // I need to get the new index in the ingredients array here to set
          // the ingredientIndex globally which triggers the modal opening
          // How can I confirm the value has been added before searching?
          // const index = form.state.values.ingredients?.findIndex(
          //   (ingredient) => ingredient.ingredientId === ingredientId,
          // );

          // if (index !== undefined) setIngredientIndex(index);
          setIngredientIndex(field.state.value.length - 1);
          setIsOpen(true);
        }}
      >
        Add Ingredient
      </Button>
    );
  };

  // TODO figure out how to handle this without recreating the whole array
  const handleIngredientCancel = (index: number) => {
    const updatedIngredients = [...(form.state.values.ingredients ?? [])];
    if (tempIngredient) {
      // form.setFieldValue(`ingredients[${index}]`, tempValue);
      updatedIngredients[index] = tempIngredient;
      form.setFieldValue("ingredients", updatedIngredients);
      setIsCreatingIngredient(false);
    }
  };

  const onCancelIngredient = () => {
    // Is there a better way to do this?
    setTimeout(() => {
      isCreatingIngredient
        ? ingredientIndex !== null && deleteIngredient(ingredientIndex)
        : ingredientIndex !== null && handleIngredientCancel(ingredientIndex);
      setIsCreatingIngredient(false);
      setIngredientIndex(null);
      setTempIngredient(undefined);
    }, 100);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="w-full space-y-2 md:w-3/5"
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
                <Textarea
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
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <form.Field name="servings">
            {(field) => (
              <div className="flex-1">
                <label htmlFor={field.name} className="font-bold">
                  Servings
                </label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  placeholder="Servings"
                  className="mt-2 w-full px-4 py-3 text-black"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? null : Number(e.target.value);
                    field.handleChange(newValue);
                  }}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="prepTime">
            {(field) => (
              <div className="flex-1">
                <label htmlFor={field.name} className="font-bold">
                  Prep time (min)
                </label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  placeholder="Prep time"
                  className="mt-2 w-full px-4 py-3 text-black"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? null : Number(e.target.value);
                    field.handleChange(newValue);
                  }}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="cookTime">
            {(field) => (
              <div className="flex-1">
                <label htmlFor={field.name} className="font-bold">
                  Cook time (min)
                </label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  placeholder="Cook time"
                  className="mt-2 w-full px-4 py-3 text-black"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "" ? null : Number(e.target.value);
                    field.handleChange(newValue);
                  }}
                />
              </div>
            )}
          </form.Field>
        </div>
        <div className="">
          <form.Field
            name="steps"
            mode="array"
            validators={{
              onChange: ({ value }) => {
                const hasErrors = value?.some((step) => step.content === "");
                return hasErrors ? "Empty step" : undefined;
              },
              onBlur: ({ value }) => {
                const hasErrors = value?.some((step) => step.content === "");
                return hasErrors ? "Empty step" : undefined;
              },
            }}
          >
            {(field) => {
              return (
                <>
                  <label htmlFor={field.name} className="font-bold">
                    Instructions
                  </label>
                  <ol className="w-full list-inside list-decimal space-y-2">
                    {(field.state.value ?? []).map((_, i) => (
                      <form.Field
                        key={i}
                        name={`steps[${i}].content`}
                        validators={{
                          onBlur: ({ value }) =>
                            value === "" ? "Please enter a step" : undefined,
                          onChange: ({ value }) =>
                            value === "" ? "Please enter a step" : undefined,
                        }}
                      >
                        {(subField) => {
                          return (
                            <li className="flex w-full flex-col gap-1">
                              <div className="flex w-full items-center justify-between">
                                <p className="text-sm">{i + 1}.</p>
                                <Button
                                  variant={"ghost"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    void field.removeValue(i);
                                  }}
                                >
                                  <IoClose />
                                </Button>
                              </div>
                              <Textarea
                                name={`steps[${i}]`}
                                id={`steps[${i}]`}
                                className={`m-0 w-full px-4 py-3 text-black ${
                                  subField.state.meta.errors.length
                                    ? "border-red-400"
                                    : null
                                }`}
                                value={subField.state.value}
                                onChange={(e) => {
                                  subField.handleChange(e.target.value);
                                  void subField.validate("blur");
                                  void field.validate("change");
                                }}
                                onBlur={subField.handleBlur}
                                placeholder="Step instructions"
                                aria-label="Step instructions"
                              />
                            </li>
                          );
                        }}
                      </form.Field>
                    ))}
                  </ol>
                  <div className="flex justify-end">
                    <Button
                      disabled={field.state.meta.errors?.length > 0}
                      variant="ghost"
                      className="mt-2"
                      onClick={(e) => {
                        e.preventDefault();
                        field.pushValue({
                          id: undefined,
                          content: "",
                          order: field.state.value?.length ?? -1,
                        });
                      }}
                    >
                      Add Step
                    </Button>
                  </div>
                </>
              );
            }}
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
              {(field.state.value ?? []).map(
                (ingredient: IngredientFormModel, i) => {
                  return (
                    <div
                      className="flex items-center justify-between"
                      key={`ingredients[${i}].name`}
                    >
                      <p>
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
                            setTempIngredient(ingredient);
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
                            deleteIngredient(i);
                          }}
                        >
                          <IoClose />
                        </Button>
                      </div>
                    </div>
                  );
                },
              )}
              <IngredientPopover
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onCancel={onCancelIngredient}
                key={ingredientIndex}
              >
                <IngredientForm
                  allIngredients={allIngredients}
                  key={ingredientIndex}
                  i={ingredientIndex}
                  form={form}
                  onEditIngredient={() => {
                    setIsOpen((prev) => !prev);
                    setIsCreatingIngredient(false);
                    setIngredientIndex(null);
                  }}
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
