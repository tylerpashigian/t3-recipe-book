import { useEffect, useState } from "react";

const useInput = (
  isValid: (value: string) => boolean = () => true,
  value = "",
) => {
  const [inputValue, setInputValue] = useState(value);
  const [inputTouched, setInputTouched] = useState(false);

  const isValueValid = isValid(inputValue);
  const isInputInvalid = !isValueValid && inputTouched;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const valueHandler = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(event.target.value);
  };

  const blurHandler = () => {
    setInputTouched(true);
  };

  const reset = () => {
    setInputValue("");
    setInputTouched(false);
  };

  return {
    inputValue,
    isValueValid,
    isInputInvalid,
    valueHandler,
    blurHandler,
    reset,
  };
};

export default useInput;
