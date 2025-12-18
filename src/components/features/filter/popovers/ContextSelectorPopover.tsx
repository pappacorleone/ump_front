'use client'

import { FC, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Check, Users } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'
import { useContactsStore } from '@/stores/useContactsStore'
import { SearchInput } from '../shared'

interface ContextSelectorPopoverProps {
  className?: string
}

export const ContextSelectorPopover: FC<ContextSelectorPopoverProps> = ({ className }) => {
  const {
    selectedContactIds,
    selectedGroupIds,
    contactGroups,
    contactSearchQuery,
    toggleContact,
    toggleGroup,
    clearContactSelection,
    setContactSearchQuery
  } = useFilterStore()

  const { contacts } = useContactsStore()

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!contactSearchQuery.trim()) {
      return contacts
    }
    const query = contactSearchQuery.toLowerCase()
    return contacts.filter(c =>
      c.name.toLowerCase().includes(query)
    )
  }, [contacts, contactSearchQuery])

  // Sort contacts by total messages (most conversations first)
  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => b.totalMessages - a.totalMessages)
  }, [filteredContacts])

  // Filter groups based on search query
  const filteredGroups = useMemo(() => {
    if (!contactSearchQuery.trim()) {
      return contactGroups
    }
    const query = contactSearchQuery.toLowerCase()
    return contactGroups.filter(g =>
      g.name.toLowerCase().includes(query)
    )
  }, [contactGroups, contactSearchQuery])

  // Get group member names for display
  const getGroupMemberNames = (memberIds: string[]) => {
    const members = memberIds
      .map(id => contacts.find(c => c.id === id))
      .filter(Boolean)
      .map(c => c!.name)

    if (members.length <= 2) {
      return members.join(', ')
    }
    return `${members.slice(0, 2).join(', ')} +${members.length - 2}`
  }

  // Get initials for avatar
  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <div className={cn('filter-popover w-80', className)}>
      {/* Search Input */}
      <div className="p-3 border-b border-border-light">
        <SearchInput
          value={contactSearchQuery}
          onChange={setContactSearchQuery}
          placeholder="Search contacts..."
        />
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {/* Everyone Option */}
        <button
          type="button"
          onClick={clearContactSelection}
          className={cn(
            'filter-contact-item w-full',
            selectedContactIds.length === 0 && selectedGroupIds.length === 0 && 'bg-hover-surface'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-text-secondary/20 flex items-center justify-center">
            <Users size={16} className="text-text-secondary" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-text-primary">Everyone</span>
          </div>
          {selectedContactIds.length === 0 && selectedGroupIds.length === 0 && (
            <Check size={16} className="text-voice-accent" />
          )}
        </button>

        {/* Top Matches Section */}
        {sortedContacts.length > 0 && (
          <>
            <div className="px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Top Matches
              </span>
            </div>

            {sortedContacts.map((contact) => {
              const isSelected = selectedContactIds.includes(contact.id)

              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => toggleContact(contact.id)}
                  className={cn('filter-contact-item w-full', isSelected && 'bg-hover-surface')}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      'filter-avatar',
                      `filter-avatar--${contact.relationshipType}`
                    )}
                  >
                    {getInitial(contact.name)}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-text-primary">
                      {contact.name}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {contact.totalMessages} conversations
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <Check size={16} className="text-voice-accent" />
                  )}
                </button>
              )
            })}
          </>
        )}

        {/* Groups Section */}
        {filteredGroups.length > 0 && (
          <>
            <div className="px-4 py-2 mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                Groups
              </span>
            </div>

            {filteredGroups.map((group) => {
              const isSelected = selectedGroupIds.includes(group.id)

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn('filter-contact-item w-full', isSelected && 'bg-hover-surface')}
                >
                  {/* Group Icon */}
                  <div className="w-8 h-8 rounded-full bg-ifs-lens/20 flex items-center justify-center">
                    <Users size={16} className="text-ifs-lens" />
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-text-primary">
                      {group.name}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      Includes {getGroupMemberNames(group.memberIds)}
                    </div>
                  </div>

                  {/* Selected Indicator / Chevron */}
                  {isSelected ? (
                    <Check size={16} className="text-voice-accent" />
                  ) : (
                    <span className="text-text-tertiary">&rsaquo;</span>
                  )}
                </button>
              )
            })}
          </>
        )}

        {/* No Results */}
        {sortedContacts.length === 0 && filteredGroups.length === 0 && contactSearchQuery && (
          <div className="px-4 py-8 text-center text-sm text-text-tertiary">
            No contacts found matching &quot;{contactSearchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  )
}
