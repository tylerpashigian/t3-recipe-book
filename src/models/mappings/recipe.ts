import { OptionType } from "~/components/UI/combobox";
import { Category } from "../recipe";

export const categoryToOption = (category: Category): OptionType => {
  return {
    value: category.id,
    label: category.name,
  };
};

export const optionToCategory = (category: OptionType): Category => {
  return {
    id: category.value,
    name: category.label,
  };
};
