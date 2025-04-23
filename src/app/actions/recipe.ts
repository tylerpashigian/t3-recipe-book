"use server";

import { revalidatePath } from "next/cache";

export async function revalidateRecipePath(id: string): Promise<void> {
  revalidatePath(`/recipe/${id}`);
  return Promise.resolve();
}
