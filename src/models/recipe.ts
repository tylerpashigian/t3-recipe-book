import { type IngredientFormModel, type Ingredient } from "./ingredient";

export type FullRecipe = {
  recipe: Recipe;
  author: Author;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  categories: Category[];
  isFavorited: boolean;
  favoriteCount: number;
};

export type RecipeFormModel = {
  id?: string | null;
  name: string;
  categories: Category[];
  description: string;
  steps: StepFormModel[];
  ingredients: IngredientFormModel[];
};

type StepFormModel = {
  id?: string | null;
  content: string;
  order: number;
};

export type Category = {
  id: string;
  name: string;
};

type Step = {
  id: string;
  content: string;
  order: number;
};

export type Author = {
  id: string;
  name?: string | null;
  profilePicture?: string | null;
  username?: string | null;
};
