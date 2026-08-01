import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent' | 'cta' | 'primary-gradient' | 'accent-gradient';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'text-white bg-brand-500 hover:bg-brand-600 shadow-sm shadow-brand-500/20',
  secondary: 'text-surface-700 bg-surface-100 hover:bg-surface-200',
  outline: 'text-surface-600 bg-transparent border border-surface-300 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50',
  ghost: 'text-surface-400 hover:text-surface-600 hover:bg-surface-100',
  danger: 'text-white bg-coral-500 hover:bg-coral-600 shadow-sm shadow-coral-500/20',
  accent: 'text-white bg-accent-500 hover:bg-accent-600 shadow-sm shadow-accent-500/20',
  cta: 'text-white bg-mint-500 hover:bg-mint-600 shadow-sm shadow-mint-500/20',
  'primary-gradient': 'text-white bg-gradient-brand shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5',
  'accent-gradient': 'text-white bg-gradient-accent shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30 hover:-translate-y-0.5',
};

const sizeStyles = {
  sm: 'h-9 px-4 text-xs gap-1.5 rounded-xl',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2 rounded-2xl',
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
