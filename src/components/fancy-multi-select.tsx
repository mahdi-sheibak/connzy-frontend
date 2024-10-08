"use client";

// https://craft.mxkaske.dev/post/fancy-multi-select

import * as React from "react";
import { Loader2Icon, X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type Option = Record<"value" | "label", string>;

interface Props {
  options: Option[];
  selectedOptions: Option[];
  onChange: (options: Option[]) => void;
  placeholder?: string;
  onInputValueChange?: (value: string) => void;
  isLoading?: boolean;
}

export function FancyMultiSelect({
  options,
  selectedOptions,
  onChange,
  placeholder,
  onInputValueChange,
  isLoading,
}: Readonly<Props>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newSelectedOptions = [
        ...selectedOptions.filter((s) => s.value !== option.value),
      ];
      onChange(newSelectedOptions);
    },
    [onChange, selectedOptions]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelectedOptions = [...selectedOptions];
            newSelectedOptions.pop();
            onChange(newSelectedOptions);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onChange, selectedOptions]
  );

  const selectables = options.filter(
    (option) => !selectedOptions.includes(option)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="relative group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => {
                    handleUnselect(option);
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              onInputValueChange && onInputValueChange(value);
            }}
            onBlur={() => {
              setOpen(false);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>

        {isLoading && (
          <Loader2Icon className="absolute right-1 top-2 h-5 w-5 animate-spin" />
        )}
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        onInputValueChange && onInputValueChange("");
                        onChange([...selectedOptions, option]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
