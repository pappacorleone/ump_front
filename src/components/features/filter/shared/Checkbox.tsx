'use client'

import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Check } from '@/components/ui/Icons'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'rounded border-2 flex items-center justify-center flex-shrink-0',
        'transition-all duration-150',
        sizeClasses[size],
        checked
          ? 'bg-voice-accent border-voice-accent'
          : 'border-border-medium bg-surface hover:border-border-dark',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      {checked && (
        <Check size={iconSizes[size]} className="text-white" />
      )}
    </button>
  )
}

// Radio Button Variant
interface RadioButtonProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RadioButton: FC<RadioButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'rounded-full border-2 flex items-center justify-center flex-shrink-0',
        'transition-all duration-150',
        sizeClasses[size],
        checked
          ? 'border-voice-accent'
          : 'border-border-medium bg-surface hover:border-border-dark',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      {checked && (
        <div className={cn('rounded-full bg-voice-accent', dotSizes[size])} />
      )}
    </button>
  )
}
