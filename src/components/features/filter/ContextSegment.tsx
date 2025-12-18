'use client'

import { FC, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'
import { useContactsStore } from '@/stores/useContactsStore'

interface ContextSegmentProps {
  className?: string
}

export const ContextSegment: FC<ContextSegmentProps> = ({ className }) => {
  const segmentRef = useRef<HTMLButtonElement>(null)
  const { selectedContactIds, selectedGroupIds, contactGroups, activePopover, setActivePopover } = useFilterStore()
  const { contacts } = useContactsStore()

  const isActive = activePopover === 'context'

  // Get the first letter of a name for avatar
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  // Generate display content based on selection
  const getDisplayContent = () => {
    const totalSelected = selectedContactIds.length + selectedGroupIds.length

    if (totalSelected === 0) {
      return { text: 'everyone', avatar: null }
    }

    // If only one contact selected, show their name with avatar
    if (selectedContactIds.length === 1 && selectedGroupIds.length === 0) {
      const contact = contacts.find(c => c.id === selectedContactIds[0])
      if (contact) {
        return {
          text: contact.name,
          avatar: {
            initial: getInitial(contact.name),
            type: contact.relationshipType
          }
        }
      }
    }

    // If only one group selected
    if (selectedGroupIds.length === 1 && selectedContactIds.length === 0) {
      const group = contactGroups.find(g => g.id === selectedGroupIds[0])
      if (group) {
        return {
          text: group.name,
          avatar: null,
          isGroup: true
        }
      }
    }

    // Multiple selections
    return {
      text: `${totalSelected} selected`,
      avatar: null
    }
  }

  const handleClick = () => {
    setActivePopover(isActive ? null : 'context')
  }

  const displayContent = getDisplayContent()

  return (
    <button
      ref={segmentRef}
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
        'bg-hover-surface border border-border-light',
        'cursor-pointer transition-all duration-200',
        'hover:border-border-medium',
        isActive && 'border-voice-accent',
        className
      )}
      aria-expanded={isActive}
      aria-haspopup="dialog"
    >
      {displayContent.avatar && (
        <div
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center',
            'text-xs font-medium text-white',
            `filter-avatar--${displayContent.avatar.type}`
          )}
        >
          {displayContent.avatar.initial}
        </div>
      )}
      <span className="text-sm font-medium text-text-primary">
        {displayContent.text}
      </span>
      <ChevronDown
        size={12}
        className={cn(
          'text-text-secondary transition-transform duration-200',
          isActive && 'rotate-180'
        )}
      />
    </button>
  )
}
