import React from "react";

type Props = {
  children: JSX.Element;
  disabled?: boolean;
  style?: ButtonStyle;
  size?: ButtonSize;
  type?: "submit" | "button" | "reset";
  onClickHandler?: () => void;
};

export enum ButtonStyle {
  primary = "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300",
  secondary = "border border-transparent bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300",
  disabled = "border border-transparent bg-gray-400 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300",
}

export enum ButtonSize {
  default = "w-auto",
  full = "w-full",
}

const Button = ({
  children,
  disabled = false,
  style = ButtonStyle.primary,
  size = ButtonSize.default,
  type = "button",
  onClickHandler,
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md px-8 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${style} ${size}`}
      type={type}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
