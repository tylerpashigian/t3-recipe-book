import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/popover";
import { type Ingredient } from "~/models/ingredient";
import { formatFraction } from "~/utils/conversions";
import { toFirstLetterUppercase } from "~/utils/string";

const ingredientStopWords = new Set([
  "a",
  "an",
  "and",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

type IngredientMatchEntry = {
  name: string;
  quantity: number | null;
  unit: string | null;
  normalizedName: string;
};

type InstructionTokenMatch = {
  text: string;
  start: number;
  end: number;
  token: string;
  separatorAfter: string;
};

const normalizeForMatch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase();

const tokenizeIngredientName = (value: string) =>
  (value.match(/[\p{L}\p{N}']+/gu) ?? [])
    .map((token) => normalizeForMatch(token))
    .filter(
      (token) => token && token.length >= 2 && !ingredientStopWords.has(token),
    );

const formatIngredientQuantity = (
  ingredient: { quantity: number | null; unit: string | null },
  scalingOption: number,
) => {
  if (ingredient.quantity === null || ingredient.quantity === undefined) {
    return "Quantity not listed";
  }

  const quantity = formatFraction(ingredient.quantity * scalingOption);
  return ingredient.unit ? `${quantity} ${ingredient.unit}` : quantity;
};

const isPhraseSeparator = (separator: string) =>
  separator.length > 0 && /^[ \t]+$/.test(separator);

type Props = {
  ingredients: Ingredient[];
  scalingOption: number;
};

export const useInstructions = ({ ingredients, scalingOption }: Props) => {
  const { ingredientPhraseLookup, ingredientTokenLookup, maxPhraseTokens } =
    React.useMemo(() => {
      const phraseLookup = new Map<string, IngredientMatchEntry[]>();
      const tokenLookup = new Map<string, IngredientMatchEntry[]>();
      let maxTokens = 1;

      const addLookupEntry = (
        map: Map<string, IngredientMatchEntry[]>,
        key: string,
        entry: IngredientMatchEntry,
      ) => {
        const existing = map.get(key);
        if (existing) {
          if (
            !existing.some(
              (item) => item.name.toLowerCase() === entry.name.toLowerCase(),
            )
          ) {
            existing.push(entry);
          }
        } else {
          map.set(key, [entry]);
        }
      };

      ingredients.forEach((ingredient) => {
        const name = ingredient.name.trim();
        if (!name) {
          return;
        }

        const tokens = tokenizeIngredientName(name);
        if (!tokens.length) {
          return;
        }

        const ingredientEntry = {
          name,
          quantity: ingredient.quantity ?? null,
          unit: ingredient.unit ?? null,
          normalizedName: tokens.join(" "),
        };

        maxTokens = Math.max(maxTokens, tokens.length);

        tokens.forEach((token) =>
          addLookupEntry(tokenLookup, token, ingredientEntry),
        );

        for (let start = 0; start < tokens.length; start += 1) {
          for (let end = start + 2; end <= tokens.length; end += 1) {
            addLookupEntry(
              phraseLookup,
              tokens.slice(start, end).join(" "),
              ingredientEntry,
            );
          }
        }
      });

      return {
        ingredientPhraseLookup: phraseLookup,
        ingredientTokenLookup: tokenLookup,
        maxPhraseTokens: maxTokens,
      };
    }, [ingredients]);

  const renderInstructionContent = React.useCallback(
    (content: string) => {
      if (!ingredientPhraseLookup.size && !ingredientTokenLookup.size) {
        return content;
      }

      const parts: React.ReactNode[] = [];
      const wordRegex = /[\p{L}\p{N}']+/gu;
      const rawMatches = Array.from(content.matchAll(wordRegex));
      const matches: InstructionTokenMatch[] = rawMatches.map(
        (match, index) => {
          const start = match.index ?? 0;
          const end = start + match[0].length;
          const nextStart = rawMatches[index + 1]?.index;

          return {
            text: match[0],
            start,
            end,
            token: normalizeForMatch(match[0]),
            separatorAfter:
              nextStart === undefined ? "" : content.slice(end, nextStart),
          };
        },
      );

      if (!matches.length) {
        return content;
      }

      let lastIndex = 0;
      let index = 0;

      while (index < matches.length) {
        const current = matches[index];
        const startIndex = current?.start ?? 0;

        if (startIndex > lastIndex) {
          parts.push(content.slice(lastIndex, startIndex));
        }

        let matchedIngredients: IngredientMatchEntry[] | undefined;
        let matchedLength = 0;

        const maxLength = Math.min(maxPhraseTokens, matches.length - index);

        for (let length = maxLength; length >= 2; length -= 1) {
          const separatorsAreValid = matches
            .slice(index, index + length - 1)
            .every((match) => isPhraseSeparator(match.separatorAfter));

          if (!separatorsAreValid) {
            continue;
          }

          const phrase = matches
            .slice(index, index + length)
            .map((match) => match.token)
            .join(" ");
          const phraseMatch = ingredientPhraseLookup.get(phrase);
          if (phraseMatch) {
            const explicitMatches = phraseMatch.filter(
              (ingredient) => ingredient.normalizedName === phrase,
            );
            matchedIngredients = explicitMatches.length
              ? explicitMatches
              : phraseMatch;
            matchedLength = length;
            break;
          }
        }

        if (!matchedIngredients && current) {
          const tokenMatch = ingredientTokenLookup.get(current.token);
          if (!tokenMatch) {
            parts.push(current.text);
            lastIndex = current.end;
            index += 1;
            continue;
          }
          matchedIngredients = tokenMatch;
          matchedLength = 1;
        }

        const endIndex = matches[index + matchedLength - 1]?.end;
        const matchedText = content.slice(startIndex, endIndex);

        const hasMultipleMatches = (matchedIngredients?.length ?? 0) > 1;
        const tooltipText = matchedIngredients?.length
          ? matchedIngredients
              .map((ingredient) => {
                const quantityText = formatIngredientQuantity(
                  ingredient,
                  scalingOption,
                );
                if (hasMultipleMatches) {
                  return `${toFirstLetterUppercase(
                    ingredient.name,
                  )}: ${quantityText}`;
                }
                return quantityText;
              })
              .join("\n")
          : "";

        parts.push(
          <Popover key={`${startIndex}-${matchedText}`}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex whitespace-nowrap rounded bg-secondary-foreground/10 p-[2px] text-left"
              >
                {matchedText}
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              className="max-w-64 w-auto whitespace-pre-line p-2 text-xs leading-relaxed"
            >
              {tooltipText}
            </PopoverContent>
          </Popover>,
        );

        lastIndex = endIndex ?? startIndex + matchedText.length;
        index += matchedLength;
      }

      if (lastIndex < content.length) {
        parts.push(content.slice(lastIndex));
      }

      return parts;
    },
    [
      ingredientPhraseLookup,
      ingredientTokenLookup,
      maxPhraseTokens,
      scalingOption,
    ],
  );

  return { renderInstructionContent };
};
