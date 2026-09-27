import { requireUser } from "~/server/auth/require-user";
import CreateRecipeForm from "./create-recipe-form";

export const metadata = { title: "Create Recipe" };

export default async function CreateRecipe() {
  const user = await requireUser("/recipe/create");
  return <CreateRecipeForm userId={user.id} />;
}
