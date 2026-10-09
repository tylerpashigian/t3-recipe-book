import { formatFraction } from "~/utils/conversions";

type IngredientAmount = {
  quantity?: number | null;
  unit?: string | null;
};

export const formatIngredientAmount = (
  ingredient: IngredientAmount,
  scalingOption = 1,
) => {
  // Older recipes use zero to represent an unspecified amount.
  if (ingredient.quantity == null || ingredient.quantity === 0) {
    return null;
  }

  const quantity = String(formatFraction(ingredient.quantity * scalingOption));
  const unit = ingredient.unit?.trim();

  return unit ? `${quantity} ${unit}` : `${quantity}`;
};
