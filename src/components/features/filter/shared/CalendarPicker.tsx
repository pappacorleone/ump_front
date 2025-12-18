'use client'

import { FC, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons'

interface CalendarPickerProps {
  selectedStart?: Date
  selectedEnd?: Date
  onDateSelect?: (date: Date) => void
  onRangeSelect?: (start: Date, end: Date) => void
  mode?: 'single' | 'range'
  minDate?: Date
  maxDate?: Date
  className?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const CalendarPicker: FC<CalendarPickerProps> = ({
  selectedStart,
  selectedEnd,
  onDateSelect,
  onRangeSelect,
  mode = 'range',
  minDate,
  maxDate,
  className
}) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    selectedStart ? new Date(selectedStart.getFullYear(), selectedStart.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [rangeStart, setRangeStart] = useState<Date | undefined>(selectedStart)
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(selectedEnd)
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)

  // Get days in month
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    if (mode === 'single' && rangeStart) {
      return isSameDay(date, rangeStart)
    }
    if (rangeStart && isSameDay(date, rangeStart)) return true
    if (rangeEnd && isSameDay(date, rangeEnd)) return true
    return false
  }

  const isDateInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false
    return date > rangeStart && date < rangeEnd
  }

  const isToday = (date: Date) => isSameDay(date, today)

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return

    if (mode === 'single') {
      setRangeStart(date)
      onDateSelect?.(date)
      return
    }

    // Range mode
    if (!isSelectingEnd || !rangeStart) {
      // Start new range
      setRangeStart(date)
      setRangeEnd(undefined)
      setIsSelectingEnd(true)
    } else {
      // Complete range
      if (date < rangeStart) {
        // User clicked before start, swap
        setRangeEnd(rangeStart)
        setRangeStart(date)
        onRangeSelect?.(date, rangeStart)
      } else {
        setRangeEnd(date)
        onRangeSelect?.(rangeStart, date)
      }
      setIsSelectingEnd(false)
    }
  }

  return (
    <div className={cn('p-3', className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-hover-surface transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} className="text-text-secondary" />
        </button>
        <span className="text-sm font-medium text-text-primary">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-hover-surface transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} className="text-text-secondary" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center text-xs font-medium text-text-tertiary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="w-8 h-8" />
          }

          const disabled = isDateDisabled(date)
          const selected = isDateSelected(date)
          const inRange = isDateInRange(date)
          const todayDate = isToday(date)

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={cn(
                'w-8 h-8 flex items-center justify-center text-sm rounded-full',
                'transition-colors duration-150',
                // Base state
                !selected && !inRange && !disabled && 'hover:bg-hover-surface text-text-primary',
                // Selected state
                selected && 'bg-voice-accent text-white',
                // In range state
                inRange && 'bg-voice-accent/20 text-text-primary',
                // Today indicator (when not selected)
                todayDate && !selected && 'ring-1 ring-voice-accent',
                // Disabled state
                disabled && 'opacity-30 cursor-not-allowed'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Range indicator text */}
      {mode === 'range' && rangeStart && (
        <div className="mt-3 text-xs text-text-secondary text-center">
          {rangeEnd ? (
            <>
              {formatDate(rangeStart)} - {formatDate(rangeEnd)}
            </>
          ) : (
            <>Select end date</>
          )}
        </div>
      )}
    </div>
  )
}

// Helper functions
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
