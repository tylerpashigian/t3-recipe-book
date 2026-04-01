import { formatFraction } from "~/utils/conversions";

type IngredientAmount = {
  quantity?: number | null;
  unit?: string | null;
};

export const formatIngredientAmount = (
  ingredient: IngredientAmount,
  scalingOption = 1,
) => {
  if (ingredient.quantity === null || ingredient.quantity === undefined) {
    return null;
  }

  const quantity = String(formatFraction(ingredient.quantity * scalingOption));
  const unit = ingredient.unit?.trim();

  return unit ? `${quantity} ${unit}` : `${quantity}`;
};
