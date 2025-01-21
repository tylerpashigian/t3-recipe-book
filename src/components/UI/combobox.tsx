import * as React from "react";
import { cn } from "~/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "~/components/UI/badge";
import { Button } from "~/components/UI/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/UI/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/popover";

export type OptionType = Record<"value" | "label", string>;

interface ComboboxProps {
  options: Record<"value" | "label", string>[];
  selected: Record<"value" | "label", string>[];
  onChange: (value: OptionType[]) => void;
  onBlur?: () => void;
  isMultiSelect?: boolean;
  allowsCustomValue?: boolean;
  className?: string;
  placeholder?: string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      selected,
      onChange,
      onBlur,
      isMultiSelect = true,
      allowsCustomValue = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const handleUnselect = (item: Record<"value" | "label", string>) => {
      onChange(selected.filter((i) => i.value !== item.value));
    };

    // on delete key press, remove last selected item
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // if (e.key === "Backspace" && selected.length > 0) {
        //   onChange(
        //     selected.filter((_, index) => index !== selected.length - 1),
        //   );
        // }

        // close on escape
        if (e.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onChange, selected]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={className}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`group w-full justify-between ${
              selected.length > 1 ? "h-full" : "h-10"
            }`}
            onClick={() => setOpen(!open)}
          >
            <>
              <div className="flex flex-wrap items-center gap-1">
                {isMultiSelect
                  ? selected.map((item) => (
                      <Badge
                        variant="outline"
                        key={item.value}
                        className="flex items-center gap-1 group-hover:bg-background"
                        onClick={() => handleUnselect(item)}
                      >
                        {item.label}
                        <Button
                          asChild
                          variant="outline"
                          size="badgeIcon"
                          className="border-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnselect(item);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUnselect(item);
                          }}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </Badge>
                    ))
                  : selected.map((item, i) => (
                      <p key={`${item.value}_${i}`}>{item.label}</p>
                    ))}
                {selected.length === 0 && (
                  <span>{props.placeholder ?? "Select ..."}</span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className={className}>
            <CommandInput
              value={searchValue}
              onValueChange={setSearchValue}
              onBlur={onBlur}
              placeholder="Search ..."
            />
            <CommandList>
              <CommandEmpty>
                {allowsCustomValue ? (
                  <p
                    className="cursor-pointer p-1"
                    onClick={() =>
                      onChange([
                        {
                          label: searchValue,
                          value: searchValue.toLowerCase(),
                        },
                      ])
                    }
                  >
                    <span className="font-bold">Click to add: </span>
                    {searchValue}
                  </p>
                ) : (
                  <>No item found.</>
                )}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(
                        isMultiSelect
                          ? selected.some((item) => item.value === option.value)
                            ? selected.filter(
                                (item) => item.value !== option.value,
                              )
                            : [...selected, option]
                          : [option],
                      );
                      !isMultiSelect && setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.some((item) => item.value === option.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = "Combobox";

export { Combobox };
