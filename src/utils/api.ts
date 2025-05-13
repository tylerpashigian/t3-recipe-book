import { z } from "zod";

export async function parseRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>,
): Promise<T> {
  return schema.parse(await req.json());
}
