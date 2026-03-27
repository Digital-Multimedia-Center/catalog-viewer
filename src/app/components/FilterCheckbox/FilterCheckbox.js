"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

export function FilterDropdownMenu({ items = [], category }) {
  // Store selected IDs in an array
  const [selectedIds, setSelectedIds] = React.useState([])

  // Toggle selection logic
  const handleCheckedChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) 
        ? prev.filter((itemId) => itemId !== id) 
        : [...prev, id]
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{category}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item._id}
            checked={selectedIds.includes(item._id)}
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
