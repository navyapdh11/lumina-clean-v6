'use client';

import { useId } from 'react';

interface ToggleSwitchProps {
  /** Controlled checked state */
  checked: boolean;
  /** Fires when toggle is clicked */
  onChange: (checked: boolean) => void;
  /** Accessible label for the switch */
  label: string;
  /** Optional description shown next to label */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Off (left) label */
  offLabel?: string;
  /** On (right) label */
  onLabel?: string;
}

/**
 * Premium animated toggle switch.
 * Used for dark/light mode, pricing frequency (weekly/monthly), service view toggles.
 * Follows WAI-ARIA switch role pattern.
 */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  offLabel,
  onLabel,
}: ToggleSwitchProps) {
  const id = useId();

  const sizes = {
    sm: { track: 'h-6 w-11', thumb: 'h-4 w-4', translate: 'translate-x-5', padding: 'p-0.5', dot: 'w-1 h-1' },
    md: { track: 'h-7 w-12', thumb: 'h-5 w-5', translate: 'translate-x-5', padding: 'p-0.5', dot: 'w-1.5 h-1.5' },
    lg: { track: 'h-8 w-14', thumb: 'h-6 w-6', translate: 'translate-x-6', padding: 'p-1', dot: 'w-2 h-2' },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      {/* Off label */}
      {offLabel && (
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-emerald-text-muted' : 'text-emerald-primary'}`}>
          {offLabel}
        </span>
      )}

      {/* Switch track */}
      <div className="relative">
        {/* Hidden native checkbox for accessibility */}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
        />

        {/* Track background */}
        <label
          htmlFor={id}
          className={`
            relative inline-flex items-center ${s.track} ${s.padding} rounded-full
            transition-all duration-300 ease-out
            ${checked
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.4)]'
              : 'bg-emerald-outline/30 hover:bg-emerald-outline/50'
            }
            focus-within:ring-2 focus-within:ring-emerald-primary focus-within:ring-offset-2
            ${disabled ? '' : 'cursor-pointer'}
          `}
        >
          {/* Thumb */}
          <span
            className={`
              ${s.thumb} rounded-full bg-white shadow-lg
              flex items-center justify-center
              transition-transform duration-300 cubic-bezier(0.68, -0.55, 0.27, 1.55)
              ${checked ? s.translate : 'translate-x-0'}
            `}
          >
            {/* Inner dot that pulses when on */}
            <span
              className={`
                ${s.dot} rounded-full
                transition-all duration-300
                ${checked ? 'bg-emerald-400 scale-100' : 'bg-emerald-300 scale-50'}
              `}
            />
          </span>
        </label>

        {/* Subtle glow ring when on */}
        {checked && (
          <span className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md -z-10 animate-pulse" />
        )}
      </div>

      {/* On label */}
      {onLabel && (
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-emerald-primary' : 'text-emerald-text-muted'}`}>
          {onLabel}
        </span>
      )}

      {/* Screen reader description */}
      {description && (
        <span id={`${id}-desc`} className="sr-only">
          {description}
        </span>
      )}
    </div>
  );
}
