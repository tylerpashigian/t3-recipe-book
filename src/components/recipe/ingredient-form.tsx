import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineCheck, MdOutlineEdit } from "react-icons/md";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { type Ingredient } from "~/models/ingredient";
import { type Recipe } from "~/models/recipe";
import { type useForm } from "@tanstack/react-form";
import { formatFraction } from "~/utils/conversions";

const IngredientForm = ({
  ingredient,
  i,
  form,
  onDelete,
  onEditIngredient,
}: {
  ingredient: Ingredient;
  i: number;
  form: ReturnType<typeof useForm<Partial<Recipe>>>;
  onDelete: (id: string) => void;
  onEditIngredient: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isEditing, setIsEditing] = useState(ingredient.name === "");

  const ingredientRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && ingredientRef.current) {
      ingredientRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isEditing]);

  useLayoutEffect(() => {
    onEditIngredient(isEditing);
  }, [isEditing, onEditIngredient]);

  const state = form.useStore();

  const nameError = "Please enter an ingredient name";
  const nameIsEmpty = state.values.ingredients?.[i]?.name === "" ?? true;

  return (
    <div
      className="flex w-full items-center justify-between gap-2"
      ref={ingredientRef}
    >
      <div className="flex gap-2">
        <form.Field
          key={`ingredients[${i}].name`}
          name={`ingredients[${i}].name`}
          validators={{
            onChange: ({ value }) => (value === "" ? nameError : undefined),
            onBlur: ({ value }) => (value === "" ? nameError : undefined),
          }}
        >
          {(subfield) =>
            isEditing ? (
              <Input
                name={subfield.name}
                id={subfield.name}
                type="text"
                className={`w-full px-4 py-3 text-black ${
                  subfield.state.meta.errors.length ? "border-red-400" : null
                }`}
                value={subfield.state.value}
                onChange={(e) => subfield.handleChange(e.target.value)}
                onBlur={subfield.handleBlur}
                placeholder="Ingredient name"
                aria-label="Ingredient name"
              />
            ) : (
              <p>{subfield.state.value}</p>
            )
          }
        </form.Field>
        <form.Field
          key={`ingredients[${i}].newQuantity`}
          name={`ingredients[${i}].newQuantity`}
        >
          {(subfield) =>
            isEditing ? (
              <Input
                name={subfield.name}
                id={subfield.name}
                type="number"
                className="w-full px-4 py-3 text-black"
                value={subfield.state.value ?? ""}
                onBlur={subfield.handleBlur}
                onChange={(e) => subfield.handleChange(+e.target.value)}
                placeholder="Ingredient quantity"
                aria-label="Ingredient quantity"
              />
            ) : subfield.state.value ? (
              <p> - {formatFraction(+subfield.state.value)}</p>
            ) : null
          }
        </form.Field>
        <form.Field
          key={`ingredients[${i}].unit`}
          name={`ingredients[${i}].unit`}
        >
          {(subfield) =>
            isEditing ? (
              <Input
                name={subfield.name}
                id={subfield.name}
                type="text"
                className="w-full px-4 py-3 text-black"
                value={subfield.state.value ?? ""}
                onBlur={subfield.handleBlur}
                onChange={(e) => subfield.handleChange(e.target.value)}
                placeholder="Ingredient unit"
                aria-label="Ingredient unit"
              />
            ) : subfield.state.value ? (
              <p>{subfield.state.value}</p>
            ) : null
          }
        </form.Field>
      </div>
      <div className="flex gap-2 hover:cursor-pointer">
        <Button
          variant={"ghost"}
          disabled={nameIsEmpty}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing((prev) => {
              return !prev;
            });
          }}
        >
          {isEditing ? <MdOutlineCheck /> : <MdOutlineEdit />}
        </Button>
        <Button
          variant={"ghost"}
          onClick={(e) => {
            e.preventDefault();
            onDelete(ingredient.ingredientId);
          }}
        >
          <IoClose />
        </Button>
      </div>
    </div>
  );
};

export default IngredientForm;
