import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'text-stone-950 font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 active:from-amber-600 active:to-orange-600 focus:ring-amber-500 shadow-sm shadow-amber-500/25 rounded-xl transition-all',
    secondary: 'text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-[#1a1b20] hover:bg-stone-200 dark:hover:bg-[#23242b] border border-stone-200 dark:border-stone-800 focus:ring-amber-500 rounded-xl',
    outline: 'text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-800 bg-transparent hover:bg-stone-100 dark:hover:bg-[#1a1b20] focus:ring-amber-500 rounded-xl',
    danger: 'text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 rounded-xl',
    ghost: 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-[#1a1b20] rounded-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

