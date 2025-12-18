'use client'

import { FC } from 'react'
import { cn } from '@/lib/utils'
import { MessageSquare, Mail, Mic, Plus, Check } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'
import { useUIStore } from '@/stores/useUIStore'
import { formatSyncTime } from '@/types/filter'
import type { DataSourcePlatform } from '@/types'
import { Checkbox } from '../shared'

interface SourceSelectorPopoverProps {
  className?: string
}

// Platform icon mapping
const PlatformIcon: FC<{ platform: DataSourcePlatform; size?: number }> = ({ platform, size = 20 }) => {
  const iconClass = `platform-icon--${platform}`

  switch (platform) {
    case 'imessage':
      return <MessageSquare size={size} className={iconClass} />
    case 'whatsapp':
      return <MessageSquare size={size} className={iconClass} />
    case 'gmail':
      return <Mail size={size} className={iconClass} />
    case 'voice_memos':
      return <Mic size={size} className={iconClass} />
    default:
      return <MessageSquare size={size} />
  }
}

export const SourceSelectorPopover: FC<SourceSelectorPopoverProps> = ({ className }) => {
  const {
    dataSources,
    selectedSourceIds,
    toggleSource,
    selectAllSources,
    deselectAllSources,
    getAllSourcesSelected
  } = useFilterStore()
  const { setAddSourceModalOpen } = useUIStore()

  const allSelected = getAllSourcesSelected()
  const connectedSources = dataSources.filter(s => s.isConnected)

  const handleSelectAllToggle = () => {
    if (allSelected) {
      deselectAllSources()
    } else {
      selectAllSources()
    }
  }

  const handleConnectNewSource = () => {
    setAddSourceModalOpen(true)
  }

  return (
    <div className={cn('filter-popover w-80', className)}>
      {/* Header */}
      <div className="filter-popover-header">
        <span className="filter-popover-header-title">Data Sources</span>
        <button
          type="button"
          onClick={handleSelectAllToggle}
          className="text-xs font-medium text-voice-accent hover:text-voice-accent/80 transition-colors"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Source List */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {dataSources.map((source) => {
          const isSelected = selectedSourceIds.includes(source.id)
          const isConnected = source.isConnected

          return (
            <div
              key={source.id}
              onClick={() => isConnected && toggleSource(source.id)}
              className={cn(
                'filter-source-item',
                isSelected && 'filter-source-item--selected',
                !isConnected && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Checkbox */}
              <Checkbox
                checked={isSelected}
                onChange={() => toggleSource(source.id)}
                disabled={!isConnected}
                size="md"
              />

              {/* Platform Icon */}
              <div className="w-10 h-10 rounded-lg bg-hover-surface flex items-center justify-center">
                <PlatformIcon platform={source.platform} size={20} />
              </div>

              {/* Source Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-text-primary">
                  {source.name}
                </div>
                <div className="sync-status mt-0.5">
                  <div
                    className={cn(
                      'sync-status-dot',
                      isConnected ? 'sync-status-dot--synced' : 'sync-status-dot--not-connected'
                    )}
                  />
                  <span>
                    {isConnected
                      ? `Synced ${formatSyncTime(source.lastSyncedAt)}`
                      : 'Not connected'
                    }
                  </span>
                </div>
              </div>

              {/* Message Count */}
              {isConnected && source.messageCount > 0 && (
                <div className="text-sm text-text-secondary">
                  {source.messageCount}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer - Connect New Source */}
      <div className="border-t border-border-light">
        <button
          type="button"
          onClick={handleConnectNewSource}
          className="w-full px-4 py-3 flex items-center gap-2 text-sm text-voice-accent hover:bg-hover-surface transition-colors"
        >
          <Plus size={16} />
          <span>Connect new source...</span>
        </button>
      </div>
    </div>
  )
}
