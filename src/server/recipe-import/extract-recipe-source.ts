import { load } from "cheerio";
import { z } from "zod";

const recipeMetadata = z.object({
  "@type": z.union([z.string(), z.array(z.string())]),
  name: z.string().optional(),
  description: z.string().optional(),
  recipeIngredient: z.array(z.string()).optional(),
  recipeInstructions: z.unknown(),
  recipeCategory: z.unknown(),
  recipeYield: z.unknown(),
  prepTime: z.unknown(),
  cookTime: z.unknown(),
});

const metadataNode = z.object({ "@graph": z.array(z.unknown()).optional() });
const maxLines = 150;

function findRecipe(
  nodes: unknown[],
): z.infer<typeof recipeMetadata> | undefined {
  for (const node of nodes.flat()) {
    const recipe = recipeMetadata.safeParse(node);
    if (
      recipe.success &&
      [recipe.data["@type"]].flat().some((type) => /(?:^|\/)Recipe$/.test(type))
    )
      return recipe.data;
    const graph = metadataNode.safeParse(node);
    if (graph.success && graph.data["@graph"]) {
      const nested = findRecipe(graph.data["@graph"]);
      if (nested) return nested;
    }
  }
}

function plainText(text: string) {
  return load(text, {}, false).text().trim();
}

const instructionNode = z.object({
  name: z.string().optional(),
  text: z.string().optional(),
  itemListElement: z.unknown(),
});

function instructionText(input: unknown): { name: string; text: string }[] {
  if (typeof input === "string") return [{ name: "", text: plainText(input) }];
  if (Array.isArray(input)) return input.flatMap(instructionText);
  const parsed = instructionNode.safeParse(input);
  if (!parsed.success) return [];
  const { name, text, itemListElement } = parsed.data;
  if (itemListElement)
    return instructionText(itemListElement).map((step) => ({
      ...step,
      name: name ?? step.name,
    }));
  const content = text?.trim() ? text : name;
  return content ? [{ name: "", text: plainText(content) }] : [];
}

export function extractRecipeSource(html: string) {
  const $ = load(html);
  const recipe = findRecipe(
    $('script[type="application/ld+json"]')
      .toArray()
      .flatMap((script) => {
        try {
          const data: unknown = JSON.parse($(script).text());
          return [data];
        } catch {
          return [];
        }
      }),
  );

  const card = $(".wprm-recipe-container").first();
  const cardIngredients = card
    .find(".wprm-recipe-ingredient-group")
    .toArray()
    .flatMap((group) => {
      const section =
        $(group).find(".wprm-recipe-group-name").first().text().trim() || null;
      return $(group)
        .find(".wprm-recipe-ingredient")
        .toArray()
        .map((line) => ({
          text: $(line).text().trim(),
          section,
        }));
    });
  const metadataIngredients =
    recipe?.recipeIngredient?.map(plainText).filter(Boolean) ?? [];
  const sourceIngredients = metadataIngredients.length
    ? metadataIngredients.map((text, index) => ({
        text,
        section:
          cardIngredients.length === metadataIngredients.length
            ? cardIngredients[index]?.section ?? null
            : null,
      }))
    : cardIngredients.filter(({ text }) => Boolean(text));
  if (
    sourceIngredients.length > maxLines ||
    sourceIngredients.some(({ text }) => text.length > 2000)
  ) {
    throw new Error(
      "The recipe has too many or unusually long ingredient lines.",
    );
  }

  const instructions = instructionText(recipe?.recipeInstructions);
  let pageLines: { sourceIndex: number; text: string }[] = [];
  if (
    !sourceIngredients.length ||
    !instructions.length ||
    !recipe?.name ||
    !recipe.description
  ) {
    $(
      "script, style, noscript, template, nav, footer, aside, [hidden], #comments, .comments-area",
    ).remove();
    const article = $("article, main").first();
    const body = card.length ? card : article.length ? article : $("body");
    body.find("br").replaceWith("\n");
    body.find("h1,h2,h3,h4,p,li,div").each((_, block) => {
      $(block).prepend("\n").append("\n");
    });
    pageLines = body
      .text()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n")
      .slice(0, 35000)
      .split("\n")
      .map((text, sourceIndex) => ({ sourceIndex, text }));
  }

  return {
    name: recipe?.name ? plainText(recipe.name) : null,
    description: recipe?.description ? plainText(recipe.description) : null,
    ingredients: sourceIngredients.map((line, sourceIndex) => ({
      ...line,
      sourceIndex,
    })),
    instructions,
    category: recipe?.recipeCategory,
    yield: recipe?.recipeYield,
    prepTime: recipe?.prepTime,
    cookTime: recipe?.cookTime,
    pageLines,
  };
}
