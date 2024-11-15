export const toFirstLetterUppercase = (value?: string) => {
  if (!value || !value.length) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
