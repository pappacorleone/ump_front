'use client'

import { FC, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'

interface SourceSegmentProps {
  className?: string
}

export const SourceSegment: FC<SourceSegmentProps> = ({ className }) => {
  const segmentRef = useRef<HTMLButtonElement>(null)
  const { dataSources, selectedSourceIds, activePopover, setActivePopover } = useFilterStore()

  const isActive = activePopover === 'source'

  // Generate display text based on selection
  const getDisplayText = () => {
    const selectedCount = selectedSourceIds.length
    const connectedCount = dataSources.filter(s => s.isConnected).length

    if (selectedCount === 0) {
      return 'no conversations'
    }

    if (selectedCount === connectedCount) {
      return 'all conversations'
    }

    // Show names of selected sources
    const selectedNames = dataSources
      .filter(s => selectedSourceIds.includes(s.id))
      .map(s => s.name)

    if (selectedNames.length <= 2) {
      return selectedNames.join(' & ')
    }

    return `${selectedNames.slice(0, 2).join(', ')} +${selectedNames.length - 2}`
  }

  const handleClick = () => {
    setActivePopover(isActive ? null : 'source')
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
      <span>{getDisplayText()}</span>
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
