'use client'

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { useFilterStore } from '@/stores/useFilterStore'
import type { TimeRangePreset } from '@/types'
import { RadioButton, CalendarPicker } from '../shared'

interface TimeSelectorPopoverProps {
  className?: string
}

const TIME_PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'all_time', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' }
]

export const TimeSelectorPopover: FC<TimeSelectorPopoverProps> = ({ className }) => {
  const { timeRange, setTimeRangePreset, setCustomDateRange, closeAllPopovers } = useFilterStore()
  const [showCalendar, setShowCalendar] = useState(timeRange.preset === 'custom')

  const handlePresetSelect = (preset: TimeRangePreset) => {
    if (preset === 'custom') {
      setShowCalendar(true)
    } else {
      setShowCalendar(false)
      setTimeRangePreset(preset)
      closeAllPopovers()
    }
  }

  const handleRangeSelect = (start: Date, end: Date) => {
    setCustomDateRange(start, end)
    closeAllPopovers()
  }

  const handleDateSelect = (date: Date) => {
    // For single date selection, set the same start and end
    setCustomDateRange(date, date)
    closeAllPopovers()
  }

  return (
    <div className={cn('filter-popover', showCalendar ? 'w-[480px]' : 'w-56', className)}>
      <div className="flex">
        {/* Presets Column */}
        <div className={cn('py-2', showCalendar ? 'w-44 border-r border-border-light' : 'flex-1')}>
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetSelect(preset.value)}
              className={cn(
                'time-preset w-full',
                timeRange.preset === preset.value && 'time-preset--selected'
              )}
            >
              <RadioButton
                checked={timeRange.preset === preset.value}
                onChange={() => handlePresetSelect(preset.value)}
                size="sm"
              />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Calendar Column */}
        {showCalendar && (
          <div className="flex-1 p-2">
            <CalendarPicker
              selectedStart={timeRange.customStart}
              selectedEnd={timeRange.customEnd}
              onRangeSelect={handleRangeSelect}
              onDateSelect={handleDateSelect}
              mode="range"
              maxDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  )
}
