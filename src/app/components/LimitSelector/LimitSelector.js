"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LimitSelector({ limit, limitOptions, onLimitChange }) {
  return (
    <Select defaultValue={limit.toString()} onValueChange={onLimitChange}>
      <SelectTrigger className="w-20" id="select-rows-per-page">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectGroup>
          {limitOptions.map((item) => (
            <SelectItem key={item} value={item.toString()}>{item}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
