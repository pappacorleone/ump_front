'use client'

import { FC, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Search, X } from '@/components/ui/Icons'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  inputClassName?: string
  showClearButton?: boolean
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  inputClassName,
  showClearButton = true,
  ...props
}) => {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2',
      'bg-surface border border-border-light rounded-lg',
      'focus-within:border-voice-accent focus-within:ring-1 focus-within:ring-voice-accent/20',
      'transition-all duration-150',
      className
    )}>
      <Search size={16} className="text-text-secondary flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 bg-transparent text-sm text-text-primary',
          'placeholder:text-text-tertiary',
          'outline-none',
          inputClassName
        )}
        {...props}
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="p-0.5 rounded hover:bg-hover-surface transition-colors"
          aria-label="Clear search"
        >
          <X size={14} className="text-text-secondary" />
        </button>
      )}
    </div>
  )
}
