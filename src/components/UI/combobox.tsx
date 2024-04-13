import React, { useState } from "react";
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react";
import { HiOutlineCheck, HiOutlineSelector } from "react-icons/hi";

type Options = {
  id: string;
  name: string;
};

type Props<T, P> = {
  options: T extends Options ? T[] : never;
  initialSelections: P extends Options ? P[] : never;
  classes?: string;
  onSelect?: (options: T[]) => void;
};

const Combobox = <T extends Options, P extends Options>({
  options,
  initialSelections,
  classes,
  onSelect,
}: Props<T, P>) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options ?? []
      : (options ?? []).filter((option) => {
          return option.name.toLowerCase().includes(query.toLowerCase());
        });

  const [selectedOptions, setSelectedOptions] = useState<T[]>(
    options.filter((option) =>
      initialSelections.some(
        (selectedOption) => option.id === selectedOption.id,
      ),
    ) as T[],
  );

  const changeHandler = (options: T[]) => {
    setSelectedOptions(options);
    onSelect?.(options);
  };

  return (
    <div className={classes}>
      <HeadlessCombobox
        value={selectedOptions}
        onChange={changeHandler}
        multiple
      >
        <div className="relative">
          {selectedOptions.length ? (
            <p className="mb-2">{selectedOptions.length} Selections</p>
          ) : null}
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <HeadlessCombobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for category"
            />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HiOutlineSelector
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </HeadlessCombobox.Button>
          </div>
          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <HeadlessCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <HeadlessCombobox.Option
                    key={option.id}
                    className={({ active }) =>
                      `relative flex cursor-default select-none py-2 pl-4 pr-10 hover:cursor-pointer ${
                        active ? "bg-gray-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="row flex">
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                              active ? "text-white" : "text-gray-600"
                            }`}
                          >
                            <HiOutlineCheck
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>
    </div>
  );
};

export default Combobox;
