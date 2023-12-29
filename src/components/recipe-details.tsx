import React from "react";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

const RecipeDetails = ({ id }: Props) => {
  const { data, isLoading } = api.recipes.getDetails.useQuery({ id: id });
  const recipe = data?.recipe;

  return (
    <>
      {isLoading && <h3>Loading...</h3>}
      {recipe && !isLoading && (
        <>
          <h3>{recipe.name}</h3>
          {recipe.description && <p>{recipe.description}</p>}
          {recipe.instructions && <p>{recipe.instructions}</p>}
          {recipe.ingredients.map((ingredient) => {
            return (
              <li key={ingredient.ingredientId}>
                {ingredient.name} ({ingredient.quantity} {ingredient.unit})
              </li>
            );
          })}
        </>
      )}
    </>
  );
};

export default RecipeDetails;
