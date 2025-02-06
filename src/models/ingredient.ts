export type Ingredient = {
  id: string;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  recipeId: string;
};

export type IngredientSummary = {
  id: string;
  name: string;
};

export type IngredientFormModel = {
  id?: string | null;
  name: string;
  quantity: number | null;
  unit: string | null;
  recipeId?: string | null;
};
