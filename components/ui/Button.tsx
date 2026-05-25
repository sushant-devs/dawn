'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md';
  rounded?: 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'font-medium transition-all cursor-pointer';
  const sizeClass = size === 'md' ? 'px-4 py-2 text-sm' : '';
  const roundedClass = rounded === 'lg' ? 'rounded-lg' : '';
  const variantClass =
    variant === 'primary'
      ? 'bg-gradient-to-r from-[#2E5BFF] to-[#1A3FCC] text-white hover:shadow-md'
      : 'text-gray-500 hover:text-dawn-navy border border-dawn-border hover:bg-gray-50';

  return (
    <button
      className={`${base} ${sizeClass} ${roundedClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
