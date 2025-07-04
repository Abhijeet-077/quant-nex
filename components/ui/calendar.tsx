"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  mode?: "single" | "multiple" | "range"
  placeholder?: string
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  mode = "single",
  placeholder = "Pick a date",
  ...props
}: CalendarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (selected) {
      setInputValue(format(selected, "yyyy-MM-dd"))
    }
  }, [selected])

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)

    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        onSelect?.(date)
      }
    } else {
      onSelect?.(undefined)
    }
  }

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
            onClick={handleButtonClick}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium">Select Date</div>
            <Input
              type="date"
              value={inputValue}
              onChange={handleDateChange}
              className="w-full"
              min={disabled ? undefined : "1900-01-01"}
              max={disabled ? undefined : "2100-12-31"}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("")
                  onSelect?.(undefined)
                  setIsOpen(false)
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
