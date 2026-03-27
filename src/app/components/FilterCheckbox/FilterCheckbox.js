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
} from "@/components/ui/dropdown-menu"

export function DropdownMenuCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)

  const toggleStatusBar = () => {
    setShowStatusBar((prev) => !prev);
  };

  return (
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={toggleStatusBar}
          >
            Status Bar
          </DropdownMenuCheckboxItem>
  )
}

