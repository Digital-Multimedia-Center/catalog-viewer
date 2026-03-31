"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function FilterDropdownMenu({ items = [], category, selected = [], onSelectionChange }) {
  const handleCheckedChange = (id) => {
    const isSelected = selected.includes(id);
    const nextSelected = isSelected
      ? selected.filter((itemId) => itemId !== id)
      : [...selected, id];

    onSelectionChange(nextSelected);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {category}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item._id}
            checked={selected.includes(item._id)}
            onCheckedChange={() => handleCheckedChange(item._id)}
            onSelect={(e) => e.preventDefault()}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
