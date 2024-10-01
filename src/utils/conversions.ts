import Fraction from 'fraction.js'
export const formatFraction = (decimal: number | undefined) => {
  if (!decimal) return 0;
  const fraction = new Fraction(decimal);
  return fraction.toFraction(true);
}
