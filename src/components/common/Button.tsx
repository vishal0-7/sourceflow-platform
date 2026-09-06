import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'chip' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none select-none disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-body-sm rounded gap-1.5',
    md: 'px-3.5 py-1.5 text-body-sm rounded gap-2',
    lg: 'px-4 py-2 text-body-md rounded-md gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
    secondary: 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/60',
    outline: 'border border-outline-variant hover:bg-surface-container-low text-on-surface',
    destructive: 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error',
    chip: 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-md font-code-sm text-code-sm',
    ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
