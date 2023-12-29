import Link from "next/link";
import React from "react";

import { api } from "~/utils/api";

const Recipes = () => {
  const { data, isLoading } = api.recipes.getAll.useQuery();

  return (
    <>
      <p className="text-2xl">
        {isLoading && "Loading..."}
        {!isLoading && data && data?.length > 0 && `${data.length} recipe(s)`}
      </p>
      <>
        {!isLoading && data && data.length > 0
          ? data.map((recipe) => (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                <p>{recipe.name}</p>
              </Link>
            ))
          : null}
        {!isLoading && (!data || data.length === 0) && <p>No data</p>}
      </>
    </>
  );
};

export default Recipes;
