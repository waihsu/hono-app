"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

interface MultipleSelectProps {
  data: { id: string; name: string }[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds?: string[];
}

export function MultipleSelect({
  data,
  setValue,
  selectedIds,
}: MultipleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchName, setSearchName] = React.useState<string>("");
  const searchData = data.filter((item) =>
    item.name.toLowerCase().includes(searchName.toLowerCase())
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-full"
        >
          <div className="w-full flex flex-wrap gap-2 overflow-x-scroll">
            {selectedIds?.length
              ? selectedIds.map((selectedId, index) => (
                  <span
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" })
                    )}
                    key={index}
                  >
                    {data.find((item) => item.id === selectedId)?.name}
                  </span>
                ))
              : "Select Teams..."}
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <Input
            onChange={(ev) => setSearchName(ev.target.value)}
            placeholder="Search Team..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {searchData.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue: string) => {
                    setValue(
                      selectedIds?.includes(currentValue)
                        ? selectedIds.filter((item) => item !== currentValue)
                        : (pre) => [...pre, currentValue]
                    );
                    // setOpen(false);
                  }}
                >
                  {item.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedIds?.includes(item.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
