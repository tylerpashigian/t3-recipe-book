import Fraction from "fraction.js";
import { SHA256 as sha256 } from "crypto-js";

export const formatFraction = (decimal: number | undefined) => {
  if (!decimal) return 0;
  const fraction = new Fraction(decimal);
  return fraction.toFraction(true);
};

export const hashPassword = (string: string) => {
  return sha256(string).toString();
};
