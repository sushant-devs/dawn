'use client';

import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string;
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  rounded?: 'md' | 'lg' | 'xl' | 'full';
  width?: number | string;
  height?: number | string;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-r from-dawn-teal to-blue-500 text-white shadow-md shadow-dawn-teal/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-dawn-teal/40',
  secondary:
    'border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300/80',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
};

const roundedClasses: Record<NonNullable<ButtonProps['rounded']>, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

function toCssSize(value?: number | string): string | undefined {
  if (typeof value === 'number') return `${value}px`;
  return value;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    label,
    children,
    icon,
    iconPosition = 'left',
    isLoading = false,
    loadingLabel = 'Loading...',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    rounded = 'xl',
    width,
    height,
    className = '',
    disabled,
    style,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = Boolean(disabled || isLoading);
  const content = children ?? label;
  const customStyle: CSSProperties = {
    ...style,
    width: toCssSize(width) ?? style?.width,
    height: toCssSize(height) ?? style?.height,
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      style={customStyle}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none',
        sizeClasses[size],
        variantClasses[variant],
        roundedClasses[rounded],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-current" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          {content}
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </button>
  );
});

export default Button;
