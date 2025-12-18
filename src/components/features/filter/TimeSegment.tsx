'use client'

import { FC, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'
import { formatTimeRangeLabel } from '@/types/filter'

interface TimeSegmentProps {
  className?: string
}

export const TimeSegment: FC<TimeSegmentProps> = ({ className }) => {
  const segmentRef = useRef<HTMLButtonElement>(null)
  const { timeRange, activePopover, setActivePopover } = useFilterStore()

  const isActive = activePopover === 'time'

  const handleClick = () => {
    setActivePopover(isActive ? null : 'time')
  }

  return (
    <button
      ref={segmentRef}
      type="button"
      onClick={handleClick}
      className={cn(
        'filter-segment filter-segment--highlight',
        isActive && 'filter-segment--active',
        className
      )}
      aria-expanded={isActive}
      aria-haspopup="dialog"
    >
      <span>{formatTimeRangeLabel(timeRange)}</span>
      <ChevronDown
        size={14}
        className={cn(
          'text-voice-accent/70 transition-transform duration-200',
          isActive && 'rotate-180'
        )}
      />
    </button>
  )
}
