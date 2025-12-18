'use client'

import { FC, ReactNode, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center'
  width?: number | string
}

export const Popover: FC<PopoverProps> = ({
  isOpen,
  onClose,
  children,
  className,
  position = 'bottom-left',
  width = 320
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      onClose()
    }
  }, [onClose])

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, handleClickOutside, handleEscapeKey])

  if (!isOpen) return null

  const positionClasses = {
    'bottom-left': 'left-0',
    'bottom-right': 'right-0',
    'bottom-center': 'left-1/2 -translate-x-1/2'
  }

  return (
    <div
      ref={popoverRef}
      className={cn(
        'absolute top-full mt-2 z-50',
        'bg-surface border border-border-light rounded-xl shadow-modal',
        'animate-slide-up overflow-hidden',
        positionClasses[position],
        className
      )}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
}

// Popover Header Component
interface PopoverHeaderProps {
  children: ReactNode
  className?: string
  action?: ReactNode
}

export const PopoverHeader: FC<PopoverHeaderProps> = ({
  children,
  className,
  action
}) => (
  <div className={cn(
    'flex items-center justify-between px-4 py-3',
    'border-b border-border-light',
    className
  )}>
    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
      {children}
    </span>
    {action}
  </div>
)

// Popover Content Component
interface PopoverContentProps {
  children: ReactNode
  className?: string
  maxHeight?: number
}

export const PopoverContent: FC<PopoverContentProps> = ({
  children,
  className,
  maxHeight = 320
}) => (
  <div
    className={cn('overflow-y-auto custom-scrollbar', className)}
    style={{ maxHeight: `${maxHeight}px` }}
  >
    {children}
  </div>
)

// Popover Footer Component
interface PopoverFooterProps {
  children: ReactNode
  className?: string
}

export const PopoverFooter: FC<PopoverFooterProps> = ({
  children,
  className
}) => (
  <div className={cn(
    'px-4 py-3 border-t border-border-light',
    className
  )}>
    {children}
  </div>
)
