export type Ingredient = {
  id: string;
  ingredientId: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  section?: string | null;
  originalLine?: string | null;
  recipeId: string;
};

export type IngredientSummary = {
  id: string;
  name: string;
};

export type IngredientFormModel = {
  lineId?: string;
  ingredientId?: string;
  newIngredientName?: string;
  suggestedIngredientId?: string;
  alternativeIngredientIds?: string[];
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  section?: string | null;
  originalLine?: string | null;
};
