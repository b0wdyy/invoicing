'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { forwardRef } from 'react'

export interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    className?: string
    id?: string
    name?: string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const [date, setDate] = React.useState<Date | undefined>(value)

        const handleSelect = (selectedDate: Date | undefined) => {
            setDate(selectedDate)
            onChange?.(selectedDate)
        }

        return (
            <div className="relative">
                <input
                    type="hidden"
                    ref={ref}
                    value={date?.toISOString() ?? ''}
                    {...props}
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !date && 'text-muted-foreground',
                                className
                            )}
                        >
                            {date ? (
                                format(date, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

DatePicker.displayName = 'DatePicker'
