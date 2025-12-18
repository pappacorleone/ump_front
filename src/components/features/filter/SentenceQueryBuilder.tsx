'use client'

import { FC, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useFilterStore } from '@/stores/useFilterStore'

// Segment components
import { SourceSegment } from './SourceSegment'
import { TimeSegment } from './TimeSegment'
import { ContextSegment } from './ContextSegment'
import { DraftsButton } from './DraftsButton'

// Popover components
import { SourceSelectorPopover } from './popovers/SourceSelectorPopover'
import { TimeSelectorPopover } from './popovers/TimeSelectorPopover'
import { ContextSelectorPopover } from './popovers/ContextSelectorPopover'
import { DraftsStackPanel } from './popovers/DraftsStackPanel'

interface SentenceQueryBuilderProps {
  className?: string
  showDrafts?: boolean
}

export const SentenceQueryBuilder: FC<SentenceQueryBuilderProps> = ({
  className,
  showDrafts = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { activePopover, closeAllPopovers } = useFilterStore()

  // Close popovers when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      // Check if clicking inside the drafts panel
      const draftsPanel = document.getElementById('drafts-panel')
      if (draftsPanel && draftsPanel.contains(event.target as Node)) {
        return
      }
      closeAllPopovers()
    }
  }, [closeAllPopovers])

  useEffect(() => {
    if (activePopover) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activePopover, handleClickOutside])

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'flex items-center justify-between',
          'px-6 py-4',
          'border-b border-border-light bg-surface',
          className
        )}
      >
        {/* Sentence Query */}
        <div className="flex items-center flex-wrap gap-1 text-lg text-text-secondary">
          <span>Reflect on</span>

          {/* Source Segment with Popover */}
          <div className="relative">
            <SourceSegment />
            {activePopover === 'source' && (
              <SourceSelectorPopover />
            )}
          </div>

          <span>from</span>

          {/* Time Segment with Popover */}
          <div className="relative">
            <TimeSegment />
            {activePopover === 'time' && (
              <TimeSelectorPopover />
            )}
          </div>

          <span>with</span>

          {/* Context Segment with Popover */}
          <div className="relative">
            <ContextSegment />
            {activePopover === 'context' && (
              <ContextSelectorPopover />
            )}
          </div>
        </div>

        {/* Drafts Button */}
        {showDrafts && (
          <DraftsButton />
        )}
      </div>

      {/* Drafts Panel (Slide-out drawer) */}
      <DraftsStackPanel />
    </>
  )
}
