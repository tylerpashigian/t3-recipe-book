import { useId, useState } from "react";

import { badgeVariants } from "../UI/badge";
import { Input } from "../UI/input";

const ingredientUnits: string[] = [
  "cups",
  "tbsp",
  "tsp",
  "liter",
  "milliliter",
  "fluid ounce",
  "pint",
  "quart",
  "gallon",
  "gram",
  "kilogram",
  "ounce",
  "pound",
  "cloves",
  "dash",
  "pinch",
  "drop",
  "stick",
];

const IngredientUnitField = ({
  value,
  onChange,
  onBlur,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  onBlur: () => void;
}) => {
  const fieldId = useId();
  const [isCustomUnit, setIsCustomUnit] = useState(
    () => value !== null && !ingredientUnits.includes(value),
  );
  const hasEmptyCustomUnit = isCustomUnit && !value?.trim();

  return (
    <div className="flex flex-col gap-2">
      <p id={`${fieldId}-unit-label`}>Unit</p>
      <div role="group" aria-labelledby={`${fieldId}-unit-label`}>
        <button
          type="button"
          aria-pressed={!isCustomUnit && !value}
          className={badgeVariants({
            variant: !isCustomUnit && !value ? "default" : "outline",
            className: "m-1",
          })}
          onClick={() => {
            setIsCustomUnit(false);
            onChange(null);
          }}
        >
          No unit
        </button>
        {ingredientUnits.map((unit) => (
          <button
            type="button"
            key={unit}
            aria-pressed={!isCustomUnit && unit === value}
            className={badgeVariants({
              variant: !isCustomUnit && unit === value ? "default" : "outline",
              className: "m-1",
            })}
            onClick={() => {
              setIsCustomUnit(false);
              onChange(unit);
            }}
          >
            {unit}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={isCustomUnit}
          className={badgeVariants({
            variant: isCustomUnit ? "default" : "outline",
            className: "m-1",
          })}
          onClick={() => {
            if (!isCustomUnit) {
              setIsCustomUnit(true);
              onChange("");
            }
          }}
        >
          custom
        </button>
      </div>
      {isCustomUnit ? (
        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-custom-unit`}>Custom unit</label>
          <Input
            id={`${fieldId}-custom-unit`}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder="e.g. sprigs, jars, or bunches"
            aria-invalid={hasEmptyCustomUnit}
            aria-describedby={
              hasEmptyCustomUnit ? `${fieldId}-unit-error` : undefined
            }
          />
          {hasEmptyCustomUnit ? (
            <p
              id={`${fieldId}-unit-error`}
              className="text-sm text-destructive"
            >
              Please enter a custom unit.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default IngredientUnitField;
