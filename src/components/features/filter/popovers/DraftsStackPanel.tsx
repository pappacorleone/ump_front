'use client'

import { FC, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, Download, Trash2 } from '@/components/ui/Icons'
import { useFilterStore } from '@/stores/useFilterStore'
import type { Draft, DraftType } from '@/types'

interface DraftsStackPanelProps {
  className?: string
}

// Draft type badge component
const DraftTypeBadge: FC<{ type: DraftType }> = ({ type }) => {
  const labels: Record<DraftType, string> = {
    pattern: 'Pattern',
    reply: 'Draft',
    insight: 'Insight'
  }

  return (
    <span className={cn('draft-type-badge', `draft-type-badge--${type}`)}>
      {labels[type]}
    </span>
  )
}

// Individual draft card component
const DraftCard: FC<{ draft: Draft; onRemove: () => void }> = ({ draft, onRemove }) => {
  return (
    <div className="draft-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <DraftTypeBadge type={draft.type} />
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded hover:bg-hover-surface text-text-tertiary hover:text-text-secondary transition-colors"
          aria-label="Remove draft"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      {draft.type === 'reply' && draft.relatedContactName && (
        <div className="text-xs text-text-tertiary italic mb-1">
          Replying to {draft.relatedContactName}:
        </div>
      )}
      <p className="text-sm text-text-primary line-clamp-3">
        &quot;{draft.content}&quot;
      </p>
    </div>
  )
}

export const DraftsStackPanel: FC<DraftsStackPanelProps> = ({ className }) => {
  const { drafts, activePopover, closeAllPopovers, removeDraft, clearDrafts } = useFilterStore()

  const isOpen = activePopover === 'drafts'
  const draftCount = drafts.length

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAllPopovers()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeAllPopovers])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleExportAll = () => {
    // Create export content
    const exportContent = drafts.map(draft => {
      const typeLabel = draft.type === 'pattern' ? 'Pattern' : draft.type === 'reply' ? 'Draft Reply' : 'Insight'
      const header = draft.type === 'reply' && draft.relatedContactName
        ? `[${typeLabel}] Replying to ${draft.relatedContactName}`
        : `[${typeLabel}]`

      return `${header}\n${draft.content}\n---`
    }).join('\n\n')

    // Create and download file
    const blob = new Blob([exportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ginger-drafts-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearWorkspace = () => {
    if (window.confirm('Are you sure you want to clear all drafts? This cannot be undone.')) {
      clearDrafts()
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="drafts-panel-backdrop"
          onClick={closeAllPopovers}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        id="drafts-panel"
        className={cn(
          'drafts-panel w-[360px]',
          isOpen ? 'drafts-panel--open' : 'drafts-panel--closed',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drafts-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border-light">
          <div className="flex items-center gap-3">
            <h2 id="drafts-panel-title" className="text-base font-semibold text-text-primary">
              Drafts & Insights
            </h2>
            {draftCount > 0 && (
              <span className="drafts-count-badge">{draftCount}</span>
            )}
          </div>
          <button
            type="button"
            onClick={closeAllPopovers}
            className="p-2 rounded-lg hover:bg-hover-surface text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {draftCount === 0 ? (
            <div className="text-center py-12 text-text-tertiary">
              <p className="text-sm">No drafts yet</p>
              <p className="text-xs mt-1">Your patterns and draft replies will appear here</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onRemove={() => removeDraft(draft.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {draftCount > 0 && (
          <div className="p-4 border-t border-border-light space-y-2">
            <button
              type="button"
              onClick={handleExportAll}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export All
            </button>
            <button
              type="button"
              onClick={handleClearWorkspace}
              className="btn-ghost w-full flex items-center justify-center gap-2 text-text-secondary hover:text-error"
            >
              <Trash2 size={16} />
              Clear Workspace
            </button>
          </div>
        )}
      </div>
    </>
  )
}
