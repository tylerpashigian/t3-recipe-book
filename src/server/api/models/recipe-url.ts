import { z } from "zod";

export const RecipeUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .url()
  .refine((value) => {
    try {
      const url = new URL(value);
      return (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        !url.port
      );
    } catch {
      return false;
    }
  }, "Enter a public recipe URL.");
