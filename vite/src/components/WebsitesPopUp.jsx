"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function WebsietsPopUp({ domains = [], selectedDomain, onSelectDomain }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100px] justify-between shadow-sm border-none overflow-hidden flex"
        >
          <p className="overflow-hidden max-w-full text-nowrap text-ellipsis">
            {selectedDomain
              ? domains.find((domain) => domain.value === selectedDomain)?.label
              : "Domain"}
          </p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Domain..." />
          <CommandList>
            <CommandEmpty>No Domain found.</CommandEmpty>
            <CommandGroup>
              {domains.map((domain) => (
                <CommandItem
                  key={domain.value}
                  value={domain.value}
                  onSelect={(currentValue) => {
                    onSelectDomain(currentValue === selectedDomain ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {domain.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedDomain === domain.value ? "opacity-100" : "opacity-0"
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

