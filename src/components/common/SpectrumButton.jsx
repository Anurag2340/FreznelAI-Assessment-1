import React from 'react';

/**
 * SpectrumButton
 * Adheres to Adobe Spectrum design system styling:
 * Variants: primary, secondary, quiet, negative, accent
 */
export function SpectrumButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon = null,
  type = 'button',
  className = '',
  id,
  title,
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-150 rounded cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1473e6] disabled:opacity-50 disabled:cursor-not-allowed text-nowrap";

  const sizeClasses = {
    small: "h-7 px-2.5 text-xs gap-1.5",
    medium: "h-8 px-3.5 text-sm gap-2",
    large: "h-10 px-4 text-base gap-2.5"
  };

  const variantClasses = {
    primary: "bg-[#1473e6] hover:bg-[#0d66d0] active:bg-[#095aba] text-white border border-[#1473e6]",
    secondary: "bg-transparent dark:bg-[#262626] dark:hover:bg-[#323232] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#404040] hover:bg-neutral-100",
    quiet: "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#2c2c2c] border-transparent",
    negative: "bg-[#d7373f] hover:bg-[#b82a32] text-white border border-[#d7373f]",
    accent: "bg-[#058b8c] hover:bg-[#047778] text-white border border-[#058b8c]"
  };

  return (
    <button
      id={id}
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
}
