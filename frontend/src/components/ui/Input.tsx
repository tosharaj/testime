import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-surface-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-surface-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400',
              'disabled:opacity-50 disabled:bg-surface-50',
              icon && 'pl-10',
              error && 'border-coral-400 focus:ring-coral-500/30 focus:border-coral-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-coral-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
