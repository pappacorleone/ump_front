'use client'

import { FC } from 'react'
import { cn } from '@/lib/utils'
import { FileText } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'

interface DraftsButtonProps {
  className?: string
}

export const DraftsButton: FC<DraftsButtonProps> = ({ className }) => {
  const { drafts, activePopover, setActivePopover } = useFilterStore()
  const draftCount = drafts.length

  const isActive = activePopover === 'drafts'

  const handleClick = () => {
    setActivePopover(isActive ? null : 'drafts')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        'border border-border-light rounded-lg',
        'text-sm font-medium text-text-secondary',
        'transition-all duration-200',
        'hover:border-border-medium hover:text-text-primary',
        isActive && 'border-voice-accent text-voice-accent',
        className
      )}
      aria-expanded={isActive}
      aria-haspopup="dialog"
    >
      <FileText size={16} />
      <span className="uppercase text-xs tracking-wide">Drafts</span>
      {draftCount > 0 && (
        <span className="drafts-count-badge">
          {draftCount}
        </span>
      )}
    </button>
  )
}
